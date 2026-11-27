"use client";
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {mountPreferredSource} from '@/utils/preferred-source';

export function GooglePreferredSource() {
  const pathname=usePathname();
  useEffect(()=>{
    const refresh=()=>mountPreferredSource(document, window.location.pathname);
    refresh();
    // A later robots update must remove the widget before it remains on a noindex page.
    const observer=new MutationObserver(records=>{
      if(records.some(record=>record.target instanceof HTMLMetaElement || [...Array.from(record.addedNodes), ...Array.from(record.removedNodes)].some(node=>node instanceof HTMLMetaElement))) refresh();
    });
    observer.observe(document.head,{childList:true,subtree:true,attributes:true,attributeFilter:['content','name']});
    // Keep the container across Strict Mode's effect replay; the next document owns cleanup.
    return ()=>observer.disconnect();
  },[pathname]);
  return null;
}
