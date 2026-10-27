# Domain and Search Console checklist

Updated 27 October 2026. The domain was connected and the approved release was verified over HTTPS on 26 October. The owner has now confirmed that Search Console verification succeeded, the sitemap was fetched and 183 pages were discovered. Discovery is not confirmation that all those pages are indexed. The exact property type and private Search Console reports have not been independently inspected.

- [x] Buy the domain and preserve any existing email/DNS records.
- [x] Add the domain in the Firebase Hosting custom-domain wizard and use the exact ownership and DNS records it supplies.
- [x] Wait for the HTTPS certificate to become active and confirm the real pages work on the domain.
- [ ] Choose the preferred host, including the www decision, and configure a direct permanent redirect from alternate hosts.
- [x] Set NEXT_PUBLIC_SITE_URL to https://raytechinstitute.com in GitHub build variables. The local validator rejects HTTP, credentials, paths, queries and fragments.
- [x] Check Firebase Auth authorized domains and the existing Edge allowed origins against the actual chosen host.
- [x] Verify a Search Console property for the custom domain (owner confirmed). The property type and verification method have not been independently inspected.
- [ ] For the HTML method only, set GOOGLE_SITE_VERIFICATION to Google's public HTML token in the approved build configuration. A blank token produces no fabricated verification tag.
- [x] After the approved release, confirm canonical URLs, Open Graph URLs, robots.txt and sitemap.xml use the preferred origin.
- [x] Submit the actual sitemap URL in Search Console (owner confirmed successful fetch on 27 October).
- [ ] Inspect representative course, lesson, subject, note and result URLs in Search Console. Confirm the exact verified property type.
- [ ] Review Search Console indexing, links and Core Web Vitals after Google has collected data. Ownership verification, indexing and good field performance are separate outcomes.

No deployment is authorized by completing this checklist. Do not switch canonical hosts to a domain that does not yet serve the website.

References:

- https://developers.google.com/search/docs/monitor-debug/search-console-start
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://web.dev/articles/vitals
