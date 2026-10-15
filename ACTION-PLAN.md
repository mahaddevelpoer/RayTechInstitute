# Action Plan: Prioritized Optimization & Roadmap

**Platform**: RayTech Institute Educational Portal  
**Document**: Continuous Maintenance and Scalability Action Plan  
**Date**: October 10, 2026  

---

## 1. Action Items by Priority and Impact

### Immediate / Completed (Priority P0 - High Impact, Zero Effort Remaining)
- [x] **Full Static Export Build**: All 48 pages generated with Next.js SSG (`npm run build` exits 0).
- [x] **Schema Validation**: Automated validation via `validate_schema.py` passed with 0 errors across 48 pages.
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
   - Submit `https://raytechinstitute.firebaseapp.com/sitemap.xml` directly to Google Search Console to expedite full indexing of the 48 prerendered pages.
