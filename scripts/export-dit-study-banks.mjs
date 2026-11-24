// Read local catalog only. No database or production mutation.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
const require=createRequire(import.meta.url);
const {outputFiles}=await build({stdin:{contents:`export * from './src/data/academicResourceSnapshot'; export * from './src/utils/dit-study';`,resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,platform:'node',format:'cjs',logLevel:'silent'});
const module={exports:{}};
vm.runInNewContext(outputFiles[0].text,{module,exports:module.exports,require,URL,console});
const c=module.exports;
const subjects=c.buildDitStudySubjects({chapters:c.INITIAL_CHAPTERS,notes:c.INITIAL_NOTES,mcqs:c.INITIAL_MCQS,papers:c.INITIAL_PAST_PAPERS});
const banks=subjects.filter(s=>s.mcqCount>0).map(s=>({id:s.id,title:s.title,modules:s.modules.filter(m=>m.mcqs.length).map(m=>({number:m.number,title:m.title,questions:m.mcqs}))}));
const file=path.resolve('artifacts/dit-study-20261124/bank-source.json');
await fs.mkdir(path.dirname(file),{recursive:true});
await fs.writeFile(file,JSON.stringify({banks},null,2));
console.log(JSON.stringify(banks.map(b=>({id:b.id,chapters:b.modules.length,questions:b.modules.reduce((n,m)=>n+m.questions.length,0)}))));
