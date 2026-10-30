import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';import {loadTypescript} from './load-typescript.mjs';import {localPrivateQuestions} from './competition-local-fixtures.mjs';
const domain=await loadTypescript('supabase/functions/_shared/competition-service.ts');
const {createCompetitionHandler,competitionIpHash}=await loadTypescript('supabase/functions/_shared/competition-handler.ts');
const {createCompetitionTokenVerifier}=await loadTypescript('supabase/functions/_shared/competition-auth.ts');
const sql=await fs.readFile('supabase/migrations/20261028020000_private_competition.sql','utf8');
const db=new PGlite();await db.exec('CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role;');await db.exec(sql);
const repo={async call(action,uid,payload={}){return(await db.query('SELECT public.competition_gateway($1,$2,$3::jsonb) AS data',[action,uid,JSON.stringify(payload)])).rows[0].data;}};
let now=Date.now();const service=domain.createCompetitionService(repo,{now:()=>now});const week=domain.pakistanWeek(now);
const config={id:'qa-weekly-round',title:'QA knowledge round',subject:'Reviewed computing examples',...week,times:{easy:15,medium:30,hard:60}};
await service.saveRound({config,bank:localPrivateQuestions(),enabled:true});
const start=uid=>service.start(uid,{roundId:config.id,displayName:'Student '+uid,photoUrl:null});
const row=uid=>repo.call('attempt',uid);
test.after(async()=>db.close());

test('private schema and RPC deny both anonymous and ordinary authenticated database roles',async()=>{
 for(const role of ['anon','authenticated']){await db.exec(`SET ROLE ${role}`);try{await assert.rejects(db.query('SELECT * FROM competition_private.rounds'),/permission denied/);await assert.rejects(repo.call('round',null,{roundId:config.id}),/permission denied/);}finally{await db.exec('RESET ROLE');}}
 await db.exec('SET ROLE service_role');try{assert.equal((await repo.call('catalog',null)).length,1);}finally{await db.exec('RESET ROLE');}
});

test('concurrent starts create one weekly attempt and freeze the private bank/option permutations',async()=>{
 const attempts=await Promise.all(Array.from({length:5},()=>start('concurrent')));assert.equal(new Set(attempts.map(a=>a.id)).size,1);
 const stored=(await row('concurrent')).body;assert.equal(stored.paper.length,20);assert.deepEqual(['easy','medium','hard'].map(kind=>stored.paper.filter(q=>q.difficulty===kind).length),[6,10,4]);
 const payload=JSON.stringify(attempts);assert.doesNotMatch(payload,/correctIndex|roundRevision|"paper"|"uid"|ipHash/);assert.equal(attempts[0].question.options.length,4);
 const deadline=stored.deadline;assert.equal((await service.state('concurrent')).deadline,deadline);
 const other=await start('coverage');const otherPaper=(await row('coverage')).body.paper;const coverage=paper=>paper.reduce((map,q)=>({...map,[q.difficulty+':'+q.topic]:(map[q.difficulty+':'+q.topic]||0)+1}),{});assert.deepEqual(coverage(otherPaper),coverage(stored.paper));assert.notEqual(other.id,stored.id);
 await assert.rejects(service.saveRound({config,bank:localPrivateQuestions(),enabled:true}),/ROUND_LOCKED/);
});

test('double answer submission awards points once and stale or foreign questions cannot advance an attempt',async()=>{
 const view=await start('answer-replay');const state=(await row('answer-replay')).body;const q=state.paper[0];
 await Promise.all([service.answer('answer-replay',{attemptId:view.id,questionId:q.id,option:q.correctIndex}),service.answer('answer-replay',{attemptId:view.id,questionId:q.id,option:q.correctIndex})]);
 const after=(await row('answer-replay')).body;assert.equal(after.position,1);assert.equal(after.score,1);
 await assert.rejects(service.answer('coverage',{attemptId:view.id,questionId:q.id,option:0}),/not your current/);
 await assert.rejects(service.answer('answer-replay',{attemptId:view.id,questionId:'unissued-question',option:0}),/already changed/);
});

test('server deadlines reject late answers and resuming cannot reset the same question timer',async()=>{
 const view=await start('deadline');const first=(await row('deadline')).body.paper[0];const before=now;now=view.deadline+1;
 try{const next=await service.answer('deadline',{attemptId:view.id,questionId:first.id,option:first.correctIndex});assert.equal(next.position,1);assert.equal((await row('deadline')).body.score,0);const again=await service.state('deadline');assert.equal(again.deadline,next.deadline);assert.equal(again.question.id,next.question.id);}finally{now=before;}
});

test('scores and tied ranks are computed from persisted answers, without exposing identity or answers in public results',async()=>{
 for(const uid of ['tie-one','tie-two']){let view=await start(uid);for(let i=0;i<20;i++){const state=(await row(uid)).body;const q=state.paper[state.position];view=await service.answer(uid,{attemptId:view.id,questionId:q.id,option:q.correctIndex});}assert.equal(view.result.score,20);assert.equal(view.result.rank,null);}
 assert.equal((await service.overview(config.id)).leaderboard.length,0);const previous=now;now=Date.parse(config.endsAt)+1;const overview=await service.overview(config.id);assert.equal(overview.leaderboard.filter(x=>x.rank===1).length,2);assert.doesNotMatch(JSON.stringify(overview),/correctIndex|"paper"|"uid"|"events"/);
 const result=await service.result(overview.leaderboard[0].resultId);assert.equal(result.score,20);assert.equal(result.rank,1);now=previous;
});

test('names, optional pictures and incomplete banks are validated before consuming an attempt',async()=>{
 assert.throws(()=>domain.displayName('<script>bad</script>'),/without markup/);assert.throws(()=>domain.publicPhoto('https://googleusercontent.com.attacker.test/a.png'),/Google profile/);assert.equal(domain.publicPhoto(null),null);
 const bank=localPrivateQuestions();assert.throws(()=>domain.validateBank([{...bank[0],options:['A','a','B','C']},...bank.slice(1)]),/distinct options/);
 await assert.rejects(service.saveRound({config:{...config,id:'insufficient'},bank:bank.filter(q=>q.difficulty!=='hard').slice(0,20),enabled:true}),/4 difficult/);
 assert.equal(await row('unused-student'),null);
});

test('HTTP rejects forged scores, prototype actions, foreign origins, missing Google identity and unsafe proxy starts',async()=>{
 const base={repo,origins:['https://raytechinstitute.com'],siteKey:'site',turnstileSecret:'secret',ipSalt:'test-only-salt',verifyIdentity:async token=>{if(token!=='Bearer qa-user')throw new domain.CompetitionError(401,'Google sign-in required');return{uid:'http-user'};},verifyFreshIdentity:async()=>({uid:'http-user'}),verifyAdmin:async()=>false,trustedIp:()=>null};
 const handler=createCompetitionHandler({...base,localPreview:true});
 const request=(action,payload={},headers={})=>new Request('https://example.test/competition',{method:'POST',headers:{Origin:'https://raytechinstitute.com',Authorization:'Bearer qa-user','Content-Type':'application/json',...headers},body:JSON.stringify({action,payload})});
 assert.equal((await handler(request('answer',{attemptId:'x',questionId:'x',option:0,score:999}))).status,400);
 assert.equal((await handler(request('__proto__'))).status,400);assert.equal((await handler(request('me',{}, {Origin:'https://attacker.test'}))).status,403);assert.equal((await handler(request('me',{}, {Authorization:'Bearer fake'}))).status,401);
 assert.equal((await handler(request('admin_rounds'))).status,403);
 const protectedHandler=createCompetitionHandler({...base,proxyRequired:true,proxySecret:'private-proxy'});assert.equal((await protectedHandler(request('start',{roundId:config.id,consent:true,displayName:'Student',photoUrl:null,turnstileToken:'1234567890'}))).status,503);
 assert.equal(await row('http-user'),null);
});

test('Turnstile must match its action and hostname; IP hashes rotate weekly and never store the raw address',async()=>{
 const request=new Request('https://example.test/competition',{method:'POST',headers:{Origin:'https://raytechinstitute.com',Authorization:'Bearer qa-user','Content-Type':'application/json'},body:JSON.stringify({action:'start',payload:{roundId:config.id,displayName:'HTTP learner',photoUrl:null,consent:true,turnstileToken:'test-token-value'}})});
 const handler=createCompetitionHandler({repo,origins:['https://raytechinstitute.com'],siteKey:'test-site',turnstileSecret:'test-secret',ipSalt:'test-hash-salt',verifyIdentity:async()=>({uid:'turnstile-user'}),verifyFreshIdentity:async()=>({uid:'turnstile-user'}),verifyAdmin:async()=>false,trustedIp:()=> '203.0.113.40',fetcher:async()=>Response.json({success:true,action:'another-action',hostname:'raytechinstitute.com'})});
 assert.equal((await handler(request)).status,400);assert.equal(await row('turnstile-user'),null);
 const a=await competitionIpHash('203.0.113.40','test-hash-salt',Date.now());const b=await competitionIpHash('203.0.113.40','test-hash-salt',Date.now()+7*86400000);assert.notEqual(a,b);assert.match(a,/^[a-f0-9]{64}$/);
 const records=(await db.query('SELECT subject FROM competition_private.rate_limits')).rows;assert.ok(records.every(record=>!record.subject.includes('203.0.113.40')));
});

test('Firebase verification checks the cryptographic signature, Google provider, expiry and audience with cached public keys',async()=>{
 const key=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);const jwk=await crypto.subtle.exportKey('jwk',key.publicKey);jwk.kid='qa-key';let calls=0;
 const verify=createCompetitionTokenVerifier('raytechinstitute',async()=>{calls++;return Response.json({keys:[jwk]},{headers:{'Cache-Control':'max-age=3600'}});});
 const encode=value=>Buffer.from(JSON.stringify(value)).toString('base64url');const seconds=Math.floor(Date.now()/1000);
 const claims={sub:'google-user',aud:'raytechinstitute',iss:'https://securetoken.google.com/raytechinstitute',exp:seconds+1000,iat:seconds,auth_time:seconds,firebase:{sign_in_provider:'google.com'}};
 async function token(changes={},header={alg:'RS256',kid:'qa-key'}){const value=encode(header)+'.'+encode({...claims,...changes});return value+'.'+Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key.privateKey,new TextEncoder().encode(value))).toString('base64url');}
 const valid=await token();assert.equal((await verify('Bearer '+valid)).uid,'google-user');await verify('Bearer '+valid);assert.equal(calls,1);
 await assert.rejects(verify('Bearer '+await token({firebase:{sign_in_provider:'password'}})),/Google/);await assert.rejects(verify('Bearer '+await token({exp:seconds-1})),/Google/);await assert.rejects(verify('Bearer '+await token({aud:'foreign-project'})),/Google/);
 const adminVerify=createCompetitionTokenVerifier('raytechinstitute',async()=>Response.json({keys:[jwk]}),Date.now,false);assert.equal((await adminVerify('Bearer '+await token({firebase:{sign_in_provider:'password'}}))).uid,'google-user');await assert.rejects(adminVerify('Bearer '+await token({firebase:{sign_in_provider:'anonymous'}})),/Google/);
 const tampered=valid.split('.');tampered[1]=encode({...claims,sub:'attacker'});await assert.rejects(verify('Bearer '+tampered.join('.')),/Google/);
});

test('answer review unlocks only after closing and only for the attempt owner',async()=>{
 const own=(await row('tie-one')).body;
 await assert.rejects(service.review('tie-one',own.id),/after the weekly round closes/);
 await assert.rejects(service.review('tie-two',own.id),/not available to your account/);
 const before=now;now=own.endsAt+1;
 try{const review=await service.review('tie-one',own.id);assert.equal(review.length,20);assert.ok(review.every(q=>Number.isInteger(q.correctIndex)));}finally{now=before;}
});

test('administrator review holds hide a score from rankings and leave a private audit trail',async()=>{
 const own=(await row('tie-one')).body;
 await service.setReview('reviewing-admin',{attemptId:own.id,held:true,reason:'Review suspicious activity'});
 assert.equal((await service.result(own.id)).rank,null);
 assert.equal((await repo.call('leaderboard',null,{roundId:config.id})).some(item=>item.resultId===own.id),false);
 const attempts=await service.adminAttempts(config.id);assert.equal(attempts.find(item=>item.attemptId===own.id).underReview,true);
 assert.doesNotMatch(JSON.stringify(attempts),/correctIndex|"paper"|"uid"/);
 await service.setReview('reviewing-admin',{attemptId:own.id,held:false,reason:'Review completed; score valid'});
 assert.equal((await service.result(own.id)).rank,null);
 assert.equal((await db.query('SELECT count(*)::int AS count FROM competition_private.reviews WHERE attempt_id=$1',[own.id])).rows[0].count,2);
});

test('closed banks cannot reopen as a new scored round after solutions have been released',async()=>{
 const earlier={...config,id:'closed-history',startsAt:new Date(Date.parse(week.startsAt)-7*86400000).toISOString(),endsAt:week.startsAt};
 await service.saveRound({config:earlier,bank:localPrivateQuestions(),enabled:false});
 await assert.rejects(service.saveRound({config:{...config,id:'reused-bank'},bank:localPrivateQuestions(),enabled:true}),/BANK_REUSED/);
 const fresh=localPrivateQuestions().map(q=>({...q,prompt:'Fresh bank: '+q.prompt}));
 await service.saveRound({config:{...config,id:'fresh-bank'},bank:fresh,enabled:true});
});

test('maintenance is private and unexpected database errors do not expose SQL details',async()=>{
 const base={repo,origins:['https://raytechinstitute.com'],siteKey:'',turnstileSecret:'',ipSalt:'',verifyIdentity:async()=>({uid:'test'}),verifyAdmin:async()=>false,trustedIp:()=>null,proxySecret:'qa-secret'};
 const handler=createCompetitionHandler(base);
 assert.equal((await handler(new Request('https://example.test/competition/maintenance',{method:'POST'}))).status,403);
 const success=await handler(new Request('https://example.test/competition/maintenance',{method:'POST',headers:{'x-competition-proxy':'qa-secret','x-competition-job':'qa-secret'}}));assert.equal(success.status,200);assert.equal(success.headers.get('Cache-Control'),'no-store');
 const broken=createCompetitionHandler({...base,repo:{call:async()=>{throw new Error('secret SQL private credential');}}});
 const response=await broken(new Request('https://example.test/competition'));assert.equal(response.status,503);assert.doesNotMatch(await response.text(),/SQL|credential/);
});

test('the Cloudflare proxy rejects missing/forged identities before invoking the Edge backend',async()=>{
 const worker=(await loadTypescript('workers/competition-proxy.ts')).default;const env={COMPETITION_UPSTREAM:'https://example.supabase.co/functions/v1/competition',COMPETITION_PROXY_SECRET:'private-secret',ALLOWED_ORIGINS:'https://raytechinstitute.com'};const context={waitUntil(){}};
 const missing=await worker.fetch(new Request('https://competition.raytechinstitute.com',{method:'POST',headers:{Origin:'https://raytechinstitute.com'}}),env,context);assert.equal(missing.status,401);
 const forged=await worker.fetch(new Request('https://competition.raytechinstitute.com',{method:'POST',headers:{Origin:'https://raytechinstitute.com',Authorization:'Bearer fabricated-token'}}),env,context);assert.equal(forged.status,401);assert.doesNotMatch(await forged.text(),/private-secret|supabase/);
 const foreign=await worker.fetch(new Request('https://competition.raytechinstitute.com',{headers:{Origin:'https://attacker.test'}}),env,context);assert.equal(foreign.status,403);
});

test('a protected production start requires a fresh Google identity and a matching Turnstile verification',async()=>{
 let fresh=0;const base={repo,origins:['https://raytechinstitute.com'],siteKey:'site',turnstileSecret:'secret',ipSalt:'salt',proxyRequired:true,proxySecret:'proxy',verifyIdentity:async()=>({uid:'protected-user'}),verifyFreshIdentity:async()=>{fresh++;return{uid:'protected-user'};},verifyAdmin:async()=>false,trustedIp:()=>null,fetcher:async()=>Response.json({success:true,action:'competition-start',hostname:'raytechinstitute.com'})};
 const request=()=>new Request('https://example.test/competition',{method:'POST',headers:{Origin:'https://raytechinstitute.com',Authorization:'Bearer qa-token','Content-Type':'application/json','x-competition-proxy':'proxy'},body:JSON.stringify({action:'start',payload:{roundId:config.id,displayName:'Protected learner',photoUrl:null,consent:true,turnstileToken:'verified-test-token'}})});
 const revoked=createCompetitionHandler({...base,verifyFreshIdentity:async()=>{throw new domain.CompetitionError(401,'Sign in again');}});assert.equal((await revoked(request())).status,401);assert.equal(await row('protected-user'),null);
 const handler=createCompetitionHandler(base);const response=await handler(request());assert.equal(response.status,200);assert.equal(response.headers.get('Cache-Control'),'no-store');assert.equal(fresh,1);assert.ok((await row('protected-user')).body.id);assert.doesNotMatch(await response.text(),/correctIndex|"paper"|proxy/);
 const publicResponse=await handler(new Request('https://example.test/competition'));assert.match(publicResponse.headers.get('Cache-Control'),/max-age=30/);
});
