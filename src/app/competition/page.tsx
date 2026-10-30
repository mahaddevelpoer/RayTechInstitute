import {DEFAULT_SOCIAL_IMAGE} from '@/data/social';
import type {Metadata} from 'next';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {CompetitionDirectory} from '@/components/competition/CompetitionDirectory';
import {siteUrl} from '@/lib/site';
import {buildSeoTitle} from '@/utils/seo';
import './competition.css';
export const metadata:Metadata={title:buildSeoTitle('Weekly MCQ Challenges and Free Practice'),description:'Choose a weekly ranked MCQ challenge or practise freely. Learn the rules, explore the leaderboard and share your RayTech Institute result.',alternates:{canonical:siteUrl('/competition/')},openGraph:{images:[DEFAULT_SOCIAL_IMAGE],title:buildSeoTitle('Weekly MCQ Challenges and Free Practice'),description:'Choose a weekly ranked MCQ challenge or practise freely. Learn the rules, explore the leaderboard and share your RayTech Institute result.',url:siteUrl('/competition/'),type:'website'},twitter:{card:'summary_large_image',images:[DEFAULT_SOCIAL_IMAGE.url],title:buildSeoTitle('Weekly MCQ Challenges and Free Practice'),description:'Choose a weekly ranked MCQ challenge or practise freely. Learn the rules, explore the leaderboard and share your RayTech Institute result.'},robots:{index:true,follow:true}};
export default function Page(){return <div className="academic-page"><Header/><main id="main-content" tabIndex={-1}><CompetitionDirectory view="home"/></main><Footer/></div>;}
