export async function notificationPreferences(action:'preferences'|'save',enabled?:boolean){
 const {auth}=await import('@/lib/firebase');const token=await auth.currentUser?.getIdToken();if(!token)throw new Error('Sign in with Google to manage winner emails.');
 const response=await fetch('https://btxrkhwyugzliswznkpx.supabase.co/functions/v1/competition-notifications',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({action,...(action==='save'?{enabled}:{})}),signal:AbortSignal.timeout(12000)});
 let result;try{result=await response.json();}catch{throw new Error('Email preferences could not be saved. Please retry.');}if(!response.ok||!result.success)throw new Error(result.error||'Email preferences could not be saved. Please retry.');return result.data;
}
