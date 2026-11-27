'use client';

import React, {forwardRef} from 'react';
import type {AnchorHTMLAttributes} from 'react';
import type {LinkProps} from 'next/link';
import {formatUrl} from 'next/dist/shared/lib/router/utils/format-url';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>,keyof LinkProps> & LinkProps;

/** Build-time next/link replacement for this HTML-only static deployment. */
const StaticLink=forwardRef<HTMLAnchorElement,Props>(function StaticLink({
 href,as,replace:_replace,scroll:_scroll,shallow:_shallow,passHref:_passHref,
 prefetch:_prefetch,legacyBehavior:_legacyBehavior,locale:_locale,onNavigate:_onNavigate,
 ...anchor
},ref){
 const target=as||href;
 return <a {...anchor} ref={ref} href={typeof target==='string'?target:formatUrl(target)}/>;
});

export default StaticLink;
