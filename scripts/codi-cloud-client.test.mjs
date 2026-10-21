import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { webcrypto } from 'node:crypto';
import { loadTypescript } from './load-typescript.mjs';
const line = await loadTypescript('src/lib/learning/codi-line.ts');
const source = ts.transpileModule(await fs.readFile('src/lib/learning/codi-cloud.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function fixture() {
  const store = new Map(), calls = [], sockets = [], nodes = [];
  const auth = { authStateReady: async()=>{}, currentUser: { isAnonymous:false, getIdToken: async()=> 'firebase-fixture-token' } };
  class Socket {
    constructor(url) { this.url=url;this.sent=[];sockets.push(this); }
    send(raw) { this.sent.push(JSON.parse(raw)); }
    close() { this.closed=true; }
    receive(body) { this.onmessage?.({data:JSON.stringify(body)}); }
  }
  const context = { currentTime:0,destination:{}, createBuffer(_channels,length,rate) { return {duration:length/rate,getChannelData:()=>new Float32Array(length)}; }, createBufferSource() { const n={connect(){},disconnect(){this.disconnected=true;},start(){this.started=true;},stop(){this.stopped=true;}};nodes.push(n);return n;} };
  let resolveFetch;
  const fetcher=async(url,init)=>{calls.push({url,init}); if(resolveFetch)return resolveFetch(url,init);const action=JSON.parse(init.body).action; return Response.json(action==='live'?{endpoint:'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained',model:'gemini-2.5-flash-native-audio-preview-12-2025',token:'auth_tokens/fixture'}:{audio:Buffer.from([0,0,1,0]).toString('base64'),rate:24000,model:'gemini-2.5-flash-preview-tts'});};
  const cache={match:async k=>store.get(k)?.clone(),put:async(k,v)=>store.set(k,v),keys:async()=>[...store.keys()],delete:async k=>store.delete(k)};
  const module={exports:{}};
  vm.runInNewContext(source,{module,exports:module.exports,require:id=>id==='@/lib/firebase'?{auth}:id==='@/lib/supabase'?{supabaseUrl:'https://project.supabase.co'}:id==='./codi-line'?line:null,crypto:webcrypto,TextEncoder,Uint8Array,Float32Array,Blob,DOMException,Response,location:{origin:'https://site.test'},caches:{open:async()=>cache},fetch:fetcher,atob:s=>Buffer.from(s,'base64').toString('binary'),WebSocket:Socket,setTimeout,clearTimeout});
  return {...module.exports,store,calls,sockets,nodes,context,auth,setFetch:f=>{resolveFetch=f;}};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('reading caches bounded WAV audio, never tokens, and separates languages',async()=>{
  const f=fixture(),signal=new AbortController().signal;
  assert.equal((await f.codiCloudReading('A variable names a value.','en',signal)).type,'audio/wav');
  await f.codiCloudReading('A variable names a value.','en',signal);assert.equal(f.calls.length,1);
  await f.codiCloudReading('A variable names a value.','hi',signal);assert.equal(f.calls.length,2);
  assert.doesNotMatch([...f.store.keys()].join(' '),/firebase|variable|auth_tokens/);
  for(let i=0;i<30;i++) await f.codiCloudReading('Line '+i,'en',signal);
  assert.equal(f.store.size,24);
});
test('guests and cancelled requests cannot request cloud credentials',async()=>{
  const f=fixture();f.auth.currentUser=null;
  await assert.rejects(f.codiCloudRequest({action:'read'},new AbortController().signal),/Sign in/);assert.equal(f.calls.length,0);
  const a=new AbortController();a.abort();await assert.rejects(f.codiCloudRequest({},a.signal),/Stopped/);
});
test('Live streams audio and transcript, waits for playback and closes credentials',async()=>{
  const f=fixture(),a=new AbortController();let speaking=0,transcript='';
  const result=f.codiCloudExplain('variable','Published source','en',f.context,a.signal,()=>speaking++,v=>{transcript=v;});await tick();
  const socket=f.sockets[0];socket.onopen();socket.receive({setupComplete:{}});await tick();
  assert.equal(socket.sent[0].setup.model,'models/gemini-2.5-flash-native-audio-preview-12-2025');assert.match(socket.sent[1].clientContent.turns[0].parts[0].text,/variable/);
  socket.receive({serverContent:{modelTurn:{parts:[{inlineData:{mimeType:'audio/pcm;rate=24000',data:Buffer.from([0,0,1,0]).toString('base64')}}]},outputTranscription:{text:'A variable names a value.'}}});await tick();
  assert.equal(speaking,1);assert.equal(transcript,'A variable names a value.');assert.ok(f.nodes[0].started);
  socket.receive({serverContent:{turnComplete:true}});await tick();assert.ok(socket.closed);f.nodes[0].onended();await result;
  assert.ok(f.nodes[0].disconnected);
});
test('Stop aborts Live, stops scheduled audio and rejects malformed audio safely',async()=>{
  const f=fixture(),a=new AbortController();
  const result=f.codiCloudExplain('variable','Published source','en',f.context,a.signal,()=>{},()=>{});const rejected=assert.rejects(result,/Stopped/);await tick();
  f.sockets[0].receive({serverContent:{modelTurn:{parts:[{inlineData:{mimeType:'audio/pcm;rate=24000',data:'AAABAA=='}}]}}});await tick();a.abort();await rejected;
  assert.ok(f.nodes[0].stopped);assert.ok(f.sockets[0].closed);
  const g=fixture();g.setFetch(async()=>Response.json({audio:'corrupt!',rate:24000,model:'gemini-2.5-flash-preview-tts'}));
  await assert.rejects(g.codiCloudReading('Read this','en',new AbortController().signal),/Invalid voice/);
});
