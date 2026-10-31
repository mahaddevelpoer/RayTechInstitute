import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";

async function load(file) {
  const code = ts.transpileModule(await fs.readFile(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return import(
    `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
  );
}
const { documentLinks } = await load("src/utils/documents.ts");
const { buildSeoTitle, buildLessonDescription } = await load('src/utils/seo.ts');
const { articleSections, readingMinutes, needsSourceReview } = await load(
  "src/utils/editorial.ts",
);

test('learning metadata preserves complete normalized editorial text', () => {
  for (const summary of ['', 'A', 'Assign values.', 'programming '.repeat(100), 'X'.repeat(1000)]) {
    for (const context of ['', 'Variables (Python)', 'T'.repeat(200)]) {
      const result = buildLessonDescription(summary, context);
      assert.ok(result.length>0);assert.ok(!result.endsWith('…'));if(summary.trim())assert.ok(result.includes(summary.trim()));
      assert.equal(result, result.trim()); assert.ok(!/\s{2}/.test(result));
    }
  }
  const python = buildLessonDescription('Assign values.', 'Variables (Python)');
  assert.match(python, /^Variables \(Python\): Assign values\./);
  assert.notEqual(python, buildLessonDescription('Assign values.', 'Variables (JavaScript)'));
});

test('search titles preserve complete names with one brand suffix', () => {
  for (const primary of ['', '   ', 'A', 'C', 'PHP', 'Variables (Python)', 'x'.repeat(500)]) {
    const result = buildSeoTitle(primary);
    assert.ok(result.length>0);assert.ok(!result.includes('…'));if(primary.trim())assert.ok(result.startsWith(primary.trim()));
    assert.ok(result.endsWith(' | RayTech Institute'));
  }
});

test("a board homepage is not advertised as a PDF", () =>
  assert.equal(documentLinks("https://www.biselahore.com/").isPdf, false));
test("Drive share URL becomes a preview on the genuine Drive host only", () => {
  assert.equal(
    documentLinks("https://drive.google.com/file/d/abc_123/view").embed,
    "https://drive.google.com/file/d/abc_123/preview",
  );
  assert.equal(
    documentLinks("https://attacker.example/file/d/abc_123/view").embed,
    "",
  );
});
test("unsafe URLs and placeholder PDFs are never download links", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,bad",
    "https://example.com/paper.pdf",
    "https://user:pass@host.test/x.pdf",
  ])
    assert.equal(documentLinks(url).href, "");
});
test("PDF filename detection allows query strings", () =>
  assert.equal(
    documentLinks("https://board.test/gazette.pdf?year=2026").isPdf,
    true,
  ));
test("contents anchors are unique, Unicode aware, and ignore code fences", () => {
  const sections = articleSections(
    "## Revision\n## Revision\n```python\n# not a title\n```\n## نتیجہ",
  );
  assert.deepEqual(
    sections.map((s) => s.id),
    ["revision", "revision-2", "نتیجہ"],
  );
});
test("reading time reflects actual content", () =>
  assert.equal(readingMinutes("word ".repeat(441)), 3));
test("legacy impersonation is held for source review", () => {
  assert.equal(
    needsSourceReview("As the Examination Controller, I certify the result."),
    true,
  );
  assert.equal(needsSourceReview("Check your current board notice."), false);
});

const { staticExportParams } = await load("src/utils/staticExport.ts");
test("empty static routes get only a disposable notFound build placeholder", () => {
  assert.deepEqual(staticExportParams([], ["classSlug", "noteSlug"]), [
    { classSlug: "__empty_catalog__", noteSlug: "__empty_catalog__" },
  ]);
  const real = [{ noteSlug: "chapter-1" }];
  assert.equal(staticExportParams(real, ["noteSlug"]), real);
});
