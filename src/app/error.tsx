'use client';
import Link from 'next/link';
export default function PublicError({reset}:{error:Error&{digest?:string};reset:()=>void}){
 return <main id="main-content" className="page-main" role="alert"><div className="directory-empty"><h1 className="mb-4 text-2xl font-bold">This page could not finish loading</h1><p>Your saved work has not been changed. Try the page again, or return to the resource directory.</p><div className="flex flex-wrap gap-3"><button className="learn-button" onClick={reset}>Try again</button><Link className="learn-button" href="/classes/">Study resources</Link><Link className="learn-button" href="/courses/">Programming courses</Link></div></div></main>;
}
