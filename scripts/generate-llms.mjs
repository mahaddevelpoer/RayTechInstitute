import fs from 'node:fs/promises';
import {loadTypescript} from './load-typescript.mjs';
const {INITIAL_NOTES}=await loadTypescript('src/data/staticCatalog.ts');
const {LEARNING_TOPICS}=await loadTypescript('src/data/learningCatalog.ts');
const origin='https://raytechinstitute.com';
const link=(name,path)=>`- [${name.replace(/[\[\]\r\n]/g,' ')}](${origin}${path})`;
const noteLinks=classSlug=>INITIAL_NOTES.filter(n=>n.classSlug===classSlug).slice(0,3).map(n=>link(n.title,`/classes/${n.classSlug}/${n.subjectSlug}/notes/${n.id.toLowerCase().replace(/[^a-z0-9]+/g,'-')}/`));
const text=[ '# RayTech Institute', '', '> Class notes, chapter MCQs, past papers and programming lessons for students.', '',
 'This is a curated resource directory. Check each page for its class, syllabus, sources and update date. Class 11 Computer Science resources distinguish the Punjab ALP 2027 examination scope from legacy papers.', '',
 '## Class resources',link('Browse all classes','/classes/'),link('Class 11 Computer Science','/classes/11th-class/computer-science/'),link('Class 11 Computer Science notes','/classes/11th-class/computer-science/notes/'),...noteLinks('11th-class'),'',
 '## DIT',link('DIT subjects and study resources','/classes/dit-intermediate/'),...noteLinks('dit-intermediate'),'',
 '## Programming',link('Programming courses','/courses/'),link('Python lessons','/learn/python/'),...LEARNING_TOPICS.filter(t=>t.languageId==='python').map(t=>link(t.title,`/learn/python/${t.slug}/`)),'',
 '## Site information',link('About RayTech Institute','/about/'),link('Privacy policy','/privacy-policy/'),link('Sitemap','/sitemap.xml'),'' ].join('\n');
await fs.writeFile('public/llms.txt',text);console.log('[llms] Generated directory using published academic resources.');
