import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {chapters} from '../content/class11-computer-2027/index.mjs';
import {modelPaper} from '../content/class11-computer-2027/model-paper.mjs';
const python=process.env.CLASS11_PYTHON||'python';
const programs=chapters.flatMap(c=>(c.programs||[]).map(p=>({...p,chapter:c.number})));
const modelCode=modelPaper.shortGroups[0].questions[6][2].match(/~~~python\n([\s\S]*?)\n~~~/)[1];
programs.push({id:'model-if-else',chapter:2,code:modelCode,stdout:'Positive\n'});
const results=[];
for(const p of programs)for(const [i,c] of (p.cases||[{stdin:'',stdout:p.stdout}]).entries()){
 const run=spawnSync(python,['-I','-c',p.code],{input:c.stdin||'',encoding:'utf8',timeout:10000});
 assert.equal(run.status,0,`${p.id}: ${run.stderr}`);assert.equal(run.stdout.replaceAll('\r\n','\n'),c.stdout,`${p.id} case ${i+1}`);
 results.push({id:p.id,chapter:p.chapter,case:i+1,codeSha256:createHash('sha256').update(p.code).digest('hex'),stdout:c.stdout,passed:true});
}
const report={programs:programs.length,executions:results.length,results};
await fs.writeFile('content/class11-computer-2027/program-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(`${programs.length} Python programs; ${results.length} executions passed.`);
