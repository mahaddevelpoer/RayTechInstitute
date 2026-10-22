interface TeachingNode { type:string; tagName?:string; value?:string; properties?:Record<string,unknown>; children?:TeachingNode[] }
const textOf=(node:TeachingNode):string=>node.value??(node.children||[]).map(textOf).join('');
export function teachingRole(title:string){
 if(/mistake|pitfall|avoid|debug|wrong|error/i.test(title))return {kind:'caution',label:'Spot the mistake'};
 if(/check|recap|review|remember|takeaway|summary/i.test(title))return {kind:'review',label:'Check your understanding'};
 if(/try|practise|practice|exercise|build|challenge|your turn|change it/i.test(title))return {kind:'practice',label:'Your turn'};
 if(/example|walkthrough|trace|output|see it|watch/i.test(title))return {kind:'example',label:'See how it works'};
 return {kind:'concept',label:'Understand the idea'};
}
/** Presentation only. Preserve authored text, code, links and narration identities. */
export function lessonTeachingPlugin(){return (tree:TeachingNode)=>{
 const original=tree.children||[];const sections:TeachingNode[]=[];let current:TeachingNode|undefined;
 for(const node of original){
  if(!current||/^h[1-3]$/.test(node.tagName||'')){
   const role=teachingRole(/^h[1-3]$/.test(node.tagName||'')?textOf(node):'');
   current={type:'element',tagName:'section',properties:{className:['lesson-teaching-section'], 'data-teaching-kind':role.kind},children:[{type:'element',tagName:'div',properties:{className:['lesson-teaching-label'],'data-codi-ignore':true},children:[{type:'text',value:role.label}]}]};
   sections.push(current);
  }
  current.children!.push(node);
 }
 tree.children=sections;
};}
