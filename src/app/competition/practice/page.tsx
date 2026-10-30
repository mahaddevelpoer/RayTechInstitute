import type {Metadata} from 'next';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {CompetitionArena} from '@/components/competition/CompetitionArena';
import {siteUrl} from '@/lib/site';
import {buildSeoTitle} from '@/utils/seo';
import '../competition.css';
export const metadata:Metadata={title:buildSeoTitle('Free Timed MCQ Practice Lab'),description:'Practise ten computing MCQs without an account. Build confidence with timed questions before joining the weekly ranked competition.',alternates:{canonical:siteUrl('/competition/practice/')},openGraph:{title:buildSeoTitle('Free Timed MCQ Practice Lab'),description:'Practise ten computing MCQs without an account. Build confidence with timed questions before joining the weekly ranked competition.',url:siteUrl('/competition/practice/'),type:'website'},twitter:{card:'summary',title:buildSeoTitle('Free Timed MCQ Practice Lab'),description:'Practise ten computing MCQs without an account. Build confidence with timed questions before joining the weekly ranked competition.'},robots:{index:false,follow:true}};
export default function Page(){return <div className="academic-page"><Header/><main id="main-content" tabIndex={-1}><CompetitionArena entry="practice"/></main><Footer/></div>;}
