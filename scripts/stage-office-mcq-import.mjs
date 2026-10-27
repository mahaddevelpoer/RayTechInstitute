// Builds a reviewable, rerunnable transaction. Does not connect to production.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const sqlText = value => `'${value.replaceAll("'", "''")}'`;
export async function officeMcqImportSql() {
  const bank = JSON.parse(await fs.readFile('content/imports/dit-ms-office-chapter-1.json', 'utf8'));
  assert.equal(bank.questions.length, 60);
  assert.equal(new Set(bank.questions.map(question => question.id)).size, 60);
  assert.equal(bank.chapterNumber, 2);
  assert.equal(bank.chapterTitle, 'MS Office');
  assert.equal(new Set(bank.questions.map(question => question.topic)).size, 6);
  const rows = bank.questions.map(question => ({
    id: question.id, class_slug: bank.classSlug, subject_slug: bank.subjectSlug,
    chapter_number: bank.chapterNumber, topic: question.topic, question: question.question,
    options: question.options, correct_index: question.correctIndex, explanation: question.explanation,
  }));
  return `-- Staged only. Execute and publish only after approval.
BEGIN;
CREATE TEMP TABLE office_mcq_source ON COMMIT DROP AS
SELECT * FROM jsonb_to_recordset(${sqlText(JSON.stringify(rows))}::jsonb)
AS source(id TEXT,class_slug TEXT,subject_slug TEXT,chapter_number INT,topic TEXT,question TEXT,options JSONB,correct_index INT,explanation TEXT);
DO $guard$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.chapters WHERE class_slug='dit-intermediate' AND subject_slug='dit-computer-science' AND chapter_number=1 AND is_active=true) THEN
  RAISE EXCEPTION 'The existing D.I.T Computer Science Chapter 1 must be present. Nothing was changed.';
 END IF;
 IF EXISTS(SELECT 1 FROM public.chapters WHERE class_slug='dit-intermediate' AND subject_slug='dit-computer-science' AND chapter_number=2 AND id<>'chapter-dit-computer-science-ms-office')
  OR EXISTS(SELECT 1 FROM public.chapters WHERE id='chapter-dit-computer-science-ms-office' AND (class_slug IS DISTINCT FROM 'dit-intermediate' OR subject_slug IS DISTINCT FROM 'dit-computer-science' OR chapter_number IS DISTINCT FROM 2 OR title IS DISTINCT FROM 'MS Office' OR is_active IS NOT TRUE)) THEN
  RAISE EXCEPTION 'The MS Office chapter identity or number is already in use. Nothing was overwritten.';
 END IF;
 IF EXISTS(SELECT 1 FROM public.mcqs m JOIN office_mcq_source s ON s.id=m.id
  WHERE m.class_slug IS DISTINCT FROM s.class_slug OR m.subject_slug IS DISTINCT FROM s.subject_slug
   OR m.chapter_number IS DISTINCT FROM s.chapter_number OR m.topic IS DISTINCT FROM s.topic
   OR m.question IS DISTINCT FROM s.question OR m.options IS DISTINCT FROM s.options OR m.correct_index IS DISTINCT FROM s.correct_index) THEN
  RAISE EXCEPTION 'An existing Office question was changed. No content was overwritten.';
 END IF;
 IF EXISTS(SELECT 1 FROM public.mcqs m WHERE m.class_slug='dit-intermediate' AND m.subject_slug='dit-computer-science' AND m.chapter_number=2 AND NOT EXISTS(SELECT 1 FROM office_mcq_source s WHERE s.id=m.id)) THEN
  RAISE EXCEPTION 'This chapter already has other questions. Review it before importing.';
 END IF;
END $guard$;
INSERT INTO public.chapters(id,class_slug,subject_slug,chapter_number,title,description,is_active)
VALUES('chapter-dit-computer-science-ms-office','dit-intermediate','dit-computer-science',2,'MS Office','Office automation, open source and proprietary software, Microsoft Office 2016, and the Microsoft Word interface.',true)
ON CONFLICT(id) DO NOTHING;
INSERT INTO public.mcqs(id,class_slug,subject_slug,chapter_number,topic,question,options,correct_index,explanation,created_at)
SELECT id,class_slug,subject_slug,chapter_number,topic,question,options,correct_index,explanation,transaction_timestamp() FROM office_mcq_source
ON CONFLICT(id) DO NOTHING;
DO $verify$
BEGIN
 IF (SELECT count(*) FROM public.mcqs m JOIN office_mcq_source s ON s.id=m.id AND s.question=m.question AND s.options=m.options AND s.correct_index=m.correct_index AND s.topic=m.topic AND s.class_slug=m.class_slug AND s.subject_slug=m.subject_slug AND s.chapter_number=m.chapter_number)<>60 THEN
  RAISE EXCEPTION 'The complete Office question bank could not be confirmed. Import rolled back.';
 END IF;
END $verify$;
COMMIT;
`;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const sql = await officeMcqImportSql();
  await fs.mkdir('artifacts/office-mcq-review', { recursive: true });
  await fs.writeFile('artifacts/office-mcq-review/publish-after-approval.sql', sql);
  console.log('Staged new Chapter 2: MS Office, with six topics of ten bilingual MCQs. Existing Chapter 1 preserved. No database writes or deployments.');
}
