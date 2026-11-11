import fs from 'node:fs/promises';
import path from 'node:path';
const root='content/smart-syllabus-2027';
const docs=JSON.parse(await fs.readFile('src/data/smart-syllabus.json','utf8'));
const guides=JSON.parse(await fs.readFile(`${root}/study-guides.json`,'utf8'));
const names={'computer-science':'Computer Science and Entrepreneurship',mathematics:'Mathematics',physics:'Physics',chemistry:'Chemistry',biology:'Biology',urdu:'Urdu',english:'English',islamiat:'Islamiat'};
const records=[];
for(const d of docs){
 const name=names[d.subject];const short=d.subject==='computer-science'?'Computer Science':name;
 const key=`${d.grade}-${d.subject}`;const route=`/smart-syllabus/grade-${d.grade}/${d.subject}/`;
 const facts=(await fs.readFile(`${root}/${key}-facts.md`,'utf8')).trim();
 const title=`Grade ${d.grade} ${short} Smart Syllabus 2027: PDF and Guide`;
 const slug=`punjab-grade-${d.grade}-${d.subject}-smart-syllabus-2027`;
 const excerpt=`Read the Punjab Grade ${d.grade} ${short} smart syllabus for annual exams 2027. Preview the subject PDF, check exclusions and plan your revision.`;
 let content=`The Punjab Grade ${d.grade} ${name} smart syllabus is included in the 6 November 2026 PECTAA notification for academic session 2026-27 and the annual examination 2027. This guide explains how to use the subject section, with a subject-only PDF rather than an unrelated multi-subject download. ${key==='11-islamiat'?'The Islamiat page contains a conflicting year note, explained below.':''}

[Open the ${name} PDF resource, preview and download](${route}). The attachment on this article also opens the same subject document.

## What does this subject's ALP change?

${facts}

The details above highlight identifiable entries and preparation instructions. They are not presented as a replacement for every row of the original document. Where a table continues across pages, read the continuation before deciding whether a topic or question remains in scope.

## Document details at a glance

| Detail | Verified document information |
| --- | --- |
| Grade | ${d.grade} |
| Subject | ${name} |
| Academic session | 2026-27 |
| Annual examination | 2027 |
| Notification date | 6 November 2026 |
| Notification reference | ${d.notification} |
| Subject PDF length | ${d.pages} pages |
| Original booklet pages | ${d.sourcePages[0]}-${d.sourcePages[1]} |

![Official Grade ${d.grade} notification dated 6 November 2026](${d.notificationImage})

The image preserves the covering notification. The downloadable file is an extract of the subject pages; the complete official booklet remains linked under Sources. The extracted PDF does not include unrelated subjects and has not been rewritten as a substitute notification.

## How should you mark your textbook?

Work with the approved textbook edition for this session. First locate the chapter or unit name, then the subsection, page number and exercise reference. Keep separate marks for excluded topics and excluded questions. A row that removes a particular example is narrower than a row that removes an entire exercise; neither should be expanded without evidence.

Make a retained-work checklist after completing the exclusions. This is more useful for daily revision than a list of crossed-out pages alone. If your edition has different pagination, match the wording and ask your teacher to reconcile the difference. Do not silently transfer a page range from another grade or academic year.

${guides[d.subject]}

## What does the assessment material help you practise?

The subject section includes the instructions and assessment material that follow its syllabus notice. Read the objective and subjective instructions separately. Check the number of questions offered, the number required, the marks for each part and the available time. Copy these into a practice plan before starting a timed attempt.

Use the model paper to learn the format and expected level of response. It is not a leak, a guess paper or a guarantee that those same questions will appear. Retained material remains important even if a particular example does not appear in the model. Where a teacher provides an additional practice paper, compare its scope with this current document first.

![Assessment or continuation page from the Grade ${d.grade} ${name} subject section](/images/smart-syllabus/2027/grade-${d.grade}-${d.subject}-paper.webp)

This second image comes from within this subject section. Open the PDF for the surrounding pages and full-size text; an image viewed on a small phone is not a practical replacement for the downloadable document.

## A practical revision cycle for this subject

Begin with one retained unit or manageable group of questions. Read it, close the book and attempt a short recall task. Review the difference between your answer and the required explanation or method. Record the specific weakness, then return to it after a gap. This makes revision measurable without pretending that simply rereading a chapter proves understanding.

Before a timed paper, check your retained-work list for gaps. During the attempt, follow the stated choices and number each answer clearly. Afterwards, separate knowledge errors from presentation or timing errors. Plan the next study block around the weakest category rather than repeating only the questions you already answer comfortably.

Keep notes and past papers useful but subordinate to the current syllabus. An older paper may contain content that is now excluded. Filter such practice deliberately; do not assume an old question is in scope just because it appeared in a board examination before.

## Common questions

### Is this the full textbook or only the subject syllabus?

It is the ${d.pages}-page ${name} subject section extracted from the Grade ${d.grade} notification booklet. It contains the syllabus notice and accompanying assessment material, not the full textbook. The official multi-subject booklet is available through the source link below.

### Does smart syllabus mean I can skip every chapter mentioned?

No. Read the level of the exclusion: a topic, example, exercise, question or subpart. A chapter can contain both retained and excluded material. The exact table wording matters more than a shortened list shared without its page and exercise references.

### Can I preview the PDF on my phone?

Use Preview document in the attached-document block. If your browser does not display an embedded PDF comfortably, use Open document or Download PDF. Keep the saved copy available for revision, and zoom the original pages when checking small references or Urdu text.

### Does this notice announce my examination date?

A syllabus notification and an examination date sheet are different documents. This booklet concerns scope and assessment guidance for the stated session and annual examination. Check your board's separate date sheet and any later amendments for the examination schedule.

### What if a later notice changes this document?

A later applicable official amendment may change the preparation instructions. Check the issuing authority and your board before the examination, and compare notification dates and reference numbers. ${key==='11-islamiat'?'For this Islamiat section, seek clarification of the conflicting footer year before treating the scope as final.':'If a circulating image differs from the original booklet, use the complete official notice to investigate the difference.'}

## Related study resources

Use the [smart syllabus directory](/smart-syllabus/) to choose another verified subject. Visit [academic programmes and classes](/classes/) for subject notes, chapter tests and past papers. The [${name} resource page](${route}) keeps this PDF and its source together for quick access.

## Sources

- [Official Grade ${d.grade} notification and complete booklet](${d.source})
- [PECTAA official downloads](https://pectaa.edu.pk/downloads-2-2/)

Source checked on 11 November 2026. Revision advice in this article is editorial guidance; the attached official document controls the syllabus wording.
`;
 content=content.replace(/[ \t]+$/gm,'');
 await fs.writeFile(`${root}/${key}.md`,content);
 const seoTitle=d.subject==='computer-science'?`Grade ${d.grade} Computer Science ALP 2027 Guide`:`Grade ${d.grade} ${short} ALP 2027 PDF Guide`;
 const tags=['smart-syllabus',`syllabus-grade-${d.grade}`,`syllabus-subject-${d.subject}`,'syllabus-exam-2027','Punjab smart syllabus',`Grade ${d.grade} ${short}`,`${short} ALP 2027`,'PECTAA','Annual examination 2027','Academic session 2026-27','Subject PDF','Model paper','Syllabus exclusions','Punjab board preparation'];
 records.push({id:`alp-2027-${key}`,title,slug,category:'education',excerpt,content,featured_image:`https://raytechinstitute.com${d.image}`,author:'RayTech Institute',date_published:'2026-11-11T12:00:00+05:00',read_time:`${Math.ceil(content.split(/\s+/).length/200)} min read`,tags,seo:{enabled:['title','description','imageAlt','socialTitle','socialDescription','sources','internalLinks'],title:seoTitle,description:excerpt,imageAlt:`Official Grade ${d.grade} ${name} smart syllabus section`,socialTitle:seoTitle,socialDescription:excerpt,sources:`${d.source}\nhttps://pectaa.edu.pk/downloads-2-2/`,internalLinks:`${route}\n/smart-syllabus/\n/classes/`},action_button_text:`Download Grade ${d.grade} ${short} smart syllabus PDF`,action_button_url:`https://raytechinstitute.com${d.pdf}`});
}
await fs.writeFile(`${root}/articles.json`,JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify({articles:records.length,words:records.map(p=>({slug:p.slug,words:p.content.split(/\s+/).length}))}));
