# Action Plan: Prioritized Optimization & Roadmap

**Platform**: RayTech Institute Educational Portal  
**Document**: Continuous Maintenance and Scalability Action Plan  
**Date**: October 15, 2026

---

## 1. Action Items by Priority and Impact

### Current Verification Gates
- [x] **Static SEO regression gate**: `npm run audit:seo` checks every generated public HTML page for title, description, canonical, JSON-LD and exactly one H1.
- [x] **Admin action authorization**: Browser-triggered AI, mutation, rebuild and broadcast actions require a verified Firebase ID token in the Edge Function.
- [x] **Compiler interaction quality**: Python compiler is resizable, viewport constrained, draggable and keyboard-friendly while remaining excluded from blogs and admin.
- [x] **AI response acceptance**: MCQs are schema-validated and article, gazette and notes content must meet minimum word thresholds before the admin UI receives it.
- [x] **Inline JSON-LD XSS hardening**: Structured-data strings are escaped before being inserted into inline script elements.

### Verification Still Requiring External Evidence
- [ ] Run Lighthouse or PageSpeed against the live Firebase domain and record LCP, CLS and INP. Source inspection cannot prove Core Web Vitals.
- [ ] Submit the current sitemap in Google Search Console and review coverage, canonical selection and rich-result warnings.
- [ ] Configure `ADMIN_EMAILS` in Supabase Secrets with the exact verified administrator email(s). When configured, the Edge Function enforces the allowlist in addition to Firebase token verification.
- [ ] Configure the alternate `firebaseapp.com` Firebase host redirect/exclusion in Firebase Hosting/Console and submit only `https://raytechinstitute.web.app/sitemap.xml` to Search Console. Code-level canonicals now use the Firebase CLI default `web.app` host.
- [ ] Re-run Seobility's full website audit after the host redirect is active; review its duplicate-heading, internal-anchor, backlink and social-sharing findings separately from the static HTML gate.

### Immediate / Completed (Priority P0 - High Impact, Zero Effort Remaining)
- [x] **Full Static Export Build**: All 61 pages generated with Next.js SSG (`npm run build` exits 0).
- [ ] **Rich-result schema validation**: Run Google's Rich Results Test and Search Console enhancements report against the deployed canonical host; the repository gate currently checks JSON-LD presence, not search-engine eligibility.
- [x] **Canonical Tags & Title Format**: Self-referential absolute URLs and 50–60 character titles implemented across all indexable pages.
- [x] **Credential Isolation**: Supabase project credentials and private variables moved to `.env.local` and `.gitignore` verified.
- [x] **Compiler Exclusion**: In-browser Python compiler unmounted on `/blogs/*` and `/admin/*`.
- [x] **Brand Compliance**: Removed purple gradients, pill buttons, em dashes, emojis, and fake reviews.

---

### Ongoing Content Management (Priority P1 - High Impact, Low Effort)
1. **Dynamic Gazette Additions via Admin Panel**:
   - Access `/admin/gazettes` to publish new annual and supplementary result gazettes as Punjab examination boards release them.
   - Maintain accurate direct result check URLs and PDF download mirrors.
2. **MCQs Question Bank Expansion**:
   - Add additional topic-specific questions in `/admin/mcqs` for Physics, Mathematics, and Computer Science to expand practice breadth.
3. **Blog & Date Sheet Updates**:
   - Publish upcoming date sheets for 11th and 12th annual exams in `/admin/blogs` under the `date-sheets` category.

---

### Infrastructure & Deployment (Priority P2 - Medium Impact, Low Effort)
1. **Firebase / Vercel Static Hosting Deployment**:
   - Deploy the generated `out/` directory using `firebase deploy --only hosting` or git repository linkage.
   - Zero-server guarantee remains preserved with zero monthly compute costs.
2. **Supabase Realtime Sync (Optional Expansion)**:
   - Client store is currently pre-seeded and cached in browser storage with instant fallback. If multi-device synchronization is desired, Supabase table listener hooks can be enabled with the stored credentials.
3. **Search Console & Sitemaps**:
   - Submit `https://raytechinstitute.web.app/sitemap.xml` directly to Google Search Console, then review coverage and canonical selection for the 61 prerendered pages.
