import Link from 'next/link';
import { ArrowUpRight, Code2 } from 'lucide-react';
import type { LearningLanguage } from '@/types/learning';
export function LanguageCard({language,count}:{language:LearningLanguage;count:number}){
 return <Link className="language-directory-card" href={`/learn/${language.slug}/`}><div className="language-card-top"><span className="language-code-mark" aria-hidden="true">{language.title==='Python'?'Py':language.title==='JavaScript'?'JS':language.title==='HTML'?'<>':language.title==='CSS'?'{}':'PHP'}</span><ArrowUpRight size={21}/></div><h3>{language.title}</h3><p>{language.description}</p><div className="language-card-bottom"><span>{count} published {count===1?'lesson':'lessons'}</span><span><Code2 size={16}/>Open track</span></div></Link>;
}
