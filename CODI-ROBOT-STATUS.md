# Codi robot tutor: local preview

## Click-to-read regression fixes (21 October 2026)

### Everyday Urdu and latency update

- Active Codi language choices are English and Urdu (`ur`), not Hindi.
  Urdu uses everyday Pakistani phrasing, avoiding difficult literary Urdu and
  Sanskrit-heavy Hindi; code identifiers and common programming terms stay in
  English. Explanations use the same language policy. Transcripts use automatic
  text direction and the language preference lasts for the current browser tab.
- Urdu translation and audio generation share one Native Audio session instead
  of a separate text-translation call followed by TTS and quota recovery. Reading
  uses a zero thinking budget; explanations retain their reasoning settings.
- Warm Edge instances remember Google's TTS retry interval, so repeated reads
  do not repeatedly call a known rate-limited TTS endpoint. The bounded audio
  cache has a fresh version to avoid reusing old-language audio.
- Protected Urdu QA generated non-silent 24 kHz audio and an Urdu-script/English
  programming transcript. Latest measured full-generation time was 12,158 ms;
  this is one sample, not a guaranteed response time or a streaming-first-byte
  measurement. 27 focused Codi tests passed.

### Verified upstream quota diagnosis and Native Audio recovery

Protected QA using the deployed Supabase `GEMINI_API_KEY` received Google's
`GenerateRequestsPerDayPerProjectPerModel-FreeTier` violation for
`gemini-2.5-flash-tts`, limit 10, with a retry interval over 17 hours. This is
specific upstream evidence, not an inference from the old generic error or
proof that the user's AI Studio screenshot shows the same project/filter.

The same secret successfully generated Native Audio. Reading now falls back
from a TTS HTTP 429 to a one-use, source-locked Native Audio recitation session.
Protected QA produced 316,800 bytes of 24 kHz PCM, with the transcript exactly
matching the test passage. No billing, key rotation or private key exposure
was needed. Native Audio has its own availability and rate limits; the existing
English device fallback remains available if both Google paths fail.

Provider errors now distinguish daily limits, per-minute limits, key/model
access denial and unavailable models without exposing raw provider responses.
The browser accepts and caches WAV audio from either approved Google model.

- Granting consent now resumes the pending clicked text without a second click.
  Consent is retained only in the current tab's session storage; it never starts
  speech automatically on a new lesson. Turning it off removes that preference.
- Visible clicked text is treated as plain text. HTML tags, underscores and
  operators are not stripped as Markdown. Whole-lesson narration protects code
  blocks and inline code while removing prose markup.
- Settings show the exact selected text. The robot indicates preparation,
  reading or a browser requirement to press Play rather than appearing inert.
- 22 focused Codi tests passed. A real production CSS line reached Gemini and
  real HTMLAudioElement playback advanced, with no page errors. A separate local
  browser regression exercised prose and code clicks in all 24 published lessons
  using synthetic PCM transport responses (not 24 Gemini pronunciation tests).
- Cloud voice still has enforced shared quotas and can return quota/provider
  errors. Those are surfaced in settings; this is not unlimited speech.
- Post-release first-click testing returned a real Gemini HTTP 429. English
  reading therefore has a disclosed, switchable device-voice fallback and a
  one-minute provider cooldown; Hindi is never silently read as untranslated
  English. Unit coverage exercises failure, cooldown and disabling fallback.
- Homepage now has public static course previews, working language tabs and
  lesson links, restrained motion, reduced-motion support and responsive themes.
  Five language tabs were checked at 360, 768 and 1366 px in light/dark modes,
  including keyboard navigation. Previews exclude questions and assignments.

The older local-neural implementation notes below are historical, not the
current cloud speech configuration.

## Guest cloud voice update

At the user's request Codi no longer requires sign-in. The voice client does
not initialize Firebase, wait for its auth state, fetch identity tokens or open
a Google login popup. Explicit voice-processing consent remains. Assignment
reviews, admin access and saved progress retain their existing authentication.

The server still holds the Gemini key and issues restricted short-lived Live
tokens. A random per-tab ID selects a best-effort browser quota bucket; it is
not authentication or an unforgeable identity. Atomic global SQL limits remain
the actual protection against unbounded public generation. A caller can rotate
browser IDs but cannot bypass the shared minute/day budgets. Free voice is not
unlimited and its public allowance can be exhausted by other visitors.

## Floating companion update (supersedes reserved top slots below)

Codi now renders as a transparent same-document body portal above regular site
layers. The lesson/compiler slots and their white reserved space are removed.
A small gear above the robot opens a theme-aware, viewport-clamped settings
panel. Escape, Close and outside pointer clicks dismiss it; focus returns to
the gear on keyboard dismissal. The panel is not a separate browser window.

The robot itself supports mouse, pen and touch dragging with pointer capture.
A five-pixel movement threshold distinguishes reading clicks from drags. Drag
movement updates a DOM transform through refs, not React state per pointer frame.
Placement is clamped after dragging, pointer cancellation, keyboard moves and
viewport resizing. Arrow keys move the focused robot without extra drag buttons.
Manual placement persists for the mounted lesson and is not reset by reading a
line. Running a compiler example still overrides it and flies to the compiler's
top anchor. Reduced motion skips the flight. No position is sent to the backend.

The focused suite now has 21 passing tests, including actual React pointer
events, drag-click suppression, free placement, compiler flight after dragging,
settings Escape/outside dismissal and geometry across mobile/desktop viewports.
This is code-based verification; no PC-control skill or heavy production build
is needed for the local preview refresh.

## October 21 cloud-voice update (supersedes local-voice notes below)

- Gemini Live model: `gemini-2.5-flash-native-audio-preview-12-2025`.
- Fixed reading: `gemini-2.5-flash-preview-tts`, with a bounded 24-entry browser
  WAV cache. Hindi is translated by Gemini 2.5 Flash first, then recited by TTS.
- No Kokoro, OPUS or ephone download/inference in the current reader. Their
  build preparation is now opt-in, not performed during every dev/test/build.
- Inline consent, language, Stop and autoplay recovery controls replace the
  popup. Device English voice remains available to guests. Google sign-in is
  available in Codi's controls. Cloud voice requires Firebase identity/consent.
- Lesson and compiler have dedicated top slots. Robot width is 104px on desktop
  and 72px on mobile, rather than covering lesson text from its old bottom dock.
- Live sessions use single-use five-minute, model/source/config-constrained
  ephemeral tokens. Permanent Gemini key stays in the Supabase secret vault.
- New `codi-voice` Edge Function and independent owner/server-only quota RPC are
  deployed. `CODI_CLOUD_ENABLED=false` disables cloud generation server-side.
- Real remote probes passed: English TTS PCM, Hindi translated TTS PCM and Live
  audio with an appropriate variable explanation transcript. Restricted tokens
  were also tested after adding explicit field locks.
- Real Firebase temporary-student endpoint checks passed: reading, restricted
  token issuance, allowed preview CORS, guest denial and foreign-origin denial.
  The synthetic student account and temporary protected QA deployment were
  removed after testing. No real student's content was modified.
- Quota SQL assertions ran in a rolled-back transaction; anon/authenticated
  direct execution is denied and RLS is enabled.
- Focused automated suite: 20 tests, including React interactions and streaming
  PCM, transcript, cache bounds, cancellation and stale responses. Strict
  TypeScript no-emit/no-unused checks passed before the final documentation edit.
- Frontend preview remains `http://127.0.0.1:4178/`. The production Firebase
  frontend was NOT rebuilt or deployed in this update. Backend is deployed.

Limitations: this is not unlimited free voice. Current app safety limits are two
new generation requests/minute per mode globally, 100 reading requests/day
globally (40/student) and 20 Live sessions/day globally (3/student). Provider
limits can be lower. A long reading can reach an allowance and must stop with
an honest message; device English voice avoids our Gemini quota. The browser
audio cache is not a shared Firebase static-audio library. Audio response probes
verify non-empty playable PCM, not a human listening/pronunciation assessment.
Free-tier Google processing may use submitted lesson excerpts for product
improvement, as disclosed before consent and in the privacy policy. No paid
model fallback is implemented; actual account billing must still be controlled
in Google's project settings. No final visual QA or full production build was
run on this memory-constrained machine in this update.

## Previous local implementation record

The user specified a blue 3D robot, not an animal. The old fox component was
replaced with procedural Three.js geometry. No robot-model or texture download
is required. Speech-worker source publication was explicitly approved.

Implemented locally:

- Seated blue robot with eyes, idle blinking and animated speaking mouth.
- Lesson-side docking; Run signals from the actual browser practice component
  trigger a curved flight to the compiler pane. Selecting lesson text returns
  Codi to the lesson pane. Resizing cannot restart an already-running flight.
- Clicking a line queues that line. Clicking Codi queues the complete lesson,
  including its final paragraph, as bounded speech requests without truncation.
- Highlighting text searches the static published-language lesson index and
  displays the actual source section. Earlier and upcoming sources are labelled
  and linked; unavailable matches are reported instead of invented.
- Explanations use no database requests and disclose no assessment answers or
  private drafts. Language indexes regenerate with the normal static catalog.
- English/Hindi controls retain the existing locally executed neural voice
  worker, explicit download consent, autoplay recovery and cancellation.
- Reduced-motion support and cleanup of WebGL resources/observers/animations.

Lightweight evidence:

- 10 targeted tests passed, with a 256 MB JavaScript heap setting and sequential
  test execution. These cover queue continuation, cancellation, stale replies,
  source retrieval, idle blink/speaking/reduced-motion poses, visual-line
  extraction, PCM validation and viewport bounds.
- Local preview: http://127.0.0.1:4178/ . It uses an actual published HTML lesson
  and the actual HTML practice component. No Next production build or automatic
  speech-model inference is running for this preview.
- The first visual check found a missing standalone-preview environment define;
  it was corrected and the preview server rebuilt/restarted.
- A subsequent headless visual check was deliberately skipped by its free-memory
  guard. Therefore the final visual interaction result is not yet verified.

Not yet claimed:

- No production build/deployment of these new robot interactions in this turn.
- No final rendered approval, complete regression run or fresh neural inference
  for the expanded whole-lesson/explanation interactions.
- Explanation retrieval is grounded keyword/section matching, not guaranteed
  semantic understanding of every possible highlighted sentence.

Avoid parallel builds, browser tests and ML inference on this user's machine.
Run only one resource-bounded check at a time, and keep the preview available
for the user to inspect the robot before another production build.
