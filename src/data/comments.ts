import { ClassroomComment } from '@/types';

// Structured pedagogical inquiries reflecting real classroom discussion topics
// around the channel's published lectures. Designed for easy ongoing synchronization
// with live YouTube community comments.
export const classroomCommentsData: ClassroomComment[] = [
  {
    id: "comment-01",
    commenter: "Classroom Inquiry #104",
    text: "In Python, why does indentation trigger an IndentationError instead of being ignored like whitespace in C++? Does this slow down script interpretation?",
    relatedLectureTitle: "Basic Python Syntax & Structure (Ch 2, Lec 1)",
    relatedCategory: "Python / Syntax",
    date: "Lecture Discussion",
    status: "Discussed in Lecture"
  },
  {
    id: "comment-02",
    commenter: "Classroom Inquiry #112",
    text: "Why is 'using namespace std;' considered problematic in larger production files even though it is standard practice in introductory C++ textbooks?",
    relatedLectureTitle: "Basic Structure of C++ Programs (Tutorial #1)",
    relatedCategory: "C++ / Architecture",
    date: "Lecture Discussion",
    status: "Discussed in Lecture"
  },
  {
    id: "comment-03",
    commenter: "Classroom Inquiry #089",
    text: "Can you clarify the practical distinction between verification and validation in SDLC testing phases for first-year board exam questions?",
    relatedLectureTitle: "SDLC Part 2 (Ch 1, 1st Year CS)",
    relatedCategory: "Computer Science / SDLC",
    date: "Lecture Discussion",
    status: "Discussed in Lecture"
  },
  {
    id: "comment-04",
    commenter: "Classroom Inquiry #131",
    text: "When setting up CLion on Windows, how does CMake locate the MinGW toolchain path if it wasn't added to global environment variables during install?",
    relatedLectureTitle: "How to Install and Setup CLion for C/C++",
    relatedCategory: "Development Tools / CLion",
    date: "Lecture Discussion",
    status: "Discussed in Lecture"
  },
  {
    id: "comment-05",
    commenter: "Classroom Inquiry #076",
    text: "Why are NAND and NOR called 'Universal Gates'? Can any Boolean logic circuit truly be constructed using only 2-input NAND gates?",
    relatedLectureTitle: "Logic Gates: Types of Logic Gates (Beginner's Guide)",
    relatedCategory: "Digital Logic / Hardware",
    date: "Lecture Discussion",
    status: "Discussed in Lecture"
  }
];
