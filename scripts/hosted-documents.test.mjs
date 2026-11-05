import test from 'node:test';import assert from 'node:assert/strict';import {canonicalHostedDocument} from './hosted-documents.mjs';
test('Owned PDFs copied into the export use the canonical domain without changing third-party providers',()=>{
 const source='https://raytechinstitute.web.app/documents/dit/notes.pdf?download=1#page=2';
 assert.equal(canonicalHostedDocument(source,'https://raytechinstitute.com',()=>true),'https://raytechinstitute.com/documents/dit/notes.pdf?download=1#page=2');
 assert.equal(canonicalHostedDocument('https://drive.google.com/file/d/abc/view','https://raytechinstitute.com',()=>true),'https://drive.google.com/file/d/abc/view');
 assert.equal(canonicalHostedDocument(source,'https://raytechinstitute.com',()=>false),source);
});
test('Document migration never rebases authentication endpoints or escaped paths',()=>{
 const auth='https://raytechinstitute.firebaseapp.com/__/auth/handler';assert.equal(canonicalHostedDocument(auth,'https://raytechinstitute.com',()=>true),auth);
 const escape='https://raytechinstitute.web.app/documents/a%2f..%2f..%2fprivate';assert.equal(canonicalHostedDocument(escape,'https://raytechinstitute.com',()=>true),escape);
 assert.throws(()=>canonicalHostedDocument('https://raytechinstitute.web.app/documents/a.pdf','http://raytechinstitute.com',()=>true));
});
