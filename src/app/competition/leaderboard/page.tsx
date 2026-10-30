import type {Metadata} from 'next';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {CompetitionDirectory} from '@/components/competition/CompetitionDirectory';
import {siteUrl} from '@/lib/site';
import {buildSeoTitle} from '@/utils/seo';
import '../competition.css';
export const metadata:Metadata={title:buildSeoTitle('Weekly Student Competition Leaderboard'),description:'Explore the RayTech weekly MCQ leaderboard, compare verified scores and understand shared ranks before entering your own challenge.',alternates:{canonical:siteUrl('/competition/leaderboard/')},openGraph:{title:buildSeoTitle('Weekly Student Competition Leaderboard'),description:'Explore the RayTech weekly MCQ leaderboard, compare verified scores and understand shared ranks before entering your own challenge.',url:siteUrl('/competition/leaderboard/'),type:'website'},twitter:{card:'summary',title:buildSeoTitle('Weekly Student Competition Leaderboard'),description:'Explore the RayTech weekly MCQ leaderboard, compare verified scores and understand shared ranks before entering your own challenge.'},robots:{index:false,follow:true}};
export default function Page(){return <div className="academic-page"><Header/><main id="main-content" tabIndex={-1}><CompetitionDirectory view="leaderboard"/></main><Footer/></div>;}
