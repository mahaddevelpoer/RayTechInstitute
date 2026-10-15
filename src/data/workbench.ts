import { WorkbenchItem } from '@/types';

export const workbenchData: WorkbenchItem[] = [
  {
    id: "wb-py",
    name: "Python",
    category: "Language",
    role: "Interpreted High-Level Programming Language",
    description: "Emphasizes code readability, clean indentation-based syntax, dynamic typing, and rapid application prototyping across foundational computer science and scripting.",
    specification: "Python 3.x",
    primaryUse: "Introductory Programming, Algorithmic Logic, Academic Curricula",
    relatedLectures: ["Basic Python Syntax & Structure", "Running Python in VS Code"]
  },
  {
    id: "wb-c",
    name: "C",
    category: "Language",
    role: "Procedural Systems Programming Language",
    description: "Direct memory manipulation, structured functional decomposition, minimal runtime overhead, and explicit hardware architectural awareness.",
    specification: "ANSI C / C99 Standard",
    primaryUse: "System Software, Board Syllabus, Memory Fundamentals",
    relatedLectures: ["Pairing Scheme 2nd Year Computer Science"]
  },
  {
    id: "wb-cpp",
    name: "C++",
    category: "Language",
    role: "Compiled General-Purpose Systems Language",
    description: "Combines procedural speed with object-oriented paradigms, strongly typed compilation, zero-cost abstractions, and direct hardware control.",
    specification: "ISO/IEC C++ Standard",
    primaryUse: "Performance Engineering, Object-Oriented Modeling, Desktop Runtimes",
    relatedLectures: ["Intro to C++", "Basic Structure of C++", "How to Run C++ Programs"]
  },
  {
    id: "wb-html",
    name: "HTML",
    category: "Web Standard",
    role: "Hypertext Markup Language",
    description: "The declarative standard describing the structure, semantics, and document tree for browser-rendered computational interfaces.",
    specification: "W3C / WHATWG HTML5",
    primaryUse: "Web Foundation, Semantic Document Outlines, Web Applications",
    relatedLectures: ["HTML Tutorial: Elements, Attributes & Headings"]
  },
  {
    id: "wb-vscode",
    name: "Visual Studio Code",
    category: "Development Environment",
    role: "Extensible Source Code Editor",
    description: "Lightweight, highly modular code editor featuring native Git integration, integrated terminal workspaces, language server protocol (LSP) support, and rich extension ecosystem.",
    specification: "Microsoft VS Code (Windows x64)",
    primaryUse: "Cross-Language Editing, Script Execution, Python Scripting",
    relatedLectures: ["VS Code Installation on Windows", "Running Python in VS Code"]
  },
  {
    id: "wb-clion",
    name: "CLion",
    category: "Development Environment",
    role: "Cross-Platform C & C++ IDE",
    description: "Dedicated IDE powered by CMake, featuring deep code analysis, inline compiler warnings, GDB/LLDB integration, and automated refactoring for native C/C++ projects.",
    specification: "JetBrains CLion IDE + MinGW Toolchain",
    primaryUse: "Native C/C++ Development, CMake Builds, Memory Inspection",
    relatedLectures: ["How to Install and Setup CLion for C/C++ Applications"]
  }
];
