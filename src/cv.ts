export const role = 'Ph.D. Student';

/**
 * `detail` and `where` are both optional: a teaching entry has no location to
 * give, and an award is often just a name and a year. Sections with no items
 * are skipped entirely rather than leaving a stranded heading.
 */
interface Entry {
  title: string;
  detail?: string;
  when: string;
  where?: string;
  /**
   * Turns the title into a link. For the entries whose name is opaque on its
   * own — a scholarship named after the project that funds it explains nothing
   * to a reader who has not heard of the project.
   */
  href?: string;
}

export const sections: { heading: string; items: Entry[] }[] = [
  {
    heading: 'Education',
    items: [
      {
        title: 'University of Auckland',
        detail: 'Ph.D. in Computer Science, advised by Elliott Wen and Valerio Terragni.',
        when: 'Jul 2026 — now',
        where: 'Auckland, New Zealand',
      },
      {
        title: 'University of Auckland',
        detail: 'Master of Science in Computer Science, First Class Honours.',
        when: 'Nov 2024 — Feb 2026',
        where: 'Auckland, New Zealand',
      },
    ],
  },
  {
    heading: 'Experience',
    items: [
      {
        title: 'Robotics Lab, University of Auckland',
        detail: 'Research Assistant.',
        when: 'Jul 2026 — now',
        where: 'Auckland, New Zealand',
      },
      {
        title: 'HASEL, University of Auckland',
        detail: 'Member.',
        when: 'Mar 2026 — now',
        where: 'Auckland, New Zealand',
        href: 'https://hasel.auckland.ac.nz/',
      },
    ],
  },
  {
    heading: 'Teaching',
    items: [
      {
        title: 'SOFTENG 325 — Software Architecture',
        href: 'https://study.auckland.ac.nz/ords/r/uoa/catalogue/course?p6_code=SOFTENG+325&p0_catalogue_year=2026&p0_catalogue_term=Two',
        detail: 'Teaching Assistant, University of Auckland.',
        when: 'Aug 2026 — now',
      },
      {
        title: 'COMPSCI 331 — Large-Scale Software Development',
        href: 'https://study.auckland.ac.nz/ords/r/uoa/catalogue/course?p6_code=COMPSCI+331&p0_catalogue_year=2026&p0_catalogue_term=One',
        detail: 'Teaching Assistant, University of Auckland.',
        when: 'Mar — Jun 2026',
      },
      {
        title: 'COMPSCI 702 — Security for Smart-Devices',
        href: 'https://study.auckland.ac.nz/ords/r/uoa/catalogue/course?p6_code=COMPSCI+702&p0_catalogue_year=2026&p0_catalogue_term=One',
        detail: 'Teaching Assistant, University of Auckland.',
        when: 'Mar — Jun 2026',
      },
    ],
  },
  {
    heading: 'Awards',
    items: [
      {
        title: 'Tūwhana Doctoral Scholarship',
        detail: 'Full funding, from the MBIE Endeavour Fund.',
        when: '2026',
        href: 'https://ssc-fort.github.io/',
      },
      {
        title: 'First in Course — COMPSCI 702',
        href: 'https://www.auckland.ac.nz/en/study/scholarships-and-awards/find-a-scholarship/first-in-course-award-650-all.html',
        detail: 'University of Auckland.',
        when: '2025',
      },
    ],
  },
];

