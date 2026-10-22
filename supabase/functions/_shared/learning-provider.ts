import {generateLearningDots,dotsResponseSchema}from'./learning-dots.ts';
import {consumeLearningSse,type LearningStreamEvent}from'./learning-stream.ts';
import type{LearningResponseKind}from'./learning-authoring.ts';
export async function generateLearningGemini(key:string,system:string,prompt:string,kind:LearningResponseKind,emit:(e:LearningStreamEvent)=>void,signal?:AbortSignal,fetcher:typeof fetch=fetch){
 if(!key)throw new Error('Gemini fallback is not configured. Nothing was saved.');
 for(const model of ['gemini-3.1-flash-lite','gemini-2.5-flash-lite']){
  signal?.throwIfAborted();emit({type:'stage',stage:`Gemini fallback: ${kind}`,model});
  const r=await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,{method:'POST',signal,headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents:[{parts:[{text:`${prompt}\nReturn one complete JSON object matching this schema. No tools, links to invented files, or Markdown wrappers.\n${JSON.stringify(dotsResponseSchema(kind))}`}]}],generationConfig:{temperature:.3,maxOutputTokens:24576,responseMimeType:'application/json'}})});
  if(r.status===404){await r.body?.cancel();continue;}
  if(!r.ok){await r.body?.cancel();throw new Error(r.status===429?'Gemini free allowance is currently unavailable. Retry later; no draft was saved.':'Gemini generation is unavailable. No incomplete draft was saved.');}
  let text='',finish='';
  await consumeLearningSse(r,data=>{signal?.throwIfAborted();let value;try{value=JSON.parse(data);}catch{throw new Error('Gemini sent an interrupted response. Nothing was saved.');}if(value.error||value.promptFeedback?.blockReason)throw new Error('Gemini could not complete this draft. Nothing was saved.');const candidate=value.candidates?.[0];if(candidate?.finishReason)finish=candidate.finishReason;
   for(const part of candidate?.content?.parts||[])if(typeof part.text==='string'&&!part.thought){text+=part.text;if(text.length>180000)throw new Error('The generated draft exceeded its safety limit. Nothing was saved.');emit({type:'delta',stage:kind,text:part.text,model});}
  });
  if(finish!=='STOP'||!text.trim())throw new Error('Gemini returned an incomplete draft. Nothing was saved.');
  try{JSON.parse(text);}catch{throw new Error('Gemini returned incomplete JSON. Nothing was saved.');}
  return text;
 }
 throw new Error('Configured Gemini Flash Lite models are unavailable. Nothing was saved.');
}
/** Approved fallback only. A user cancellation never starts another provider. */
export async function generateLearningWithFallback(dotsKey:string,geminiKey:string,system:string,prompt:string,kind:LearningResponseKind,emit:(e:LearningStreamEvent)=>void,signal?:AbortSignal,fetcher:typeof fetch=fetch,firstTokenMs=20000){
 signal?.throwIfAborted();
 if(dotsKey){const stalled=new AbortController();const combined=signal?AbortSignal.any([signal,stalled.signal]):stalled.signal;let timer:ReturnType<typeof setTimeout>;
  const arm=(ms:number)=>{clearTimeout(timer);timer=setTimeout(()=>stalled.abort(),ms);};arm(firstTokenMs);
  try{return await generateLearningDots(dotsKey,system,prompt,kind,e=>{if(e.type==='delta')arm(30000);emit(e);},combined,fetcher);}
  catch(error){if(signal?.aborted)throw error;if(!geminiKey)throw error;}
  finally{clearTimeout(timer!);}
 }
 signal?.throwIfAborted();return generateLearningGemini(geminiKey,system,prompt,kind,emit,signal,fetcher);
}
