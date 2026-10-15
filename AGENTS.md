# Project Rules: Mandatory Standards, Security Hardening & Agentic SEO

These rules are the **ABSOLUTE TOP PRIORITY** across the entire workspace. Every component, page, script, style, and metadata must strictly adhere to these mandates with ZERO exceptions.

---

## 1. Top Mandate: 100% Agentic SEO Excellence (Highest Priority)
- **Agentic SEO Skill Integration**: Refer to the installed `seo` skill (`skills/seo/SKILL.md`) for all schemas, audits, technical checks, and Core Web Vitals.
- **Interactivity Metric is INP, Never FID**: Target INP ≤ 200ms. FID was permanently deleted by Google in Sept 2024. NEVER reference FID in audits, code, or docs.
- **LCP & CLS Targets**: LCP ≤ 2.5s (hero text/images eager with priority). CLS ≤ 0.1 (explicit width, height, or aspect-ratio on all images, PDFs, modals).
- **Schema.org Structured Data (JSON-LD Only)**:
  - Format must ALWAYS be `<script type="application/ld+json">`. Never use Microdata or RDFa.
  - **HowTo schema is deprecated**: Rich results removed Sept 2023. Never use HowTo.
  - **FAQPage schema is restricted**: Strictly restricted to government and health authorities. NEVER use FAQPage.
  - Standard schemas: `WebSite` (with `SearchAction`), `Organization`, `ProfilePage`, `BreadcrumbList`, `LearningResource` / `Article`, `Quiz` / `Question`, `Dataset` (for Gazettes), `BlogPosting`.
- **On-Page Standards**:
  - Unique Title tags: 50–60 characters (≤ 600px). Format: `Primary Keyword - Value / Topic | Brand`.
  - Unique Meta descriptions: 120–155 characters. Active voice with clear intent.
  - Exactly one `<h1>` per page reflecting the core topic. Strict nesting (`<h1>` → `<h2>` → `<h3>`).
  - Canonical URLs: Self-referential absolute `<link rel="canonical" href="..." />` on every indexable page.
- **Mobile-First Indexing**: 100% responsive, readable viewports, touch targets ≥ 48×48px.
- **Universal E-E-A-T**: Author attributions, verifiable credentials, privacy policy, terms & conditions, real entity signals.
- **Generative Engine Optimization (GEO & AEO)**: Direct 40–60 word answer summaries immediately following question headings for Google AI Overviews, Perplexity, ChatGPT, Claude, and Gemini.

---

## 2. Design & Brand Aesthetics (Anti-Vibe-Product, Serious Academic Authority)
- 🚫 **NO Purple Gradients**: Strictly forbidden. Use clean, high-trust educational palettes: Deep Navy (`#0F172A`, `#1E293B`), Slate, Crisp Academic Emerald/Teal, Pure White, and refined borders.
- 🚫 **NO Pill-Shaped Buttons**: Do not use `rounded-full` for main CTA buttons. Use clean, professional `rounded-md` or `rounded-lg`.
- 🚫 **NO Fake Reviews or Fake Metrics**: Zero fake stars, zero inflated "100M+ users" claims. Only authentic, verifiable information.
- 🚫 **NO Vague Hero Copy**: Eliminate generic marketing fluff (e.g. "Unlock your infinite potential"). Use direct, grounded academic copy (e.g. "11th & 12th Class Study Resources, Past Papers, MCQs & Gazettes").
- 🚫 **NO Emoji Icons**: Do not use emojis (🚀, 🔥, 💡, ✨) as UI icons. Use clean, high-precision SVG icons (Lucide-React / FontAwesome academic icons).
- 🚫 **NO Em Dashes**: Never use em dashes (`—`) in copy or documentation. Use standard punctuation, hyphens, or colons.
- 🚫 **NO Over-The-Top Scroll Animations**: No jarring scroll-jacking or laggy parallax. Keep interactions snappy, fast, and lightweight.
- 🚫 **NO AI-Slop Photos or AI-Slop Copy**: Use real textbook covers, official board representations, structured tables, and authentic academic text.
- 🚫 **NO Custom Cursor Animations**: Standard system responsive cursors only.
- 🚫 **NO "Made with AI" Tags**: Completely omitted.
- ✅ **Mandatory Legal Pages**: Privacy Policy (`/privacy-policy`) and Terms & Conditions (`/terms-and-conditions`).
- ✅ **Connected Custom Domain & Favicon**: Crisp SVG/PNG favicon and custom domain readiness.

---

## 3. VIP-Coded Security & Hardening (Zero-Hack Defense)
- **Hide & Sanitize API Keys**:
  - Never expose private keys or service account credentials in client code.
  - Check all environment variables. Only non-sensitive public configuration allowed client-side.
- **Protect Admin Routes**:
  - Strict authentication barrier on `/admin/*`. Unauthorized requests are redirected to `/admin/login`.
  - Secure session token management with cryptographic validation.
  - Role-based authorization: Students cannot execute or trigger administrative actions.
- **Form Sanitization & Anti-XSS**:
  - Sanitize all text inputs before rendering or storing. Prevent HTML injection, `<script>` tags, and XSS attacks.
- **Brute-Force & Rate Limiting**:
  - Implement lockout delays on failed admin login attempts to prevent automated brute-force attacks.
- **Security Headers**:
  - Configure robust headers in `firebase.json` and server configs:
    - `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
    - `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- **Turn Off Debug Mode**:
  - No detailed error stack traces or environment dumps exposed in client console or production screens.
- **Secure Password Hashing**:
  - Admin passwords must be securely hashed with dynamic cryptographic salt (PBKDF2 / SHA-256 with salt).
- **Check Exposed Files & Git Leaks**:
  - Ensure `.env`, `.env.local`, `.git`, and private backups are strictly excluded from production build and export directories (`out/`).
- **Make No Mistakes**: Zero TypeScript errors, zero hydration errors, zero broken links.

---

## 4. Platform Architecture & Feature Rules
1. **Python Compiler Exclusivity**:
   - Built on in-browser **Pyodide WebAssembly** (100% Free, zero server compute).
   - Minimizable and draggable modal interface with edge-docked launch icon.
   - Mounted on: `/classes/*`, `/mcqs/*`, `/notes/*`, `/past-papers/*`, `/practice/*`.
   - **STRICTLY EXCLUDED & UNMOUNTED on `/blogs/*`, `/updates/*`, and `/admin/*`**.
2. **Zero-Server Guarantee**:
   - No external PHP server or paid hosting required.
   - Runs static & client-resilient on Firebase / Vercel with zero monthly compute costs.
3. **Results & Gazettes (High Priority Asset)**:
   - High-performance portal for all Punjab Boards (BISE Lahore, Gujranwala, Rawalpindi, Multan, Faisalabad, Sahiwal, Bahawalpur, DG Khan) & Federal Board (FBISE).
   - Direct PDF preview, download mirrors, and official roll number lookup links.

---

## 5. Audit Deliverables Contract
Whenever performing an SEO audit:
- Generate `FULL-AUDIT-REPORT.md` (detailed findings with evidence and confidence levels: Confirmed / Likely / Hypothesis).
- Generate `ACTION-PLAN.md` (prioritized fixes by impact and effort).
