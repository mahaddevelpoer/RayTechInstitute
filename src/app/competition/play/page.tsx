import type {Metadata} from 'next';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {CompetitionArena} from '@/components/competition/CompetitionArena';
import {siteUrl} from '@/lib/site';
import {buildSeoTitle} from '@/utils/seo';
import '../competition.css';
export const metadata:Metadata={title:buildSeoTitle('Enter the Weekly MCQ Challenge'),description:'Sign in with Google, choose your display name and enter the RayTech weekly timed MCQ challenge with one ranked attempt per week.',alternates:{canonical:siteUrl('/competition/play/')},openGraph:{title:buildSeoTitle('Enter the Weekly MCQ Challenge'),description:'Sign in with Google, choose your display name and enter the RayTech weekly timed MCQ challenge with one ranked attempt per week.',url:siteUrl('/competition/play/'),type:'website'},twitter:{card:'summary',title:buildSeoTitle('Enter the Weekly MCQ Challenge'),description:'Sign in with Google, choose your display name and enter the RayTech weekly timed MCQ challenge with one ranked attempt per week.'},robots:{index:false,follow:true}};
export default function Page(){return <div className="academic-page"><Header/><main id="main-content" tabIndex={-1}><CompetitionArena entry="ranked"/></main><Footer/></div>;}
