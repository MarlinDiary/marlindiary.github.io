"""Mutation tests: prove the release checks reject broken output."""
import tempfile
import unittest
from pathlib import Path

from check_site import check_site


class SiteChecks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.html = '''<!doctype html><html><head><title>Example</title>
<meta name="description" content="Example profile">
<link rel="canonical" href="https://example.com/">
<link rel="describedby" href="/llms.txt"></head>
<body><h1 id="name">Example</h1><a href="#name">Name</a></body></html>'''
        self.write('index.html', self.html)
        self.write('CNAME', 'example.com')
        self.write('llms.txt', '# Example\n')
        self.write('sitemap-0.xml', '<urlset><url><loc>https://example.com/</loc></url></urlset>')
        self.write('rss.xml', '<rss><channel/></rss>')

    def write(self, path, text):
        (self.root / path).write_text(text)

    def reject(self, change, message):
        self.write('index.html', change)
        errors, _ = check_site(self.root)
        self.assertTrue(any(message in error for error in errors), errors)

    def test_valid_site(self):
        self.assertEqual(check_site(self.root), ([], 1))

    def test_verification_file_is_not_a_page(self):
        self.write('ownership.html', 'public-verification-value')
        self.assertEqual(check_site(self.root), ([], 1))

    def test_missing_description(self):
        self.reject(self.html.replace('name="description"', 'name="other"'), 'description')

    def test_wrong_canonical(self):
        self.reject(self.html.replace('href="https://example.com/"', 'href="https://other.com/"'), 'canonical')

    def test_missing_target(self):
        self.reject(self.html.replace('href="#name"', 'href="/missing/"'), 'missing local target')

    def test_missing_fragment(self):
        self.reject(self.html.replace('href="#name"', 'href="#missing"'), 'missing fragment')

    def test_duplicate_id(self):
        self.reject(self.html.replace('<a href=', '<a id="name" href='), 'duplicate id')

    def test_invalid_jsonld(self):
        self.reject(self.html.replace('</head>', '<script type="application/ld+json">{</script></head>'), 'invalid JSON-LD')

    def test_unlinked_author(self):
        schema = '{"@context":"https://schema.org","author":{"url":"https://example.com/"}}'
        self.reject(self.html.replace('</head>', f'<script type="application/ld+json">{schema}</script></head>'), 'author identity')

    def test_hidden_membership(self):
        schema = '{"@context":"https://schema.org","@type":"Person","@id":"https://example.com/#person","memberOf":{"name":"Lab"}}'
        self.reject(self.html.replace('</head>', f'<script type="application/ld+json">{schema}</script></head>'), 'membership absent')

    def test_paper_missing_from_llms(self):
        schema = '{"@context":"https://schema.org","@type":"ScholarlyArticle","headline":"Paper","url":"https://doi.org/example"}'
        self.reject(self.html.replace('</head>', f'<script type="application/ld+json">{schema}</script></head>'), 'paper missing')

    def test_draft_published(self):
        source = self.root / 'source'
        source.mkdir()
        (source / 'hello.md').write_text('---\ntitle: Example\ndraft: true\n---\nText')
        page = self.root / 'blog' / 'hello'
        page.mkdir(parents=True)
        (page / 'index.html').write_text(self.html.replace('href="https://example.com/"', 'href="https://example.com/blog/hello/"'))
        self.assertTrue(any('Draft published' in e for e in check_site(self.root, source)[0]))

    def test_noindex_sitemap_entry(self):
        self.reject(self.html.replace('</head>', '<meta name="robots" content="noindex, follow"></head>'), 'Sitemap differs')

    def test_malformed_sitemap(self):
        self.write('sitemap-0.xml', '<urlset>')
        self.assertTrue(any('invalid XML' in e for e in check_site(self.root)[0]))

    def test_bad_rss_link(self):
        self.write('rss.xml', '<rss><channel><item><link>https://example.com/missing/</link></item></channel></rss>')
        self.assertTrue(any('RSS references' in e for e in check_site(self.root)[0]))


if __name__ == '__main__':
    unittest.main()
