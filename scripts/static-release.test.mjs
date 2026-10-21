import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { verifyStaticRelease } from './verify-static-release.mjs';
const catalog = { LEARNING_LANGUAGES:[{id:'css',slug:'css'}],LEARNING_COURSES:[{slug:'web-development'}],LEARNING_TOPICS:[{languageId:'css',slug:'how-css-rules-work'}] };
test('release gate rejects old/partial exports and accepts matching HTML plus navigation payloads',async()=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'raytech-export-contract-'));
  try{
    const routes=['','classes','blogs','results-gazettes','courses','admin/login','admin/courses','admin/health','learn/css','courses/web-development','learn/css/how-css-rules-work','learn/css/how-css-rules-work/quiz','learn/css/how-css-rules-work/assignment'];
    for(const route of routes){await fs.mkdir(path.join(root,route),{recursive:true});await fs.writeFile(path.join(root,route,'index.html'),'<!DOCTYPE html><html><h1>Lesson</h1></html>');await fs.writeFile(path.join(root,route,'index.txt'),'1:"$Sreact.fragment"');}
    const manifest={revision:'expected',learning:{topics:1,languages:1,courses:1}};await fs.writeFile(path.join(root,'deployment.json'),JSON.stringify(manifest));
    assert.equal((await verifyStaticRelease(root,catalog,'expected')).routes,13);
    await fs.unlink(path.join(root,'admin/courses/index.html'));await assert.rejects(verifyStaticRelease(root,catalog,'expected'),/admin\/courses.*missing HTML/);
    await fs.writeFile(path.join(root,'admin/courses/index.html'),'<!DOCTYPE html><html><h1>Admin</h1></html>');
    await fs.unlink(path.join(root,'learn/css/how-css-rules-work/index.txt'));await assert.rejects(verifyStaticRelease(root,catalog,'expected'),/missing Next navigation payload/);
    await fs.writeFile(path.join(root,'learn/css/how-css-rules-work/index.txt'),'payload');await assert.rejects(verifyStaticRelease(root,catalog,'different'),/revision/);
  }finally{const target=await fs.realpath(root);if(!target.startsWith(await fs.realpath(os.tmpdir())+path.sep)||!path.basename(target).startsWith('raytech-export-contract-'))throw new Error('Unsafe temporary path');await fs.rm(target,{recursive:true,force:true});}
});
