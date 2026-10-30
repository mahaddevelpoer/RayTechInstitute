# Weekly competition implementation

Local-only work authorised on 28 October 2026. Do not push, deploy, apply remote migrations, change remote secrets or enable billing until the user approves publication.

Design read: an educational quiz arena for students, with playful blue, sunshine yellow and coral accents, a large leader spotlight, quiet timed questions and celebratory results. Existing React, Tailwind 3, Lucide and Framer Motion remain the foundation. Design variance 7, motion intensity 7 outside the test and 2 during questions, visual density 4. Sound defaults off; reduced motion disables decorative movement.

## Rules

- Google sign-in before a ranked attempt. Display name is chosen by the student; Google profile photo is opt-in. No camera or microphone.
- One ranked attempt per Firebase UID per Pakistan calendar week, across competitions. Concurrent starts cannot create extra attempts. Interrupted attempts resume without resetting the issued question deadline.
- Twenty questions: six easy, ten medium and four difficult, with default deadlines of 15, 30 and 60 seconds. One server-issued question at a time; submitted questions cannot be changed.
- Private competition banks are separate from public practice. Browser payloads never include answers, unreleased questions, Firebase UIDs, IP hashes or service credentials.
- Marking, deadlines, score, weekly eligibility and rankings are authoritative on the backend. Equal scores share a rank; speed does not break ties.
- Guests use a different practice bank. No retroactive ranking; signing in afterwards requires a new ranked attempt.
- IP HMACs support rate limiting, not one-person identity. Shared networks are allowed. Visibility/focus events are review signals, not automatic cheating verdicts.
- Public results and leaderboard snapshots are cacheable; private attempts never are. One backend/database owns competition state. Firebase remains the identity provider.
- Turnstile is verified server-side for ranked starts. Production fails closed if required configuration is absent. Local QA identities and sample players must never work on the deployed handler.

## Completion checks

- [x] Private schema, service-only RPC and atomic weekly uniqueness.
- [x] Backend authentication, request limits, anti-replay, deadlines and score computation.
- [x] Responsive lobby, prominent leader, timed play, results, profile and share card.
- [x] Separate guest practice, sound toggle and reduced motion.
- [x] Admin round and private-bank preparation.
- [x] Lightweight persistent local preview, with explicit sample-data labels.
- [x] Concurrency, expiry, forged score, access control, privacy and browser tests.
- [x] Production setup checklist with missing external configuration; no deployment.

Limits: browser-only monitoring cannot prevent another phone, another Google account or outside assistance. No promise of cheat-proof operation or unlimited free traffic.

## Verified locally on 29 October 2026

- 15 competition backend tests pass against the actual SQL gateway, including concurrent starts, answer replay, deadline enforcement, private access controls, signed Google tokens, proxy rejection, Turnstile validation, closed-bank reuse prevention and manual review audit records.
- 14 related existing regression tests passed for admin identity/access, student identity, compiler isolation and credential-pattern detection.
- Full project TypeScript checks pass, including unused declarations. Dedicated strict checks for the Edge and Cloudflare Worker entry points pass. Source lint passes across 359 files.
- A full browser flow passes with one headless Edge: light/dark at 360, 768 and 1366 widths, no horizontal overflow, AA main-button contrast, reduced motion, refresh/resume without timer reset, failed-network recovery, twenty correct ranked answers, rank #1, repeat-attempt restriction, opt-in sound, confetti, downloadable 1200x800 result card and unranked guest practice without private POSTs.
- Desktop and mobile lobby/question/result screenshots were visually inspected. Sample identities and standings remain clearly labelled in the isolated preview.

## Still required before release

- [ ] Approved production migration, Edge Function and Cloudflare Worker setup.
- [ ] Real Google login/admin and Turnstile end-to-end checks on the final domain.
- [ ] Original reviewed private competition bank; QA sample questions are not a live bank.
- [ ] Production static export, deployed integration verification and traffic checks.
- [ ] Explicit approval to deploy this batch.

Detailed operator instructions and free-quota limitations are in `COMPETITION-SETUP.md`. No competition changes have been pushed or deployed. No billing or remote credentials were changed.

## Arcade presentation update, 29 October 2026

User approved a complete game-style redesign of this route. The competition is now a self-contained charcoal arcade with blue, coral/orange and gold accents. Page-scoped pointer changes and stronger decorative animation are intentional user-approved overrides of the general site's conservative styling rules.

- [x] Rebuilt responsive stage, dimensional trophy, floating game chips, moving particles and winner spotlight.
- [x] Native modal entry sheet with animated blurred backdrop, focus containment, Escape support and restored page scrolling.
- [x] Separate saved music/effects toggles and volume sliders. Original procedural instrumental loop; no downloaded tracks, extra provider or licence-dependent samples.
- [x] Music softens during questions and pauses with the hidden tab. Distinct click, select, lock, start, timer and victory cues. Sound starts after user interaction.
- [x] Page-scoped pointer light, click particles and tactile button/card transitions. Reduced-motion and reduced-transparency fallbacks.
- [x] Animated result count, medal reveal, confetti and redesigned downloadable achievement card.
- [x] Project typecheck and lint pass. Full browser flow passes, including real audio-note scheduling, stopping music, saved volume settings, entry-dialog blur/Escape and a distinct victory cue. Mobile/desktop screenshots and the exported 1200x800 card were visually reviewed.

No new production deployment or remote writes were performed for this visual update.

## Stadium revision

The isolated preview now renders the real site Header and Footer with the site stylesheet and local public assets. Existing exported pages are available for navigation. Removed the duplicate game brand/navigation and the crosshair cursor. Reworked the competition into a bright cream/coral/blue stadium presentation. Increased the previously very quiet audio mix. Added an actual Web Audio analyser test: music peak 0.3876, effects peak 0.0692, muted peak 0; no browser errors. This verifies the browser's audio signal, not the operating system speaker/mute configuration. The complete quiz, responsive layout, modal and audio-control browser suite also passes on this revision. No deployment.

## Separate competition destinations — local revision
- Added six real routes: challenge centre, ranked entry/play, guest practice, leaderboard, results and rules. Each has its own purpose and metadata. Kept shared site Header/Footer.
- Replaced check-in dialog with a full page, removed pointer/particle component and unused dialog implementation. New mode cards, standings podium/table and rules guide use fixed layouts.
- Result links and downloadable cards now target the results route; legacy result URLs redirect locally in the client. Practice result storage cannot supply a public rank or review flag.
- Verified all six routes at 360/768/1366 widths without horizontal overflow, one H1 and active navigation. Verified complete ranked and guest flows, resume without extending deadline, failed-answer recovery, private answer omission, weekly duplicate prevention, and 1200x800 PNG download.
- Measured Web Audio signal: music peak 0.228, effects 0.069, mute 0. Browser hardware speaker output was not checked.
- Strict TypeScript passed. Local only; no publication, production database writes or deployment. Existing pre-launch noindex remains.

## Play screen redesign
- Rebuilt ranked check-in as a challenge ticket alongside player setup, rather than the old centred dark panel.
- Rebuilt actual questions as a match board: coloured answer tiles, question timer, player sidebar and completed/current question track. Mobile uses stacked answer tiles and a compact track below the question.
- Kept shared header/footer, scoring, deadlines, identity and answer locking unchanged.
- TypeScript and source lint passed. Browser suite passed six routes, responsive widths, ranked completion/resume/network recovery, one weekly attempt, result download and guest practice.
- Fixed inherited CTA text colour after visual review. Not deployed.

## Result report and feedback refinement
- Replaced the centred dark result screen with an achievement report: identity, correct-answer count, accuracy, rank status, next-step panel and optional sharing strip. Updated the 1200x800 share card to match.
- Shared feedback policy: below 50 percent supportive practice guidance; 50-79 percent improvement guidance; 80 percent and above celebration. Under-review results never celebrate. These are presentation thresholds, not changes to scoring or ranking.
- Low scores have no confetti, trophy or victory cue. Practice results never gain a public rank.
- Refined practice launch, rules sections, leaderboard rows and CTA layouts.
- Verified feedback boundaries 0/40/50/70/80/100 percent, review suppression, reduced motion and 360/768/1366 layouts; downloaded low-score share card. Full ranked/practice regression, TypeScript and 369-file lint passed. Local only.

## Manual authoring, schedule and notification batch (local only)
- Admin can type questions/options, select the correct answer/topic/difficulty, remove a question, or import a manually reviewed JSON bank. No AI generation path exists for the competition bank.
- Admin chooses start/close/result dates and times in Pakistan time, plus easy/medium/hard question durations. Service validates ordering and a maximum 31-day round. Weekly account limit remains.
- Public countdown displays the result announcement in PKT. Public leaderboard and per-result rank are withheld server-side until announcement; own score can still be viewed.
- Added indexable /email-preferences/ page, footer link and opt-in winner notifications. Preference changes require Google verification; an emailed capability link permits confirmed unsubscribe without login. No one is subscribed automatically.
- Prepared private notification tables/RPC, protected job endpoint, escaped HTML/text winner template, tied-winner selection, sent ledger and Resend idempotency. Worker maintenance precedes mail dispatch every five minutes.
- Verified 15 competition backend tests, 3 schedule/notification/template tests, Edge/Worker strict typing, project TypeScript and manual-authoring/countdown/preferences browser checks. No live sender test or emails sent.
- Still requires approved migration/function/Worker deployment, a verified COMPETITION_EMAIL_FROM sender and notification job secrets. Existing Supabase Resend secret has not been fetched or changed. Public indexing follows a later deployment; Google indexing is not guaranteed.

Winner email QA: Resend rejected the results subdomain as unverified for the configured key. Root-domain notifications@raytechinstitute.com accepted the single requested sample email to mahadb847@gmail.com (provider id 01a18b4d-8a8b-7c19-8599-c3bd8d187672). Temporary protected mail-test function was deleted afterwards. Acceptance is not proof of inbox delivery. Default sender updated to the root domain. Google identity supplies verified email; optional winner-email consent remains required.
