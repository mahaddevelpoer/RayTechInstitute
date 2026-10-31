import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {loadTypescript} from './load-typescript.mjs';
const {validateArticleDraft}=await loadTypescript('supabase/functions/_shared/article-draft.ts');
test('article drafts preserve short and long content without word quotas',()=>{
 for(const content of ['A concise factual answer.','Detailed explanation. '.repeat(7000)])assert.equal(validateArticleDraft({title:'Topic',content}).content,content);
 for(const value of [null,[],{}, {title:'Topic',content:' '}])assert.throws(()=>validateArticleDraft(value));
});
test('blog generation omits an application output cap and forced word expansion',async()=>{
 const code=await fs.readFile('supabase/functions/secure-dispatch/index.ts','utf8');
 const action=code.slice(code.indexOf('if (action === "generate_blog")'),code.indexOf('// 2. ACTION:'));
 assert.doesNotMatch(action,/expandIfTooShort|validateLongFormContent|3,000|3000/);
 assert.match(action,/userPrompt, null, 0\.35/);
});
