import Link from "next/link";

const questions = [
  {
    question: "How should I use notes, MCQs and past papers together?",
    answer:
      "Read one chapter and make a short summary. Attempt its MCQs without looking at the answers, review mistakes, then practise related past-paper questions with your textbook.",
  },
  {
    question: "Can I change an answer before submitting the quiz?",
    answer:
      "Yes. Use Previous to return to a question and select a different answer. Correct answers and explanations are shown after you finish the attempt.",
  },
  {
    question: "Which syllabus should I follow?",
    answer:
      "Use the textbook and examination syllabus assigned by your college and board for your current session. Check the class, chapter and year before using an older resource.",
  },
  {
    question: "Where can I check my 1st-year result?",
    answer:
      "Use the board name on your roll-number slip to find its official website in our result guide. RayTech does not issue marks or ask you to submit a roll number.",
  },
];
export function Classroom() {
  return (
    <section
      id="classroom"
      className="border-b border-slate-200 bg-slate-50 py-10"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="section-title">Help with studying and results</h2>
        <div className="mt-5 space-y-3">
          {questions.map((item) => (
            <details
              key={item.question}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <summary className="min-h-12 cursor-pointer text-base font-semibold text-navy-900">
                {item.question}
              </summary>
              <p className="mt-3 text-base leading-7 text-slate-700">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
        <Link
          href="/results-gazettes/first-year-result/"
          className="mt-5 inline-flex min-h-12 items-center text-sm font-semibold text-navy-700 underline"
        >
          Open the 1st-year result guide
        </Link>
      </div>
    </section>
  );
}
