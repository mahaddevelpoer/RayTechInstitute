import {
  ClassItem,
  SubjectItem,
  NoteItem,
  MCQItem,
  PastPaperItem,
  GazetteItem,
  BlogPostItem,
  VideoInteractiveMCQ,
} from '@/types/educational';

// ── SEED DATA (Plain Static Constants - Server & Client Safe) ───────────────────

export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: 'class-11',
    slug: '11th-class',
    title: '11th Class (1st Year HSSC-I)',
    numericGrade: 11,
    description: 'Complete academic syllabus, textbooks, helping notes, MCQs tests, and past papers for Intermediate Part 1.',
    isActive: true,
  },
  {
    id: 'class-12',
    slug: '12th-class',
    title: '12th Class (2nd Year HSSC-II)',
    numericGrade: 12,
    description: 'Comprehensive study material, chapter-wise MCQs with compiler practice, solved notes, and board gazettes for Intermediate Part 2.',
    isActive: true,
  },
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'subj-11-cs',
    classSlug: '11th-class',
    slug: 'computer-science',
    title: 'Computer Science',
    iconName: 'Code',
    description: 'Computing fundamentals, Information Networks, Data Communication, Operating Systems, and Word Processing.',
  },
  {
    id: 'subj-11-phy',
    classSlug: '11th-class',
    slug: 'physics',
    title: 'Physics',
    iconName: 'Atom',
    description: 'Measurements, Vectors, Motion & Force, Work & Energy, Circular Motion, and Thermodynamics.',
  },
  {
    id: 'subj-11-math',
    classSlug: '11th-class',
    slug: 'mathematics',
    title: 'Mathematics',
    iconName: 'Calculator',
    description: 'Number Systems, Sets, Matrices, Quadratic Equations, Trigonometry, and Vectors.',
  },
  {
    id: 'subj-12-cs',
    classSlug: '12th-class',
    slug: 'computer-science',
    title: 'Computer Science',
    iconName: 'Code',
    description: 'Database Concepts, MS Access, Structured Programming in C / Python, Functions, and Pointers.',
  },
  {
    id: 'subj-12-phy',
    classSlug: '12th-class',
    slug: 'physics',
    title: 'Physics',
    iconName: 'Atom',
    description: 'Electrostatics, Current Electricity, Electromagnetism, Electronics, and Modern Physics.',
  },
  {
    id: 'subj-12-chem',
    classSlug: '12th-class',
    slug: 'chemistry',
    title: 'Chemistry',
    iconName: 'FlaskConical',
    description: 'Periodic Classification, s/p/d block elements, Fundamental Principles of Organic Chemistry, and Hydrocarbons.',
  },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-11-cs-ch1',
    classSlug: '11th-class',
    subjectSlug: 'computer-science',
    chapterNumber: 1,
    chapterTitle: 'Overview of Computer System',
    title: 'Chapter 1: Hardware, Software & Computing Hierarchy Complete Notes',
    description: 'Concise summary of Input/Output devices, CPU architecture, RAM vs ROM, and system software types with solved conceptual questions.',
    pdfUrl: '',
    fileSize: '2.4 MB',
    downloadCount: 1420,
    lastUpdated: '2026-09-15',
  },
  {
    id: 'note-11-cs-ch2',
    classSlug: '11th-class',
    subjectSlug: 'computer-science',
    chapterNumber: 2,
    chapterTitle: 'Information Networks',
    title: 'Chapter 2: LAN, WAN, MAN & Network Topologies Solved Notes',
    description: 'Complete breakdown of OSI Model layers, TCP/IP protocol suite, Network Topologies (Bus, Star, Ring, Mesh), and Client-Server architecture.',
    pdfUrl: '',
    fileSize: '3.1 MB',
    downloadCount: 1890,
    lastUpdated: '2026-09-20',
  },
  {
    id: 'note-12-cs-ch1',
    classSlug: '12th-class',
    subjectSlug: 'computer-science',
    chapterNumber: 1,
    chapterTitle: 'Data Basics & Database Systems',
    title: 'Chapter 1: Database Management Systems & Relational Architecture',
    description: 'Comprehensive analysis of Traditional File Systems vs DBMS, Relational keys (Primary, Foreign, Candidate), and Normalization up to 3NF.',
    pdfUrl: '',
    fileSize: '4.2 MB',
    downloadCount: 2310,
    lastUpdated: '2026-09-28',
  },
  {
    id: 'note-12-cs-ch8',
    classSlug: '12th-class',
    subjectSlug: 'computer-science',
    chapterNumber: 8,
    chapterTitle: 'Getting Started with C & Python',
    title: 'Chapter 8: Structured Programming, Compilers & Syntax Rules',
    description: 'Introduction to source code, compilers vs interpreters, variable declaration, data types, and standard library functions.',
    pdfUrl: '',
    fileSize: '3.8 MB',
    downloadCount: 3105,
    lastUpdated: '2026-10-02',
  },
];

export const INITIAL_MCQS: MCQItem[] = [
  {
    id: 'mcq-11-cs-1',
    classSlug: '11th-class',
    subjectSlug: 'computer-science',
    chapterNumber: 1,
    question: 'Which of the following translates high-level programming language code into machine code line-by-line?',
    options: ['Compiler', 'Interpreter', 'Assembler', 'Linker'],
    correctIndex: 1,
    explanation: 'An Interpreter executes instructions line-by-line and halts immediately upon encountering a syntax error, unlike a compiler which translates the whole program at once.',
  },
  {
    id: 'mcq-11-cs-2',
    classSlug: '11th-class',
    subjectSlug: 'computer-science',
    chapterNumber: 1,
    question: 'What is the output of the following Python expression?',
    codeSnippet: 'numbers = [1, 2, 3, 4]\nresult = [x * 2 for x in numbers if x % 2 == 0]\nprint(result)',
    options: ['[2, 4, 6, 8]', '[4, 8]', '[2, 6]', '[4]'],
    correctIndex: 1,
    explanation: 'The list comprehension filters even numbers (2 and 4) and multiplies each by 2, yielding [4, 8]. Test this directly in the side compiler!',
  },
  {
    id: 'mcq-11-cs-3',
    classSlug: '11th-class',
    subjectSlug: 'computer-science',
    chapterNumber: 2,
    question: 'Which network topology requires a central terminator or hub, where failure of the central node halts the whole network?',
    options: ['Bus Topology', 'Star Topology', 'Ring Topology', 'Mesh Topology'],
    correctIndex: 1,
    explanation: 'In a Star topology, all workstations connect to a central hub/switch. If the hub fails, network transmission stops completely.',
  },
  {
    id: 'mcq-12-cs-1',
    classSlug: '12th-class',
    subjectSlug: 'computer-science',
    chapterNumber: 1,
    question: 'A candidate key that is chosen by the database designer as the principal identifier for a relation is called a:',
    options: ['Foreign Key', 'Primary Key', 'Secondary Key', 'Composite Key'],
    correctIndex: 1,
    explanation: 'A Primary Key uniquely identifies each record in a database relation and cannot contain NULL values.',
  },
  {
    id: 'mcq-12-cs-2',
    classSlug: '12th-class',
    subjectSlug: 'computer-science',
    chapterNumber: 8,
    question: 'What is printed by this control flow snippet?',
    codeSnippet: 'total = 0\nfor i in range(1, 5):\n    if i == 3:\n        continue\n    total += i\nprint(total)',
    options: ['10', '7', '6', '4'],
    correctIndex: 1,
    explanation: 'Loop iterates i = 1, 2, 3, 4. When i=3, continue skips addition. Total = 1 + 2 + 4 = 7.',
  },
  {
    id: 'mcq-12-cs-3',
    classSlug: '12th-class',
    subjectSlug: 'computer-science',
    chapterNumber: 8,
    question: 'Which escape character in string formatting moves the cursor to the beginning of the next line?',
    codeSnippet: 'print("First Line\\nSecond Line")',
    options: ['\\t', '\\n', '\\r', '\\b'],
    correctIndex: 1,
    explanation: '\\n represents the newline control character in C, C++, and Python.',
  },
];

export const INITIAL_PAST_PAPERS: PastPaperItem[] = [
  {
    id: 'pp-11-cs-lhr-2024',
    classSlug: '11th-class',
    subjectSlug: 'computer-science',
    board: 'BISE Lahore',
    year: 2024,
    session: 'Annual',
    pdfUrl: '',
  },
  {
    id: 'pp-11-cs-fbise-2024',
    classSlug: '11th-class',
    subjectSlug: 'computer-science',
    board: 'Federal Board (FBISE)',
    year: 2024,
    session: 'Annual',
    pdfUrl: '',
  },
  {
    id: 'pp-12-cs-lhr-2024',
    classSlug: '12th-class',
    subjectSlug: 'computer-science',
    board: 'BISE Lahore',
    year: 2024,
    session: 'Annual',
    pdfUrl: '',
  },
  {
    id: 'pp-12-cs-grw-2024',
    classSlug: '12th-class',
    subjectSlug: 'computer-science',
    board: 'BISE Gujranwala',
    year: 2024,
    session: 'Annual',
    pdfUrl: '',
  },
];

export const INITIAL_GAZETTES: GazetteItem[] = [
  {
    id: 'gazette-lhr-12th-2026',
    title: 'BISE Lahore 12th Class Result Gazette 2026 (HSSC Part 2 Annual)',
    board: 'BISE Lahore',
    classSlug: '12th-class',
    year: 2026,
    session: '1st Annual',
    pdfUrl: '',
    directResultUrl: 'https://www.biselahore.com/',
    releaseDate: '2026-09-12',
    totalCandidates: '194,520 Candidates',
    passingPercentage: '68.4%',
  },
  {
    id: 'gazette-grw-12th-2026',
    title: 'BISE Gujranwala 12th Class Result Gazette 2026 (2nd Year)',
    board: 'BISE Gujranwala',
    classSlug: '12th-class',
    year: 2026,
    session: '1st Annual',
    pdfUrl: '',
    directResultUrl: 'https://bisegrw.edu.pk/',
    releaseDate: '2026-09-12',
    totalCandidates: '142,110 Candidates',
    passingPercentage: '65.2%',
  },
  {
    id: 'gazette-fbise-12th-2026',
    title: 'Federal Board (FBISE) HSSC Part 2 Result Gazette 2026',
    board: 'Federal Board (FBISE)',
    classSlug: '12th-class',
    year: 2026,
    session: 'Annual Examination',
    pdfUrl: '',
    directResultUrl: 'https://www.fbise.edu.pk/',
    releaseDate: '2026-08-25',
    totalCandidates: '86,400 Candidates',
    passingPercentage: '79.1%',
  },
  {
    id: 'gazette-lhr-11th-2026',
    title: 'BISE Lahore 11th Class Result Gazette 2026 (HSSC Part 1 Annual)',
    board: 'BISE Lahore',
    classSlug: '11th-class',
    year: 2026,
    session: '1st Annual',
    pdfUrl: '',
    directResultUrl: 'https://www.biselahore.com/',
    releaseDate: '2026-10-05',
    totalCandidates: '185,200 Candidates',
    passingPercentage: '61.8%',
  },
];

export const INITIAL_BLOGS: BlogPostItem[] = [
  {
    id: 'blog-datesheet-inter-2026',
    title: 'Punjab Boards 11th & 12th Class Annual Date Sheet 2026 Announced',
    slug: 'punjab-boards-inter-date-sheet-2026',
    category: 'date-sheets',
    excerpt: 'Official exam schedule and date sheet for Intermediate Part 1 and Part 2 first annual examination across all Punjab educational boards.',
    content: `The Punjab Boards Committee of Chairmen (PBCC) has formally issued the finalized examination schedule for Intermediate (HSSC Part 1 & Part 2) Annual Examination 2026.

### Key Dates for Intermediate Examinations:
- **12th Class (2nd Year) Examinations Start**: May 12, 2026
- **11th Class (1st Year) Examinations Start**: June 04, 2026
- **Practical Examinations Commencement**: July 08, 2026

All registered candidates are instructed to download and verify their roll number slips through their respective board portals at least two weeks prior to commencement.

### Exam Guidelines for Candidates:
1. Ensure roll number slip carries the attested photograph and principal seal.
2. Electronic gadgets, smart watches, and programmable calculators are strictly prohibited inside examination centers.
3. Morning session exams begin at 08:30 AM; evening session commences at 01:30 PM.`,
    featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    author: 'Academic Coordination Committee',
    datePublished: '2026-09-20',
    readTime: '3 min read',
    tags: ['Date Sheet', '11th Class', '12th Class', 'BISE Lahore', 'PBCC'],
  },
  {
    id: 'blog-admission-fast-nu-2026',
    title: 'FAST NUCES & Punjab University Admissions 2026: Eligibility & Schedule',
    slug: 'fast-nuces-punjab-university-admissions-2026',
    category: 'admissions',
    excerpt: 'Comprehensive guide to BS Computer Science, Software Engineering, and AI admissions criteria, merit calculation, and entry test patterns.',
    content: `Admissions for undergraduate programs at leading engineering and computing institutes in Pakistan are opening for the Fall 2026 academic cycle.

### Key Admissions Calendar:
- **FAST-NUCES Online Application Deadline**: July 05, 2026
- **FAST Entry Test Dates**: July 10 to July 22, 2026
- **Punjab University Entry Test Registration**: June 01, 2026

### Recommended Preparation Strategy:
Students with F.Sc Pre-Engineering and ICS (Mathematics + Computer Science) should concentrate primarily on Basic Mathematics, Advanced Analytical Reasoning, and English proficiency modules.`,
    featuredImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    author: 'Admissions Advisory Desk',
    datePublished: '2026-09-25',
    readTime: '4 min read',
    tags: ['Admissions', 'FAST NUCES', 'Computer Science', 'Entry Test'],
  },
  {
    id: 'blog-career-cs-vs-se',
    title: 'Computer Science vs Software Engineering: Complete Career Roadmap',
    slug: 'computer-science-vs-software-engineering-career-guide',
    category: 'career-guides',
    excerpt: 'Detailed comparison of syllabus focus, industry demand, high-growth specializations, and salary trajectories for intermediate graduates.',
    content: `Intermediate students completing F.Sc Pre-Engineering or ICS frequently inquire whether Computer Science (BS CS) or Software Engineering (BS SE) represents the optimal career path.

### Core Distinctions:
- **Computer Science (BS CS)**: Emphasizes theoretical foundations of computing, algorithm complexity, computational theory, machine learning, and operating systems.
- **Software Engineering (BS SE)**: Emphasizes software architecture, project management, quality assurance, system scalability, and enterprise engineering workflows.

### Industry Demand Analysis:
Both degrees offer equitable employment opportunities across multinational software houses, cloud providers, and fintech startups. Students are advised to develop strong practical programming portfolios on GitHub and solve algorithmic challenges.`,
    featuredImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    author: 'Industry Research Cell',
    datePublished: '2026-10-01',
    readTime: '5 min read',
    tags: ['Career Guide', 'Computer Science', 'Software Engineering', 'ICS'],
  },
];

export const INITIAL_VIDEO_MCQS: VideoInteractiveMCQ[] = [
  {
    id: 'vmcq-01',
    videoId: 'XkdVttPuDF0',
    videoTitle: 'Basic Python Syntax & Structure | Python Comments',
    timestampSeconds: 90,
    timestampFormatted: '01:30',
    topic: 'Python Indentation Syntax',
    question: 'In Python, which character is used at the end of header statements (like if, for, def) to introduce an indented block?',
    options: [
      'A colon (:)',
      'A semicolon (;)',
      'Curly braces ({})',
      'An arrow (->)'
    ],
    correctIndex: 0,
    explanation: 'Python uses a colon (:) at the end of header statements to start an indented block of code, instead of curly braces used in C/C++.',
  },
  {
    id: 'vmcq-02',
    videoId: 'XkdVttPuDF0',
    videoTitle: 'Basic Python Syntax & Structure | Python Comments',
    timestampSeconds: 225,
    timestampFormatted: '03:45',
    topic: 'Single-Line Comments in Python',
    question: 'Which symbol is utilized for writing single-line comments in Python source code?',
    options: [
      '// (Double slash)',
      '# (Hash / Pound)',
      '/* */ (Block delimiters)',
      '-- (Double dash)'
    ],
    correctIndex: 1,
    explanation: 'The hash symbol (#) is used in Python for single-line comments. The Python interpreter completely ignores anything after # on that line.',
  },
  {
    id: 'vmcq-03',
    videoId: 'XkdVttPuDF0',
    videoTitle: 'Basic Python Syntax & Structure | Python Comments',
    timestampSeconds: 375,
    timestampFormatted: '06:15',
    topic: 'Input Function & Data Types',
    question: 'What data type does the built-in input() function always return in Python 3?',
    options: [
      'int (Integer)',
      'str (String)',
      'float (Floating Point)',
      'bool (Boolean)'
    ],
    correctIndex: 1,
    explanation: 'The input() function always reads user input as a string (str). To use it as a number, explicit type casting like int(input()) or float(input()) is required.',
  },
  {
    id: 'vmcq-04',
    videoId: 'DenGlHi9YQ8',
    videoTitle: 'How to Run Python in Visual Studio Code on Windows',
    timestampSeconds: 150,
    timestampFormatted: '02:30',
    topic: 'VS Code Python Extension',
    question: 'Which official extension is essential to enable IntelliSense, debugging, and code formatting for Python in VS Code?',
    options: [
      'Python (by Microsoft)',
      'PyCharm Pro Plugin',
      'Node.js Tools',
      'C/C++ Extension Pack'
    ],
    correctIndex: 0,
    explanation: 'The official Python extension by Microsoft provides rich language support, syntax highlighting, IntelliSense (Pylance), and integrated terminal execution.',
  },
  {
    id: 'vmcq-05',
    videoId: 'LeSL8FP0Cuk',
    videoTitle: 'SDLC (Software Development Life Cycle) | Part 2',
    timestampSeconds: 180,
    timestampFormatted: '03:00',
    topic: 'SDLC Testing Phase',
    question: 'What is the primary objective of the Testing Phase in the Software Development Life Cycle (SDLC)?',
    options: [
      'Writing the initial source code',
      'Discovering and resolving bugs, syntax, and logic errors before deployment',
      'Gathering stakeholder hardware requirements',
      'Designing database ER diagrams'
    ],
    correctIndex: 1,
    explanation: 'The Testing Phase rigorously validates the application against requirements to identify defects, errors, and performance issues before releasing to production.',
  },
];
