/** Editorial length is a choice, not a save-validation quota. */
export function validateArticleDraft(value:unknown):Record<string,unknown>{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('The AI returned an invalid article. Please regenerate it.');
 const article=value as Record<string,unknown>;
 for(const key of ['title','content'])if(typeof article[key]!=='string'||!(article[key] as string).trim())throw new Error(`The AI article is missing ${key}. Please regenerate it.`);
 return article;
}
export function validateAiArticleSeo(article:Record<string,unknown>){
 const seo=article.seo as Record<string,unknown>|undefined;
 if(!seo||typeof seo!=='object'||Array.isArray(seo))throw new Error('The AI draft is missing its search and sharing details. Regenerate before saving.');
 for(const key of ['title','description','imageAlt','socialTitle','socialDescription'])if(typeof seo[key]!=='string'||!(seo[key] as string).trim())throw new Error(`The AI draft is missing SEO ${key}. Regenerate before saving.`);
 // Models can omit unknown optional details or return a URL array. Preserve
 // supplied strings without inventing references; absent fields stay disabled.
 for(const key of ['sources','internalLinks','imageCaption','socialImage','authorUrl']){
  const value=seo[key];
  seo[key]=typeof value==='string'?value.trim():['sources','internalLinks'].includes(key)&&Array.isArray(value)?value.filter(item=>typeof item==='string').map(item=>item.trim()).filter(Boolean).join('\n'):'';
 }
 seo.enabled=['title','description','imageAlt','socialTitle','socialDescription',...['sources','internalLinks','imageCaption','socialImage','authorUrl'].filter(key=>(seo[key] as string).trim())];
 return article;
}
