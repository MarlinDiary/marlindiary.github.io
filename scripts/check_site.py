"""Offline checks for Astro's generated site. Python 3 standard library only."""
import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from xml.etree import ElementTree as ET


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.tags, self.structured, self.visible = [], [], []
        self.body = False
        self.hidden = None
        self.script = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == 'body':
            self.body = True
        if tag in ('script', 'style'):
            self.hidden = tag
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.script = ''

    def handle_data(self, text):
        if self.script is not None:
            self.script += text
        if self.body and not self.hidden:
            self.visible.append(text)

    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None:
            self.structured.append(self.script)
            self.script = None
        if tag == self.hidden:
            self.hidden = None
        if tag == 'body':
            self.body = False

    def find(self, tag, **attrs):
        return [a for t, a in self.tags if t == tag and all(a.get(k) == v for k, v in attrs.items())]

    @property
    def noindex(self):
        return any(re.search(r'\bnoindex\b', a.get('content', ''), re.I)
                   for a in self.find('meta', name='robots'))


def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)


def check_site(root, source=None):
    root = Path(root).resolve()
    errors = []

    def require(condition, message):
        if not condition:
            errors.append(message)

    origin = 'https://' + (root / 'CNAME').read_text().strip()
    llms = (root / 'llms.txt').read_text()
    pages = {}
    for file in root.rglob('*.html'):
        html = file.read_text()
        # Ownership proofs are intentionally bare text, not website pages.
        if not re.search(r'<html\b', html, re.I):
            continue
        rel = file.relative_to(root).as_posix()
        url = origin + '/' + (rel[:-10] if rel.endswith('index.html') else rel)
        pages[file] = (url, Page(html), html)
    require(bool(pages), 'No HTML pages found')

    def resolve(href, base):
        url = urlsplit(urljoin(base, href))
        if url.scheme not in ('http', 'https') or url.netloc != urlsplit(origin).netloc:
            return None, url
        path = (root / unquote(url.path).lstrip('/')).resolve()
        if not path.is_relative_to(root):
            return None, url
        if path.is_dir():
            path /= 'index.html'
        elif not path.exists() and not path.suffix:
            path = path.with_suffix('.html')
        return path, url

    def check_link(href, base):
        path, url = resolve(href, base)
        if path is None:
            return
        require(path.is_file(), f'{base}: missing local target {href}')
        if url.fragment and not url.fragment.startswith(':~:') and path in pages:
            ids = [a.get('id') for _, a in pages[path][1].tags]
            require(unquote(url.fragment) in ids, f'{base}: missing fragment {href}')

    indexable = set()
    for file, (url, page, html) in pages.items():
        titles = re.findall(r'<title\b[^>]*>(.*?)</title>', html, re.S | re.I)
        require(len(titles) == 1 and bool(titles[0].strip()), f'{url}: invalid title')
        descriptions = page.find('meta', name='description')
        require(len(descriptions) == 1 and bool(descriptions[0].get('content', '').strip()),
                f'{url}: missing or duplicate description')
        require(len(page.find('h1')) == 1, f'{url}: expected one h1')
        canonicals = page.find('link', rel='canonical')
        if page.noindex:
            require(not canonicals, f'{url}: noindex page should not declare a canonical')
        else:
            indexable.add(url)
            require([a.get('href') for a in canonicals] == [url], f'{url}: incorrect canonical')
        require(page.find('link', rel='describedby', href='/llms.txt'), f'{url}: missing llms link')
        ids = [a['id'] for _, a in page.tags if 'id' in a]
        require(len(ids) == len(set(ids)), f'{url}: duplicate id')
        for tag, attrs in page.tags:
            for key in ('href', 'src', 'poster'):
                if attrs.get(key):
                    check_link(attrs[key], url)
            if attrs.get('srcset') and not attrs['srcset'].startswith('data:'):
                for candidate in attrs['srcset'].split(','):
                    check_link(candidate.strip().split()[0], url)
        for raw in page.structured:
            try:
                data = json.loads(raw)
            except ValueError as exc:
                errors.append(f'{url}: invalid JSON-LD: {exc}')
                continue
            require(isinstance(data, dict) and data.get('@context') == 'https://schema.org',
                    f'{url}: JSON-LD missing schema.org context')
            for node in nodes(data):
                if node.get('@type') == 'ScholarlyArticle':
                    require(bool(node.get('headline')) and bool(node.get('url'))
                            and node['headline'] in llms and node['url'] in llms,
                            f'{url}: paper missing from llms.txt')
                if node.get('@type') == 'Person' and node.get('@id') == origin + '/#person':
                    name = node.get('name', '')
                    require(not name or name in llms, f'{url}: person missing from llms.txt')
                    for member in nodes(node.get('memberOf', [])):
                        require(member.get('name', '') in ' '.join(page.visible),
                                f'{url}: membership absent from visible page')
                for author in nodes(node.get('author', [])):
                    # An author whose homepage is this site must use its identity anchor.
                    if author.get('url') == origin + '/':
                        require(author.get('@id') == origin + '/#person',
                                f'{url}: author identity not linked')

    sitemap_urls = []
    for file in sorted(root.glob('sitemap*.xml')):
        try:
            tree = ET.parse(file)
            for loc in tree.findall('.//{*}loc'):
                check_link(loc.text, origin + '/')
                if tree.getroot().tag.endswith('urlset'):
                    sitemap_urls.append(loc.text)
        except ET.ParseError as exc:
            errors.append(f'{file.name}: invalid XML: {exc}')
    require(Counter(sitemap_urls) == Counter(indexable), 'Sitemap differs from indexable HTML pages')
    try:
        feed = ET.parse(root / 'rss.xml')
        for item in feed.findall('./channel/item'):
            link = item.findtext('link')
            require(link in indexable, f'RSS references non-indexable page: {link}')
    except ET.ParseError as exc:
        errors.append(f'rss.xml: invalid XML: {exc}')
    if source:
        for file in Path(source).rglob('*'):
            if file.suffix not in ('.md', '.mdx'):
                continue
            frontmatter = file.read_text().split('---', 2)
            if len(frontmatter) == 3 and re.search(r'^draft:\s*true\s*(?:#.*)?$', frontmatter[1], re.M):
                slug = file.relative_to(source).with_suffix('').as_posix().lower()
                require(origin + '/blog/' + slug + '/' not in indexable,
                        f'Draft published: {file.name}')
    return errors, len(pages)


if __name__ == '__main__':
    try:
        errors, count = check_site(sys.argv[1] if len(sys.argv) > 1 else 'dist', 'src/content/blog')
    except (OSError, ValueError) as exc:
        errors, count = [str(exc)], 0
    for error in errors:
        print('FAIL:', error)
    if not errors:
        print(f'PASS: {count} HTML pages; metadata, canonical, local links, JSON-LD, sitemap/RSS and llms.txt')
    sys.exit(bool(errors))
