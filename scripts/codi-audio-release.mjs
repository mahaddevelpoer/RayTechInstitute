export const repository='mahaddevelpoer/RayTechInstitute';
export const tag='codi-prepared-audio-v1';
const headers=()=>({'Accept':'application/vnd.github+json',...(process.env.GH_TOKEN?{Authorization:'Bearer '+process.env.GH_TOKEN}:{}),'X-GitHub-Api-Version':'2022-11-28'});
export async function github(route,options={}){
 const response=await fetch(`https://api.github.com/repos/${repository}${route}`,{...options,headers:{...headers(),...options.headers},signal:AbortSignal.timeout(30000)});
 if(!response.ok&&response.status!==404)throw Error(`Prepared audio repository request failed (${response.status}); private diagnostics suppressed.`);
 return response;
}
export async function audioRelease(){const r=await github(`/releases/tags/${tag}`);if(r.status===404)return null;return r.json();}
export async function audioAssets(release){const assets=[];for(let page=1;;page++){const r=await github(`/releases/${release.id}/assets?per_page=100&page=${page}`);const part=await r.json();if(!Array.isArray(part))throw Error('Invalid audio asset index');assets.push(...part);if(part.length<100)break;if(page>200)throw Error('Prepared audio index is too large');}return assets.filter(a=>/^[a-f0-9]{64}\.mp3$/.test(a.name));}
