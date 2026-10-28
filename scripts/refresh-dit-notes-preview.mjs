// Read-only refresh of public study content for the local preview, never a production import.
import fs from 'node:fs/promises';
import {readLearningServiceKey,learningProject} from './learning-cli-access.mjs';
const key=readLearningServiceKey();
const tables={};
for(const table of ['notes','chapters']){
 const rows=[];
 for(let offset=0;;offset+=500){
  const response=await fetch(`https://${learningProject}.supabase.co/rest/v1/${table}?class_slug=eq.dit-intermediate&subject_slug=eq.dit-computer-science&order=id&limit=500&offset=${offset}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
  if(!response.ok)throw new Error(`Public ${table} preview refresh failed (${response.status}). Existing snapshot was kept.`);
  const page=await response.json();if(!Array.isArray(page))throw new Error('Invalid preview snapshot response.');rows.push(...page);if(page.length<500)break;
 }
 tables[table]=rows;
}
const snapshot={
 source:'Read-only snapshot of published D.I.T notes; used only by local preview, never as production fallback.',
 notes:tables.notes.map(n=>({id:n.id,classSlug:n.class_slug,subjectSlug:n.subject_slug,chapterNumber:n.chapter_number,chapterTitle:n.chapter_title,title:n.title,description:n.description,pdfUrl:n.pdf_url,fileSize:n.file_size,downloadCount:n.download_count||0,lastUpdated:n.last_updated,content:n.content||undefined,previewPdfUrl:n.preview_pdf_url||undefined,actionButtonText:n.action_button_text||undefined,actionButtonUrl:n.action_button_url||undefined})),
 chapters:tables.chapters.map(c=>({id:c.id,classSlug:c.class_slug,subjectSlug:c.subject_slug,chapterNumber:c.chapter_number,title:c.title,description:c.description,isActive:c.is_active})),
};
await fs.writeFile('content/imports/dit-notes-preview.json',JSON.stringify(snapshot,null,2)+'\n');
console.log(`Refreshed local preview: ${snapshot.notes.length} published notes, ${snapshot.chapters.length} chapters. No production writes.`);
