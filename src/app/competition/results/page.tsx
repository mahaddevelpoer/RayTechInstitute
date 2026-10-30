import type {Metadata} from 'next';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {CompetitionArena} from '@/components/competition/CompetitionArena';
import {siteUrl} from '@/lib/site';
import {buildSeoTitle} from '@/utils/seo';
import '../competition.css';
export const metadata:Metadata={title:buildSeoTitle('View and Share Your MCQ Competition Result'),description:'View a verified RayTech competition result, check the current rank and download a score card to share with friends.',alternates:{canonical:siteUrl('/competition/results/')},openGraph:{title:buildSeoTitle('View and Share Your MCQ Competition Result'),description:'View a verified RayTech competition result, check the current rank and download a score card to share with friends.',url:siteUrl('/competition/results/'),type:'website'},twitter:{card:'summary',title:buildSeoTitle('View and Share Your MCQ Competition Result'),description:'View a verified RayTech competition result, check the current rank and download a score card to share with friends.'},robots:{index:false,follow:true}};
export default function Page(){return <div className="academic-page"><Header/><main id="main-content" tabIndex={-1}><CompetitionArena entry="results"/></main><Footer/></div>;}
