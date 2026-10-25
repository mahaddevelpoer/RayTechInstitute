// Count only successful saved audio responses for the exact selected sentence.
export function savedAudioSource({url,status,contentType},hash,base,storageOrigin='https://btxrkhwyugzliswznkpx.supabase.co') {
  if(status!==200||!/^[a-f0-9]{64}$/.test(hash))return null;
  let target;
  try { target=new URL(url); } catch { return null; }
  const mime=(contentType||'').split(';')[0].trim().toLowerCase();
  if(target.origin===new URL(base).origin&&target.pathname===`/codi/audio/${hash}.mp3`&&['audio/mpeg','audio/mp3'].includes(mime))return 'prepared';
  if(target.origin===storageOrigin&&target.pathname===`/storage/v1/object/public/codi-lesson-audio/${hash}.json`&&mime==='application/json')return 'storage';
  return null;
}
