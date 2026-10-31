import type {Metadata} from 'next';
import {Header} from '@/components/Header';import {Footer} from '@/components/Footer';import {EmailPreferences} from '@/components/competition/EmailPreferences';import {siteUrl} from '@/lib/site';
export const metadata:Metadata={title:'Email Notification Preferences | RayTech Institute',description:'Manage your RayTech Institute competition winner emails. Choose to receive optional notifications or unsubscribe from your email preferences.',alternates:{canonical:siteUrl('/email-preferences/')},robots:{index:false,follow:true}};
export default function Page(){return <><Header/><main id="main-content"><EmailPreferences/></main><Footer/></>;}
