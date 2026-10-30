import {DEFAULT_SOCIAL_IMAGE} from '@/data/social';
import type {Metadata} from 'next';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {CompetitionDirectory} from '@/components/competition/CompetitionDirectory';
import {siteUrl} from '@/lib/site';
import {buildSeoTitle} from '@/utils/seo';
import '../competition.css';
export const metadata:Metadata={title:buildSeoTitle('Weekly MCQ Competition Rules and Scoring'),description:'Read the RayTech competition rules for Google sign-in, question timers, weekly eligibility, equal-score rankings and interrupted attempts.',alternates:{canonical:siteUrl('/competition/rules/')},openGraph:{images:[DEFAULT_SOCIAL_IMAGE],title:buildSeoTitle('Weekly MCQ Competition Rules and Scoring'),description:'Read the RayTech competition rules for Google sign-in, question timers, weekly eligibility, equal-score rankings and interrupted attempts.',url:siteUrl('/competition/rules/'),type:'website'},twitter:{card:'summary_large_image',images:[DEFAULT_SOCIAL_IMAGE.url],title:buildSeoTitle('Weekly MCQ Competition Rules and Scoring'),description:'Read the RayTech competition rules for Google sign-in, question timers, weekly eligibility, equal-score rankings and interrupted attempts.'},robots:{index:true,follow:true}};
export default function Page(){return <div className="academic-page"><Header/><main id="main-content" tabIndex={-1}><CompetitionDirectory view="rules"/></main><Footer/></div>;}
