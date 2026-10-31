/** Editorial length is a choice, not a save-validation quota. */
export function validateArticleDraft(value:unknown):Record<string,unknown>{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('The AI returned an invalid article. Please regenerate it.');
 const article=value as Record<string,unknown>;
 for(const key of ['title','content'])if(typeof article[key]!=='string'||!(article[key] as string).trim())throw new Error(`The AI article is missing ${key}. Please regenerate it.`);
 return article;
}
export function validateAiArticleSeo(article:Record<string,unknown>){
 validateArticleDraft(article);
 const object=(value:unknown):Record<string,unknown>=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
 const text=(...values:unknown[])=>values.find(value=>typeof value==='string'&&value.trim()) as string|undefined;
 const supplied=object(article.seo);const metadata=object(article.metadata);
 const seo:Record<string,unknown>=Object.assign(supplied,{...metadata,...supplied});
 const plain=String(article.content).replace(/```[\s\S]*?```/g,'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[#*_>`]/g,'').split(/\n\s*\n/).map(value=>value.trim()).find(Boolean)||String(article.title);
 const description=(text(seo.description,seo.metaDescription,article.excerpt,article.description)||plain).trim();
 seo.title=(text(seo.title,seo.metaTitle,article.seoTitle,article.title)||'').trim();
 seo.description=description;
 seo.imageAlt=(text(seo.imageAlt,seo.image_alt,article.imageAlt,article.title)||'').trim();
 seo.socialTitle=(text(seo.socialTitle,seo.ogTitle,seo.title)||'').trim();
 seo.socialDescription=(text(seo.socialDescription,seo.ogDescription,description)||'').trim();
 for(const key of ['sources','internalLinks','imageCaption','socialImage','authorUrl']){
  const value=seo[key]??article[key];
  seo[key]=typeof value==='string'?value.trim():['sources','internalLinks'].includes(key)&&Array.isArray(value)?value.map(item=>typeof item==='string'?item:text(object(item).url,object(item).href)||'').map(item=>item.trim()).filter(Boolean).join('\n'):'';
 }
 // Only actual supplied references are retained. Never manufacture citations,
 // profile identities or image URLs to satisfy a response schema.
 seo.sources=String(seo.sources).split('\n').filter(url=>{try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}}).join('\n');
 seo.internalLinks=String(seo.internalLinks).split('\n').filter(url=>url.startsWith('/')&&!url.startsWith('//')).join('\n');
 for(const key of ['socialImage','authorUrl'])if(seo[key]){try{const u=new URL(String(seo[key]));if(u.protocol!=='https:'||u.username||u.password)seo[key]='';}catch{seo[key]='';}}
 seo.enabled=['title','description','imageAlt','socialTitle','socialDescription',...['sources','internalLinks','imageCaption','socialImage','authorUrl'].filter(key=>(seo[key] as string).trim())];
 article.seo=seo;
 if(!text(article.excerpt))article.excerpt=description;
 return article;
}
