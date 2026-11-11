// Prepare PDF notes and an atomic, guarded SQL import. Does not connect to a database.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='content/imports/dit-nov11';const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));const review=read(root+'/REVIEW.json');const payload=read(root+'/payload.json');
payload.notes=[];review.pdfs=[];
for(const item of review.missing){
 const bank=read(root+'/'+item.key+'.json'),pdfPath='public/documents/dit/nov11/'+item.key+'.pdf',bytes=fs.readFileSync(pdfPath);assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
 const url='https://raytechinstitute.com/documents/dit/nov11/'+item.key+'.pdf';
 const topics=bank.sourceSections.map(t=>'- '+t).join('\n');
 payload.notes.push({id:'dit-nov11-'+item.key+'-mcq-notes',class_slug:bank.classSlug,subject_slug:bank.subjectSlug,chapter_number:item.storageChapter,chapter_title:item.title,title:item.title+': MCQ Revision Notes',description:`${item.questions} supplied English and Urdu questions across ${item.topics} topics, with highlighted answers and a complete answer key.`,pdf_url:url,preview_pdf_url:url,file_size:Math.ceil(bytes.length/1024)+' KB',download_count:0,last_updated:'2026-11-11',action_button_text:null,action_button_url:null,content:`## About these revision notes\n\nThis document contains the supplied ${item.title} practice question bank for D.I.T Semester 1 Computer Science, in the ${item.book} book. It preserves ${item.questions} questions, their source option order, the English and Urdu wording supplied in the document, and the verified correct answers. Technical literals such as addresses, formulas and acronyms are retained exactly where the source uses them. This is revision material, not an official examination paper or a complete theory textbook.\n\n## Topics\n\n${topics}\n\n## Study one topic at a time\n\nFirst attempt each question without looking at its highlighted answer. Compare the English and Urdu wording where both are provided. Explain why the other options do not fit, and keep a short list of concepts to revisit. The PDF deliberately includes highlighted correct options and an answer key for revision. Online tests keep their existing answer and result behaviour.\n\n## Preview and download\n\nUse the PDF viewer on this page or download the same document for offline study. The PDF embeds its Urdu font and retains all questions from the supplied bank.\n\n## Continue practising\n\nOpen [Computer Science MCQs](/classes/dit-intermediate/dit-computer-science/mcqs/) and select the matching book, chapter and topic. Find the other chapters under [Computer Science notes](/classes/dit-intermediate/dit-computer-science/notes/).`});
 review.pdfs.push({key:item.key,path:pdfPath,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const quote=s=>"'"+s.replaceAll("'","''")+"'";
assert.equal(review.officeOrderConfirmed,true);
let sql='-- Local review only. MS Office order confirmed by user; obtain publication approval before execution.\nBEGIN;\nLOCK TABLE public.chapters, public.mcqs, public.notes IN SHARE ROW EXCLUSIVE MODE;\n';
for(const change of payload.updates){
 assert.ok(['chapters','notes'].includes(change.table));
 const id=quote(change.id),before=quote(JSON.stringify(change.before)),after=quote(JSON.stringify(change.after));
 sql+=`DO $update$ BEGIN IF NOT EXISTS(SELECT 1 FROM public.${change.table} t WHERE id=${id} AND (to_jsonb(t) @> ${before}::jsonb OR to_jsonb(t) @> ${after}::jsonb)) THEN RAISE EXCEPTION 'Approved PowerPoint metadata changed; refusing update'; END IF; END $update$;\n`;
 sql+=`UPDATE public.${change.table} SET ${Object.entries(change.after).map(([k,v])=>'"'+k+'"='+ (typeof v==='number'?v:quote(v))).join(',')} WHERE id=${id};\n`;
}
sql+=`DO $guard$ BEGIN\n IF EXISTS (SELECT 1 FROM public.chapters WHERE class_slug='dit-intermediate' AND subject_slug='dit-computer-science' AND book_title='MS Office' AND display_chapter_number=3 AND id<>'chapter-dit-computer-science-excel') THEN RAISE EXCEPTION 'MS Office Chapter 3 is occupied. Confirm Excel/PowerPoint order before publishing.'; END IF;\n END $guard$;\n`;
for(const table of ['chapters','mcqs','notes']){
 const rows=payload[table],json=quote(JSON.stringify(rows));const cols=Object.keys(rows[0]).map(k=>'"'+k+'"').join(',');
 sql+=`DO $guard$ DECLARE src JSONB; BEGIN FOR src IN SELECT value FROM jsonb_array_elements(${json}::jsonb) LOOP IF EXISTS(SELECT 1 FROM public.${table} t WHERE t.id=src->>'id' AND NOT to_jsonb(t) @> src) THEN RAISE EXCEPTION 'Existing ${table} differs; refusing overwrite'; END IF; END LOOP; END $guard$;\n`;
 if(table==='chapters')sql+=`DO $guard$ DECLARE src JSONB; BEGIN FOR src IN SELECT value FROM jsonb_array_elements(${json}::jsonb) LOOP IF EXISTS(SELECT 1 FROM public.chapters c WHERE c.class_slug=src->>'class_slug' AND c.subject_slug=src->>'subject_slug' AND c.chapter_number=(src->>'chapter_number')::INT AND c.id<>src->>'id') THEN RAISE EXCEPTION 'Chapter storage collision'; END IF; END LOOP; END $guard$;\n`;
 sql+=`INSERT INTO public.${table}(${cols}) SELECT ${cols} FROM jsonb_populate_recordset(NULL::public.${table},${json}::jsonb) ON CONFLICT(id) DO NOTHING;\n`;
 sql+=`DO $verify$ BEGIN IF (SELECT count(*) FROM jsonb_array_elements(${json}::jsonb) src WHERE EXISTS(SELECT 1 FROM public.${table} t WHERE t.id=src->>'id' AND to_jsonb(t) @> src))<>${rows.length} THEN RAISE EXCEPTION '${table} read-back mismatch'; END IF; END $verify$;\n`;
}
sql+='COMMIT;\n';
review.payloadSha256=createHash('sha256').update(JSON.stringify(payload)).digest('hex');review.approvedMetadataUpdates=payload.updates.length;
review.existing.find(r=>r.key==='powerpoint').action='Preserve all questions and URLs; update the approved chapter label from 3 to 4.';
fs.writeFileSync(root+'/payload.json',JSON.stringify(payload,null,2)+'\n');fs.writeFileSync(root+'/REVIEW.json',JSON.stringify(review,null,2)+'\n');fs.writeFileSync(root+'/import.sql',sql);fs.writeFileSync('artifacts/dit-nov11/publish-after-approval.sql',sql);console.log(JSON.stringify({chapters:payload.chapters.length,mcqs:payload.mcqs.length,notes:payload.notes.length,productionWrites:0}));
