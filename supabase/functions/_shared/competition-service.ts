import type {CompetitionRound,CompetitionQuestion,CompetitionAttemptView,CompetitionStanding} from './competition-types.ts';

export class CompetitionError extends Error { constructor(public status:number,message:string){super(message);} }

export function competitionDatabaseError(error:unknown){const text=error&&typeof error==='object'&&'message'in error?String(error.message):'';if(text==='ROUND_LOCKED')return new CompetitionError(409,'This round already has attempts. Create a new weekly round instead of changing its questions.');if(text==='ROUND_CHANGED')return new CompetitionError(409,'This round changed before your attempt started. Reload it and try again.');if(text==='BANK_REUSED')return new CompetitionError(409,'This bank contains questions from a closed round. Import fresh private questions before opening it.');return new Error('Competition persistence could not complete the request.');}

export type PrivateQuestion=Omit<CompetitionQuestion,'seconds'> & {correctIndex:number;seconds?:number;explanation?:string};

type PaperQuestion=CompetitionQuestion & {correctIndex:number};

export interface PrivateAttempt {

 id:string;roundId:string;roundRevision:string;displayName:string;photoUrl:string|null;status:'active'|'completed';

 paper:PaperQuestion[];position:number;score:number;deadline:number;endsAt:number;

 lastQuestionId:string|null;completedAt:string|null;endsAtIso:string;events:{type:string;at:number}[];underReview:boolean;

}

export interface CompetitionRepository { call(action:string,uid:string|null,payload?:Record<string,unknown>):Promise<any>; }

type Versioned={body:PrivateAttempt;version:number};

export function pakistanWeek(now:number){const date=new Date(now+5*3600000);const day=(date.getUTCDay()+6)%7;date.setUTCDate(date.getUTCDate()-day);date.setUTCHours(0,0,0,0);const startsAt=new Date(date.getTime()-5*3600000).toISOString();return{startsAt,endsAt:new Date(Date.parse(startsAt)+7*86400000).toISOString()};}

export function publicPhoto(value:unknown):string|null{

 if(value===null||value===undefined||value==='')return null;

 if(typeof value!=='string'||value.length>1500)throw new CompetitionError(400,'Choose your Google profile photo or use initials.');

 try{const u=new URL(value);if(u.protocol!=='https:'||!/^([a-z0-9-]+\.)?googleusercontent\.com$/i.test(u.hostname)||u.username||u.password)throw 0;return u.href;}catch{throw new CompetitionError(400,'Choose your Google profile photo or use initials.');}

}

export function displayName(value:unknown){if(typeof value!=='string')throw new CompetitionError(400,'Enter a display name.');const name=value.normalize('NFKC').trim().replace(/\s+/g,' ');if(name.length<2||Array.from(name).length>30||/[<>\x00-\x1f\x7f\u202a-\u202e\u2066-\u2069]/.test(name))throw new CompetitionError(400,'Use a display name between 2 and 30 characters, without markup.');return name;}

export function validateRound(input:any):CompetitionRound{

 const name=displayName(input?.title);if(!/^[a-z0-9][a-z0-9-]{2,79}$/.test(input?.id||'')||typeof input.subject!=='string'||input.subject.length<2||input.subject.length>100)throw new CompetitionError(400,'Provide a round ID, title and subject.');

 const start=Date.parse(input.startsAt),end=Date.parse(input.endsAt);if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||end-start>31*86400000)throw new CompetitionError(400,'Choose an end time after the start, within 31 days.');

 const resultsAt=Date.parse(input.resultsAt||input.endsAt);if(!Number.isFinite(resultsAt)||resultsAt<end)throw new CompetitionError(400,'Results must be scheduled at or after the competition ends.');

 const blueprint={easy:6,medium:10,hard:4};const times={easy:15,medium:30,hard:60};

 for(const kind of ['easy','medium','hard'] as const){const time=input.times?.[kind]??times[kind];if(!Number.isInteger(time)||time<10||time>120)throw new CompetitionError(400,'Question time must be between 10 and 120 seconds.');times[kind]=time;}

 return{id:input.id,title:name,subject:input.subject.trim(),startsAt:new Date(start).toISOString(),endsAt:new Date(end).toISOString(),resultsAt:new Date(resultsAt).toISOString(),questionCount:20,blueprint,times};

}

export function validateBank(value:unknown):PrivateQuestion[]{

 if(!Array.isArray(value)||value.length<20||value.length>2000)throw new CompetitionError(400,'Import 20 to 2,000 reviewed competition questions.');

 const ids=new Set<string>(),prompts=new Set<string>();

 return value.map(q=>{

  if(!q||typeof q.id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(q.id)||ids.has(q.id)||typeof q.prompt!=='string'||q.prompt.trim().length<10||q.prompt.length>3000||prompts.has(q.prompt.trim().toLowerCase())||!Array.isArray(q.options)||q.options.length!==4||q.options.some((o:unknown)=>typeof o!=='string'||!(o as string).trim()||(o as string).length>1200)||new Set(q.options.map((o:string)=>o.trim().toLowerCase())).size!==4||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>3||!['easy','medium','hard'].includes(q.difficulty)||typeof q.topic!=='string'||!q.topic.trim()||q.topic.length>150)throw new CompetitionError(400,'Every question needs a unique ID and prompt, four distinct options, a valid answer, topic and difficulty.');

  if(q.seconds!==undefined&&(!Number.isInteger(q.seconds)||q.seconds<10||q.seconds>120))throw new CompetitionError(400,'Question time must be between 10 and 120 seconds.');

  if(q.explanation!==undefined&&(typeof q.explanation!=='string'||q.explanation.length>3000))throw new CompetitionError(400,'Keep each optional explanation below 3,000 characters.');

  ids.add(q.id);prompts.add(q.prompt.trim().toLowerCase());return{id:q.id,prompt:q.prompt.trim(),options:q.options.map((o:string)=>o.trim()),correctIndex:q.correctIndex,difficulty:q.difficulty,topic:q.topic.trim(),...(q.seconds?{seconds:q.seconds}:{}),...(q.explanation?{explanation:q.explanation}:{})};

 });

}

function shuffled<T>(items:T[],random:()=>number){const list=items.slice();for(let i=list.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;}

export function createCompetitionService(repo:CompetitionRepository,options:{now?:()=>number;random?:()=>number;uuid?:()=>string}={}){

 const now=options.now||Date.now;const random=options.random||(()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296);const uuid=options.uuid||(()=>crypto.randomUUID());

 const finish=(state:PrivateAttempt,time:number)=>{state.status='completed';state.completedAt=new Date(time).toISOString();};

 const advance=(state:PrivateAttempt,time:number)=>{state.position++;if(state.position>=state.paper.length||time>=state.endsAt)finish(state,time);else state.deadline=Math.min(time+state.paper[state.position].seconds*1000,state.endsAt);};

 async function releasedResult(resultId:string){const result=await repo.call('result',null,{resultId});if(!result)return null;const round=await repo.call('round',null,{roundId:result.roundId});if(round&&now()<Date.parse(round.config.resultsAt||round.config.endsAt)){result.rank=null;result.resultsPending=true;}return result;}
 async function view(state:PrivateAttempt):Promise<CompetitionAttemptView>{const q=state.status==='active'?state.paper[state.position]:null;return{id:state.id,roundId:state.roundId,status:state.status,position:state.position,total:state.paper.length,displayName:state.displayName,photoUrl:state.photoUrl,serverNow:now(),deadline:q?state.deadline:null,question:q?{id:q.id,prompt:q.prompt,options:q.options,topic:q.topic,difficulty:q.difficulty,seconds:q.seconds}:null,result:state.status==='completed'?await releasedResult(state.id):null};}

 async function change(uid:string,operation:(state:PrivateAttempt)=>boolean){

  for(let tries=0;tries<5;tries++){

   const row:Versioned|null=await repo.call('attempt',uid);if(!row)throw new CompetitionError(404,'Start a competition before submitting an answer.');

   const state=structuredClone(row.body);const changed=operation(state);

   if(!changed)return view(state);

   if(await repo.call('cas',uid,{body:state,version:row.version}))return view(state);

  }throw new CompetitionError(409,'Another tab updated this attempt. Resume it before continuing.');

 }

 return{

  async overview(roundId?:string,offset=0){offset=Number.isSafeInteger(offset)&&offset>=0?Math.min(offset,100000):0;const rounds:CompetitionRound[]=await repo.call('catalog',null);const current=rounds.find(r=>r.id===roundId)||rounds.find(r=>Date.parse(r.startsAt)<=now()&&Date.parse(r.endsAt)>now())||rounds[0];return{rounds,leaderboard:current?await repo.call('leaderboard',null,{roundId:current.id,offset}):[],serverNow:now()};},

  async me(uid:string){const row:Versioned|null=await repo.call('attempt',uid);return row?this.state(uid):null;},

  async start(uid:string,input:{roundId:string;displayName:unknown;photoUrl:unknown}){

   const existing:Versioned|null=await repo.call('attempt',uid);if(existing)return this.state(uid);

   const record=await repo.call('round',null,{roundId:input.roundId});if(!record?.enabled)throw new CompetitionError(404,'This competition is not open.');

   const config=validateRound(record.config);const time=now();if(time<Date.parse(config.startsAt)||time>=Date.parse(config.endsAt))throw new CompetitionError(409,'This weekly round is not accepting attempts.');

   const bank=validateBank(record.bank);const paper:PaperQuestion[]=[];

   for(const kind of ['easy','medium','hard'] as const){const pool=bank.filter(q=>q.difficulty===kind);if(pool.length<config.blueprint[kind])throw new CompetitionError(503,'The reviewed question bank is not ready yet. Your weekly attempt was not used.');

    const topics=Array.from(new Set(pool.map(q=>q.topic))).sort();const groups=topics.map(topic=>shuffled(pool.filter(q=>q.topic===topic),random));const chosen:PrivateQuestion[]=[];

    while(chosen.length<config.blueprint[kind])for(const group of groups){if(group.length&&chosen.length<config.blueprint[kind])chosen.push(group.shift()!);}

    for(const q of chosen){const indices=shuffled([0,1,2,3],random);paper.push({...q,options:indices.map(i=>q.options[i]),correctIndex:indices.indexOf(q.correctIndex),seconds:q.seconds||config.times[kind]});}

   }

   const selected=shuffled(paper,random);const body:PrivateAttempt={id:uuid(),roundId:config.id,roundRevision:record.revision,displayName:displayName(input.displayName),photoUrl:publicPhoto(input.photoUrl),status:'active',paper:selected,position:0,score:0,deadline:Math.min(time+selected[0].seconds*1000,Date.parse(config.endsAt)),endsAt:Date.parse(config.endsAt),endsAtIso:config.endsAt,lastQuestionId:null,completedAt:null,events:[],underReview:false};

   const saved:Versioned=await repo.call('insert',uid,{body});return view(saved.body);

  },

  async state(uid:string){return change(uid,state=>{const time=now();if(state.status==='completed')return false;if(time>=state.endsAt){finish(state,time);return true;}if(time>=state.deadline){state.lastQuestionId=state.paper[state.position].id;advance(state,time);return true;}return false;});},

  async answer(uid:string,input:{questionId:string;option:number|null;attemptId:string}){

   return change(uid,state=>{if(state.id!==input.attemptId)throw new CompetitionError(409,'This is not your current weekly attempt.');if(state.status==='completed'||state.lastQuestionId===input.questionId)return false;

    const q=state.paper[state.position];if(q.id!==input.questionId)throw new CompetitionError(409,'That question has already changed. Resume the current question.');

    const time=now();if(time>=state.endsAt){finish(state,time);return true;}

    if(time<state.deadline&&input.option===q.correctIndex)state.score++;

    state.lastQuestionId=q.id;advance(state,time);return true;

   });

  },

  async event(uid:string,type:string){if(!['hidden','visible','blur','focus'].includes(type))throw new CompetitionError(400,'Unsupported test event.');return change(uid,state=>{if(state.status!=='active'||state.events.length>=50)return false;state.events.push({type,at:now()});return true;});},

  async result(resultId:string):Promise<CompetitionStanding>{const result=await releasedResult(resultId);if(!result)throw new CompetitionError(404,'This result is not available.');return result;},

  async review(uid:string,attemptId:string){const stored:Versioned|null=await repo.call('attempt_by_id',uid,{attemptId});if(!stored)throw new CompetitionError(404,'This attempt is not available to your account.');if(now()<Date.parse((await repo.call('round',null,{roundId:stored.body.roundId}))?.config?.resultsAt||stored.body.endsAtIso))throw new CompetitionError(403,'Answers unlock after the weekly round closes.');return stored.body.paper.map(q=>({id:q.id,prompt:q.prompt,options:q.options,correctIndex:q.correctIndex,explanation:(q as PaperQuestion&{explanation?:string}).explanation||''}));},

  async adminRounds(){return repo.call('admin_rounds',null);},

  async adminAttempts(roundId:string){return repo.call('admin_attempts',null,{roundId});},

  async setReview(uid:string,input:any){if(typeof input.attemptId!=='string'||!/^[a-f0-9-]{36}$/.test(input.attemptId)||typeof input.held!=='boolean'||typeof input.reason!=='string'||input.reason.trim().length<3||input.reason.length>300)throw new CompetitionError(400,'Provide the attempt, review decision and a short private reason.');return repo.call('set_review',uid,{attemptId:input.attemptId,held:input.held,reason:input.reason.trim()});},

  async saveRound(input:any){const config=validateRound(input.config),bank=validateBank(input.bank);if(input.enabled&&(['easy','medium','hard'] as const).some(kind=>bank.filter(q=>q.difficulty===kind).length<config.blueprint[kind]))throw new CompetitionError(400,'Add at least 6 easy, 10 medium and 4 difficult questions before opening the round.');return repo.call('save_round',null,{config,bank,enabled:input.enabled===true});},

 };

}
