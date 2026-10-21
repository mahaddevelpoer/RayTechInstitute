# Core-language curriculum

Scope confirmed on 20 October 2026: HTML, CSS, JavaScript, PHP and Python, exercises and final projects. Frameworks are excluded. Content lives in editable repository files, not a remote AI generation job. It must not be advertised as a completed course until the planned units and projects are authored and checked.

## Current delivered batch

Latest authoring checkpoint: Python now has 20 distinct authored core units, including the original foundation and 19 additional lessons through the revision-planner project. There are 24 authored units across five languages; the other four tracks still have only their foundation. Additional Python units have three worked examples each, four MCQs with three per attempt, an assignment and three-part guided checks. All 57 new worked programs passed exact-output checks in the real Python browser WASM adapter. These are concise core units, not 2,000-word chapters or proof of a finished five-language curriculum. See `CORE-ROADMAP.md` for the 76 unwritten units.

Understand activity follow-up: each of the five authored foundation units now includes an expandable Understand button with a Lucide information icon, three gated state-reconstruction parts, visual value cards, optional hints, retries, previous-part review and restart. All slots in a part must be correct before the next part opens. Motion respects reduced-motion preferences. These are transparent "AI suggested activity" additions requested by the owner, not formal test scores or claims of comprehensive mastery. No extra AI API calls or per-visitor lesson database requests are introduced. The 100-topic minimum and honest written/not-written status are tracked in `CORE-ROADMAP.md`.

Five original foundation lessons, one per language, with three worked examples each, expected results, practice, optional hints/solutions, eight explicit MCQs per lesson and an assignment with a 100-point rubric. These are foundation units, not five complete courses. The import script defaults to a validation-only dry run and never overwrites existing records. Publication is a separate reviewed action.

## Planned complete core syllabus

### Interactive foundation checkpoint, 20 October 2026

All five foundation units now have repository-reviewed `.mdx` versions with output prediction, an authored step-by-step trace and an explicit Open in Practice task. This is a restricted MDX subset: imports, expressions, arbitrary JSX and executable attributes are rejected. Build-time parsing produces data for reviewed React components; it never evaluates authored JavaScript. Only published database content matching the reviewed local source hash enters the interactive bundle. Existing Markdown remains supported.

The five exact, unchanged legacy foundation drafts were upgraded in the private database, with timestamp/state guards; none was published. Preview lessons are separate static snapshots. HTML prediction feedback, trace progression, practice loading and actual sandbox rendering were verified in the browser. These are still five foundation units, not complete courses. The remaining syllabus below remains release work.

- HTML: document structure; text semantics; links and paths; lists; images and alternatives; figures; tables; forms and labels; input validation; semantic landmarks; accessible navigation; media; responsive images; metadata; embedded content and security; final accessible multi-page study-site project.
- CSS: rule syntax; selectors; cascade and inheritance; specificity and layers; colours and backgrounds; units; typography; box model; sizing and overflow; display; positioning; flexbox; grid; responsive layouts; states and focus; transitions and reduced motion; custom properties and themes; final responsive study-dashboard project.
- JavaScript: values and output; types and conversion; bindings; expressions; comparisons; conditions; loops; functions; scope; arrays; objects; strings; destructuring; array methods; errors; modules; DOM selection; safe DOM updates; events; forms; promises; async/await; fetch with explicit practice-environment limits; final interactive revision-tool project.
- PHP: runtime and output; variables and types; strings; operators; conditions; loops; arrays; functions; scope; exceptions; dates; JSON; input validation; HTML escaping; request/response concepts; forms; sessions and authentication boundaries; PDO and parameterised SQL as server-required examples; password hashing; final server-oriented study-resource application project.
- Python: values and output; types and conversion; names and assignment; strings; operators; conditions; loops; lists; tuples; dictionaries; sets; functions; scope; comprehensions; exceptions; modules; standard-library essentials; text and JSON; files with explicit runtime limits; classes; testing; final command-line revision-planner project.

## Remaining release work

- Author and independently review every remaining lesson and assessment.
- Test exact runnable examples against the configured runtime; mark server-required PHP demonstrations honestly.
- Verify prerequisite progression, question diversity and project rubrics.
- Save reviewed content without overwriting user edits.
- Export static lesson, quiz, assignment and listing pages; audit links, canonicals and sitemap.
- Verify the resulting build before publishing to Firebase Hosting. Public lessons must read the build snapshot, not fetch the private authoring tables per visitor.
