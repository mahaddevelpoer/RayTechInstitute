# Domain and Search Console checklist

The owner confirmed on 26 October 2026 that raytechinstitute.com has not yet been purchased and Search Console will be configured afterward. These tasks remain pending. No DNS, Firebase domain settings or Google account state were changed.

- [ ] Buy the domain and preserve any existing email/DNS records.
- [ ] Add the domain in the Firebase Hosting custom-domain wizard and use the exact ownership and DNS records it supplies.
- [ ] Wait for the HTTPS certificate to become active and confirm the real pages work on the domain.
- [ ] Choose the preferred host, including the www decision, and configure a direct permanent redirect from alternate hosts.
- [ ] Only then set NEXT_PUBLIC_SITE_URL to the preferred HTTPS origin. The local validator now rejects HTTP, credentials, paths, queries and fragments.
- [ ] Check Firebase Auth authorized domains and the existing Edge allowed origins against the actual chosen host.
- [ ] Add a Domain property in Google Search Console and use Google's actual DNS verification value. Alternatively, a URL-prefix property can use an HTML verification tag.
- [ ] For the HTML method only, set GOOGLE_SITE_VERIFICATION to Google's public HTML token in the approved build configuration. A blank token produces no fabricated verification tag.
- [ ] After an explicitly approved release, confirm canonical URLs, Open Graph URLs, robots.txt and sitemap.xml all use the preferred origin.
- [ ] Submit the actual sitemap URL in Search Console and inspect representative course, lesson, subject, note and result URLs.
- [ ] Review Search Console indexing, links and Core Web Vitals after Google has collected data. Ownership verification, indexing and good field performance are separate outcomes.

No deployment is authorized by completing this checklist. Do not switch canonical hosts to a domain that does not yet serve the website.

References:

- https://developers.google.com/search/docs/monitor-debug/search-console-start
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://web.dev/articles/vitals
