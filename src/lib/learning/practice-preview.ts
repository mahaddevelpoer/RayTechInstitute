/** Inert parsing plus an opaque, scriptless iframe and deny-by-default CSP.
 * This is defence in depth, not a substitute for the iframe sandbox. */
export function practicePreview(code:string,language:'html'|'css',doc:Document){
 const template=doc.createElement('template');
 template.innerHTML=language==='css'?`<style>${code}</style><main><h1>Practice heading</h1><p>Change the CSS to style this sample page.</p><button>Sample button</button><ul><li>First item</li><li>Second item</li></ul></main>`:code;
 template.content.querySelectorAll('script,iframe,frame,frameset,object,embed,base,meta,link,form,svg,math,portal').forEach(node=>node.remove());
 for(const node of Array.from(template.content.querySelectorAll('*')))for(const attr of Array.from(node.attributes)){
  const name=attr.name.toLowerCase();const value=attr.value.trim();
  if(name.startsWith('on')||['srcdoc','action','formaction','ping','target','download','srcset','poster','data','background','codebase','manifest'].includes(name)||(name==='href'&&!/^#[A-Za-z0-9_-]*$/.test(value))||(name==='src'&&!/^data:image\/(?:png|jpeg|gif|webp|avif);base64,[a-z0-9+/=]+$/i.test(value)))node.removeAttribute(attr.name);
 }
 return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'; base-uri 'none'"></head><body>${template.innerHTML}</body></html>`;
}
