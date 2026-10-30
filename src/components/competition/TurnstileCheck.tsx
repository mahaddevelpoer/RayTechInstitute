'use client';
import {useEffect,useRef,useState} from 'react';
type Turnstile={render:(element:HTMLElement,options:Record<string,unknown>)=>string;remove:(id:string)=>void};
declare global { interface Window {turnstile?:Turnstile} }
export function TurnstileCheck({siteKey,onToken}:{siteKey:string;onToken:(token:string)=>void}){
 const [failed,setFailed]=useState(false),[retry,setRetry]=useState(0);
 const ref=useRef<HTMLDivElement>(null);const callback=useRef(onToken);callback.current=onToken;
 useEffect(()=>{let id:string|undefined;let cancelled=false;let timer:ReturnType<typeof setInterval>;
  const began=Date.now();setFailed(false);const fail=()=>{if(!cancelled){setFailed(true);callback.current('');}};
  function mount(){if(cancelled||!window.turnstile||!ref.current)return false;id=window.turnstile.render(ref.current,{sitekey:siteKey,action:'competition-start',theme:'auto',callback:(token:string)=>callback.current(token),'expired-callback':fail,'error-callback':fail});return true;}
  if(!siteKey)return;let script=document.querySelector<HTMLScriptElement>('script[data-competition-turnstile]');if(!script){script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.dataset.competitionTurnstile='true';document.head.appendChild(script);}
  if(!mount())timer=setInterval(()=>{if(mount())clearInterval(timer);else if(Date.now()-began>15000){clearInterval(timer);fail();}},150);
  return()=>{cancelled=true;clearInterval(timer);if(id)window.turnstile?.remove(id);callback.current('');};
 },[siteKey,retry]);
 return <div className="arena-security-check"><div ref={ref} aria-label="Competition security check"/>{failed&&<p role="alert">The security check expired or could not load. <button className="arena-text-link" type="button" onClick={()=>{if(!window.turnstile)document.querySelector('script[data-competition-turnstile]')?.remove();setRetry(value=>value+1);}}>Retry security check</button></p>}</div>;
}
