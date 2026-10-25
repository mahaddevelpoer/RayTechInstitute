import { SubjectModule } from '@/types';

export const subjectsData: SubjectModule[] = [
  {
    id: "sub-01",
    code: "01",
    title: "Computer Science",
    category: "Computer Science",
    description: "Theoretical underpinnings of computational architecture, data flow cycles, digital logic circuits, and formal software engineering lifecycle methodologies.",
    topics: [
      "Information Processing Cycle (IPOS)",
      "Digital Logic Gates & Boolean Algebra",
      "Software Development Life Cycle (SDLC)",
      "Class-wise Curriculum & Assessment Standards"
    ],
    lectureCount: 6
  },
  {
    id: "sub-02",
    code: "02",
    title: "Programming",
    category: "Programming",
    description: "Structured procedural and object-oriented programming fundamentals with rigorous attention to syntax rules, data types, compilation pipelines, and memory models.",
    topics: [
      "Python 3 Core Syntax, Statements & Indentation",
      "C++ Architecture, Preprocessors & Namespaces",
      "Standard I/O Streams (`cout`, insertion operators)",
      "Source Code Compilation & Execution Mechanics"
    ],
    lectureCount: 6
  },
  {
    id: "sub-03",
    code: "03",
    title: "Web",
    category: "Web",
    description: "Foundational hypertext standards, semantic document structuring, hierarchy conventions, and the core structural backbone of web application development.",
    topics: [
      "HTML5 Document Specifications & DOCTYPE",
      "Element Semantics vs Display Attributes",
      "Heading Structures (H1–H6) & Text Content Blocks",
      "Standard Document Tree Architecture"
    ],
    lectureCount: 1
  },
  {
    id: "sub-04",
    code: "04",
    title: "Development Tools",
    category: "Development Tools",
    description: "Configuring industry-standard integrated development environments, compiler toolchains, build automation systems, and developer terminal workflows.",
    topics: [
      "Visual Studio Code Windows Setup & System PATH Integration",
      "JetBrains CLion Installation, MinGW & CMake Configuration",
      "VS Code Python Extension & Integrated Terminal Workflows",
      "Compiler Diagnostics & Debugging Setup"
    ],
    lectureCount: 3
  }
];
