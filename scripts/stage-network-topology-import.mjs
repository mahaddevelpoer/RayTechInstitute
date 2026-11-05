// Produces a guarded, reviewable transaction. Never connects to production.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const quote = value => `'${value.replaceAll("'", "''")}'`;
export async function networkTopologyImportSql() {
 const bank=JSON.parse(await fs.readFile('content/imports/dit-network-topology-chapter-2.json','utf8'));
 assert.equal(bank.questions.length,100);assert.equal(new Set(bank.questions.map(q=>q.id)).size,100);
 assert.equal(bank.chapterNumber,4);assert.equal(bank.displayChapterNumber,2);assert.equal(bank.bookTitle,'Computer Networking');
 const counts=new Map();for(const q of bank.questions){counts.set(q.topic,(counts.get(q.topic)||0)+1);assert.equal(q.options.length,4);assert.ok(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4);}
 assert.equal(counts.size,10);assert.ok([...counts.values()].every(n=>n===10));
 const rows=bank.questions.map(q=>({id:q.id,class_slug:bank.classSlug,subject_slug:bank.subjectSlug,chapter_number:bank.chapterNumber,topic:q.topic,question:q.question,options:q.options,correct_index:q.correctIndex,explanation:q.explanation}));
 return `-- Local review only. Publishing requires approval of this academic import.
BEGIN;
LOCK TABLE public.chapters,public.mcqs IN SHARE ROW EXCLUSIVE MODE;
CREATE TEMP TABLE topology_source ON COMMIT DROP AS SELECT * FROM jsonb_to_recordset(${quote(JSON.stringify(rows))}::jsonb)
AS source(id TEXT,class_slug TEXT,subject_slug TEXT,chapter_number INT,topic TEXT,question TEXT,options JSONB,correct_index INT,explanation TEXT);
DO $guard$ BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.chapters WHERE class_slug='dit-intermediate' AND subject_slug='dit-computer-science' AND chapter_number=1 AND title='Basic Terminologies' AND is_active=true) THEN
  RAISE EXCEPTION 'Existing Computer Networking Chapter 1 must be present.';
 END IF;
 IF EXISTS(SELECT 1 FROM public.chapters WHERE class_slug='dit-intermediate' AND subject_slug='dit-computer-science' AND chapter_number=4 AND id<>'chapter-dit-computer-science-network-topology')
 OR EXISTS(SELECT 1 FROM public.chapters WHERE id='chapter-dit-computer-science-network-topology' AND (class_slug IS DISTINCT FROM 'dit-intermediate' OR subject_slug IS DISTINCT FROM 'dit-computer-science' OR chapter_number IS DISTINCT FROM 4 OR title IS DISTINCT FROM 'Network Topology' OR book_title IS DISTINCT FROM 'Computer Networking' OR display_chapter_number IS DISTINCT FROM 2 OR is_active IS NOT TRUE)) THEN
  RAISE EXCEPTION 'Chapter identity or storage position is already in use. Nothing overwritten.';
 END IF;
 IF EXISTS(SELECT 1 FROM public.mcqs m JOIN topology_source s USING(id) WHERE m.class_slug IS DISTINCT FROM s.class_slug OR m.subject_slug IS DISTINCT FROM s.subject_slug OR m.chapter_number IS DISTINCT FROM s.chapter_number OR m.topic IS DISTINCT FROM s.topic OR m.question IS DISTINCT FROM s.question OR m.options IS DISTINCT FROM s.options OR m.correct_index IS DISTINCT FROM s.correct_index OR m.explanation IS DISTINCT FROM s.explanation)
 OR EXISTS(SELECT 1 FROM public.mcqs m WHERE m.class_slug='dit-intermediate' AND m.subject_slug='dit-computer-science' AND m.chapter_number=4 AND NOT EXISTS(SELECT 1 FROM topology_source s WHERE s.id=m.id)) THEN
  RAISE EXCEPTION 'Existing question content differs. Nothing overwritten.';
 END IF;
END $guard$;
INSERT INTO public.chapters(id,class_slug,subject_slug,chapter_number,title,description,is_active,book_title,display_chapter_number)
VALUES('chapter-dit-computer-science-network-topology','dit-intermediate','dit-computer-science',4,'Network Topology','100 English and Urdu MCQs across ten topics, including wired and wireless topologies.',true,'Computer Networking',2)
ON CONFLICT(id) DO NOTHING;
INSERT INTO public.mcqs(id,class_slug,subject_slug,chapter_number,topic,question,options,correct_index,explanation,created_at)
SELECT id,class_slug,subject_slug,chapter_number,topic,question,options,correct_index,explanation,transaction_timestamp() FROM topology_source ON CONFLICT(id) DO NOTHING;
DO $verify$ BEGIN
 IF (SELECT count(*) FROM public.mcqs m JOIN topology_source s USING(id) WHERE m.question=s.question AND m.options=s.options AND m.correct_index=s.correct_index AND m.topic=s.topic AND m.explanation=s.explanation AND m.class_slug=s.class_slug AND m.subject_slug=s.subject_slug AND m.chapter_number=s.chapter_number)<>100 THEN
  RAISE EXCEPTION 'Complete topology import could not be verified. Rolling back.';
 END IF;
END $verify$;
COMMIT;
`;
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
 await fs.mkdir('artifacts/network-topology-review',{recursive:true});
 await fs.writeFile('artifacts/network-topology-review/publish-after-approval.sql',await networkTopologyImportSql());
 console.log('Staged 100 MCQs in ten topics. Computer Networking Chapter 2 uses storage position 4; existing chapters preserved. No live writes.');
}
