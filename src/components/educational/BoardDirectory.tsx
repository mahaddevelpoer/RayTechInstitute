import { ExternalLink } from "lucide-react";
import { BOARDS } from "@/data/boards";

export function BoardDirectory() {
  return (
    <section
      aria-labelledby="board-directory-title"
      className="my-8 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:p-6"
    >
      <h2
        id="board-directory-title"
        className="text-xl font-bold text-navy-900"
      >
        Choose your examination board
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Open the board website for its current result notice. FBISE follows its
        own schedule.
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {BOARDS.map((board) => (
          <a
            key={board.name}
            href={board.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-navy-800 hover:border-navy-400"
          >
            <span>
              {board.name}
              <span className="block text-xs font-normal text-slate-500">
                {board.region} board website
              </span>
            </span>
            <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs leading-6 text-slate-600">
        RayTech is an independent study resource, not an examination board. We
        do not collect roll numbers or issue result cards.
      </p>
    </section>
  );
}
