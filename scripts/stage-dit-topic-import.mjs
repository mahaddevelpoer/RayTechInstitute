// Creates a reviewable transaction; deliberately never connects to a database.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export async function ditTopicImportSql() {
const bank=JSON.parse(await fs.readFile('content/imports/dit-computer-networks-chapter-1.json','utf8'));
const note=JSON.parse(await fs.readFile('content/imports/dit-computer-networks-chapter-1-note.json','utf8'));
assert.equal(bank.questions.length,80);assert.equal(new Set(bank.questions.map(q=>q.topic)).size,8);
assert.equal(note.classSlug,bank.classSlug);assert.equal(note.subjectSlug,bank.subjectSlug);assert.equal(note.chapterNumber,1);
assert.ok((await fs.stat('public/documents/dit/computer-networks-chapter-1-basic-terminologies.pdf')).size>1000);
const data=JSON.stringify(bank.questions.map(q=>({id:q.id,topic:q.topic,question:q.question,options:q.options,correct_index:q.correctIndex})));
const record={id:note.id,class_slug:note.classSlug,subject_slug:note.subjectSlug,chapter_number:1,chapter_title:note.chapterTitle,title:note.title,description:note.description,pdf_url:note.pdfUrl,file_size:note.fileSize,download_count:0,last_updated:note.lastUpdated,content:note.content};
const sql=`-- REVIEW ONLY. Not executed. Publish code/PDF and apply only after approval.
BEGIN;
ALTER TABLE public.mcqs ADD COLUMN IF NOT EXISTS topic TEXT;
CREATE TEMP TABLE dit_topic_source ON COMMIT DROP AS SELECT * FROM jsonb_to_recordset($ditbank$${data}$ditbank$::jsonb) AS x(id TEXT,topic TEXT,question TEXT,options JSONB,correct_index INT);
DO $guard$
BEGIN
 IF (SELECT count(*) FROM dit_topic_source s JOIN public.mcqs m ON m.id=s.id WHERE m.class_slug='dit-intermediate' AND m.subject_slug='dit-computer-science' AND m.chapter_number=1 AND m.question=s.question AND m.options=s.options AND m.correct_index=s.correct_index AND (m.topic IS NULL OR m.topic='' OR m.topic=s.topic))<>80 THEN RAISE EXCEPTION 'The source bank changed. No questions or notes were modified.'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.chapters WHERE class_slug='dit-intermediate' AND subject_slug='dit-computer-science' AND chapter_number=1 AND title='Basic Terminologies' AND is_active=true) THEN RAISE EXCEPTION 'Expected Chapter 1 is missing.'; END IF;
END $guard$;
UPDATE public.mcqs m SET topic=s.topic FROM dit_topic_source s WHERE m.id=s.id AND m.topic IS DISTINCT FROM s.topic;
INSERT INTO public.notes(id,class_slug,subject_slug,chapter_number,chapter_title,title,description,pdf_url,file_size,download_count,last_updated,content)
SELECT id,class_slug,subject_slug,chapter_number,chapter_title,title,description,pdf_url,file_size,download_count,last_updated,content FROM jsonb_populate_record(NULL::public.notes,$ditnote$${JSON.stringify(record)}$ditnote$::jsonb)
ON CONFLICT(id) DO NOTHING;
DO $verify$
BEGIN
 IF (SELECT count(*) FROM public.mcqs m JOIN dit_topic_source s ON s.id=m.id AND s.topic=m.topic)<>80 THEN RAISE EXCEPTION 'Topic verification failed.'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.notes WHERE id='${note.id}' AND class_slug='dit-intermediate' AND subject_slug='dit-computer-science' AND chapter_number=1 AND title='${note.title}' AND pdf_url='${note.pdfUrl}') THEN RAISE EXCEPTION 'Notes verification failed.'; END IF;
END $verify$;
NOTIFY pgrst, 'reload schema';
COMMIT;
SELECT topic,count(*) FROM public.mcqs WHERE id IN(SELECT id FROM jsonb_to_recordset($ditbank$${data}$ditbank$::jsonb) AS x(id TEXT)) GROUP BY topic ORDER BY topic;
`;
return sql;
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
const sql=await ditTopicImportSql();
await fs.mkdir('artifacts/dit-topic-review',{recursive:true});
await fs.writeFile('artifacts/dit-topic-review/publish-after-approval.sql',sql);
console.log('Staged 8 topics × 10 MCQs and the Chapter 1 PDF note. Database writes: 0. Deployments: 0.');
}
