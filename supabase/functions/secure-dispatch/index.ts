import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleLearningAdmin } from '../_shared/learning-admin.ts';
import { createLearningRepository } from '../_shared/learning-repository.ts';
import { generateNextLearningTopic } from '../_shared/learning-authoring.ts';
import { generateLearningWithFallback } from '../_shared/learning-provider.ts';
import { learningGenerationResponse } from '../_shared/learning-stream.ts';
import { createLearningAiSettings } from '../_shared/learning-ai-settings.ts';
import { listLearningVideos, verifyLearningVideos, learningYouTubeKey } from '../_shared/learning-videos.ts';
import { collectLearningHealth } from '../_shared/learning-health.ts';
import { studentReviewKey } from '../_shared/student-review-config.ts';
import { writeEducationalContent, readEducationalCatalog } from '../_shared/content-mutations.ts';

const DEFAULT_ALLOWED_ORIGINS = [
  'https://raytechinstitute.web.app',
  'https://raytechinstitute.firebaseapp.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const corsHeaders = {
  "Access-Control-Allow-Origin": DEFAULT_ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function getAllowedOrigins() {
  return (Deno.env.get('ALLOWED_ORIGINS') || DEFAULT_ALLOWED_ORIGINS.join(','))
    .split(',').map((origin) => origin.trim()).filter(Boolean);
}

function getCorsHeaders(req: Request) {
  const configured = getAllowedOrigins();
  const requestOrigin = req.headers.get('origin') || '';
  return {
    ...corsHeaders,
    'Access-Control-Allow-Origin': configured.includes(requestOrigin) ? requestOrigin : configured[0],
    Vary: 'Origin',
  };
}

const notificationRateLimits = new Map<string, { count: number; resetAt: number }>();
let cachedLearningHealth: { at: number; origin: string; report: Awaited<ReturnType<typeof collectLearningHealth>> } | null = null;

function canAcceptNotificationSubscription(req: Request): boolean {
  const origin = req.headers.get('origin') || 'unknown-origin';
  const now = Date.now();
  const current = notificationRateLimits.get(origin);
  if (!current || current.resetAt <= now) {
    notificationRateLimits.set(origin, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 20) return false;
  current.count += 1;
  return true;
}

async function verifyFirebaseAdmin(req: Request): Promise<{ ok: boolean; email?: string; error?: string; status?: number }> {
  const authorization = req.headers.get('authorization') || '';
  const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  const webApiKey = Deno.env.get('FIREBASE_WEB_API_KEY');
  if (!webApiKey) return { ok: false, status: 503, error: 'Administrator authentication is not configured.' };
  if (!idToken) return { ok: false, status: 401, error: 'Sign in with an administrator account.' };

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(webApiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return response.status >= 500 || response.status === 429
      ? { ok: false, status: 503, error: 'Administrator authentication service is unavailable.' }
      : { ok: false, status: 401, error: 'Invalid or expired administrator session.' };
    const result = await response.json();
    const user = result.users?.[0];
    if (!user || user.disabled || user.emailVerified !== true) {
      return { ok: false, status: 403, error: 'A verified administrator account is required.' };
    }
    const email = String(user.email || '').toLowerCase();
    const allowlist = (Deno.env.get('ADMIN_EMAILS') || '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    if (allowlist.length === 0) {
      return { ok: false, status: 503, error: 'Administrator access is not configured.' };
    }
    if (!allowlist.includes(email)) {
      return { ok: false, status: 403, error: 'This Firebase account is not authorized for administration.' };
    }
    return { ok: true, email };
  } catch {
    return { ok: false, status: 503, error: 'Administrator authentication service is unavailable.' };
  }
}

// ── Multi-Stage Resilient JSON Parser for LLM Outputs ────────────────
function extractAndParseJson(text: string): any {
  if (!text || typeof text !== "string") {
    throw new Error("Received empty or non-string response from AI model.");
  }

  let clean = text.trim();

  // Strip markdown code fences if present (e.g. ```json ... ``` or ``` ...)
  clean = clean.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  // Find boundaries of either a JSON object or array
  const firstBrace = clean.indexOf("{");
  const firstBracket = clean.indexOf("[");
  const lastBrace = clean.lastIndexOf("}");
  const lastBracket = clean.lastIndexOf("]");

  let start = -1;
  let end = -1;

  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    start = firstBracket;
    end = lastBracket !== -1 ? lastBracket : clean.length - 1;
  } else if (firstBrace !== -1) {
    start = firstBrace;
    end = lastBrace !== -1 ? lastBrace : clean.length - 1;
  }

  if (start !== -1 && end >= start) {
    clean = clean.substring(start, end + 1);
  }

  // Attempt 1: Standard JSON parse
  try {
    return JSON.parse(clean);
  } catch (_) {}

  // Attempt 2: Strip trailing commas before closing braces/brackets
  try {
    const withoutTrailingCommas = clean.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(withoutTrailingCommas);
  } catch (_) {}

  // Attempt 3: Remove raw control characters (keep newlines/carriage returns clean)
  try {
    const sanitized = clean.replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F]/g, " ");
    return JSON.parse(sanitized);
  } catch (_) {}

  // Attempt 4: Repair truncated JSON strings & unclosed braces
  try {
    let repaired = clean;
    let inString = false;
    let escaped = false;
    for (let i = 0; i < repaired.length; i++) {
      const char = repaired[i];
      if (char === "\\" && !escaped) {
        escaped = true;
      } else {
        if (char === '"' && !escaped) {
          inString = !inString;
        }
        escaped = false;
      }
    }
    if (inString) repaired += '"';
    let openBraces = 0;
    for (const char of repaired) {
      if (char === "{") openBraces++;
      if (char === "}") openBraces--;
    }
    while (openBraces > 0) {
      repaired += "}";
      openBraces--;
    }
    return JSON.parse(repaired);
  } catch (_) {}

  // Attempt 5: Fallback Structural Field Extractor (100% resilient against unescaped quotes inside Markdown content)
  return extractKnownSchemaFields(clean);
}

// Fallback Structural Extractor for known Educational Schemas (Notes, Blogs, Gazettes, MCQs)
function extractKnownSchemaFields(raw: string): any {
  // ── A. Array of MCQs ──
  if (raw.trim().startsWith("[")) {
    const chunks = raw.match(/\{[\s\S]*?\}(?=\s*,\s*\{|\s*\])/g) || [];
    const mcqs: any[] = [];
    for (const chunk of chunks) {
      try {
        mcqs.push(JSON.parse(chunk));
      } catch {
        const qMatch = chunk.match(/"question"\s*:\s*"([\s\S]*?)(?<!\\)"/);
        const codeMatch = chunk.match(/"codeSnippet"\s*:\s*"([\s\S]*?)(?<!\\)"/);
        const expMatch = chunk.match(/"explanation"\s*:\s*"([\s\S]*?)(?<!\\)"/);
        const idxMatch = chunk.match(/"correctIndex"\s*:\s*(\d+)/);
        const optsMatch = chunk.match(/"options"\s*:\s*\[([\s\S]*?)\]/);
        let options = ["Option A", "Option B", "Option C", "Option D"];
        if (optsMatch && optsMatch[1]) {
          const optItems = optsMatch[1].match(/"([^"\\]*(?:\\.[^"\\]*)*)"/g);
          if (optItems && optItems.length === 4) {
            options = optItems.map((o) => o.replace(/^"|"$/g, ""));
          }
        }
        if (qMatch) {
          mcqs.push({
            question: qMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n"),
            codeSnippet: codeMatch ? codeMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n") : undefined,
            options,
            correctIndex: idxMatch ? Number(idxMatch[1]) : 0,
            explanation: expMatch ? expMatch[1].replace(/\\"/g, '"').replace(/\\n/g, "\n") : "Review this answer against the relevant textbook.",
          });
        }
      }
    }
    if (mcqs.length > 0) return mcqs;
  }

  // Helper to extract simple string or numeric property
  const getField = (name: string, isNum = false) => {
    if (isNum) {
      const match = raw.match(new RegExp(`"${name}"\\s*:\\s*(\\d+)`));
      return match ? Number(match[1]) : undefined;
    }
    const match = raw.match(new RegExp(`"${name}"\\s*:\\s*"([\\s\\S]*?)(?<!\\\\)"`));
    return match ? match[1].replace(/\\"/g, '"').replace(/\\n/g, "\n") : undefined;
  };

  // Helper to extract long text (like 'content') even when containing internal unescaped quotes
  const extractContentText = (nextFieldPattern: RegExp): string => {
    const contentStart = raw.indexOf('"content"');
    if (contentStart === -1) return "";
    const colonIdx = raw.indexOf(":", contentStart);
    if (colonIdx === -1) return "";
    const firstQuote = raw.indexOf('"', colonIdx);
    if (firstQuote === -1) return "";
    const remaining = raw.substring(firstQuote + 1);
    const nextMatch = remaining.search(nextFieldPattern);
    if (nextMatch !== -1) {
      return remaining.substring(0, nextMatch).replace(/\\"/g, '"').replace(/\\n/g, "\n");
    }
    // Truncated at end
    return remaining.replace(/"\s*}?\s*$/, "").replace(/\\"/g, '"').replace(/\\n/g, "\n");
  };

  // ── B. Notes Object ──
  if (raw.includes('"chapterTitle"') || raw.includes('"chapterNumber"')) {
    const note: any = {
      chapterNumber: getField("chapterNumber", true) || 1,
      chapterTitle: getField("chapterTitle") || "Chapter",
      title: getField("title") || "Solved Notes & Handouts",
      description: getField("description") || "Comprehensive chapter study guide.",
      pdfUrl: getField("pdfUrl") || "",
      previewPdfUrl: getField("previewPdfUrl") || "",
      fileSize: getField("fileSize") || "3.5 MB",
      actionButtonText: getField("actionButtonText") || "",
      actionButtonUrl: getField("actionButtonUrl") || "",
      content: extractContentText(/",\s*"(?:pdfUrl|previewPdfUrl|fileSize|actionButtonText|actionButtonUrl)"|"\s*}/),
    };
    if (!note.content) note.content = note.description;
    return note;
  }

  // ── C. Blog Object ──
  if (raw.includes('"excerpt"') || raw.includes('"readTime"') || raw.includes('"author"')) {
    const blog: any = {
      title: getField("title") || "Comprehensive Examination Guide",
      slug: getField("slug") || "educational-guide",
      category: getField("category") || "date-sheets",
      excerpt: getField("excerpt") || "Official study and examination update for Intermediate students.",
      featuredImage: getField("featuredImage") || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
      author: getField("author") || "Academic Coordination Cell",
      readTime: getField("readTime") || "10 min read",
      tags: ["Punjab Boards", "FBISE", "Inter", "Study Resources"],
      content: extractContentText(/",\s*"(?:featuredImage|author|readTime|tags|actionButtonText|actionButtonUrl)"|"\s*}/),
    };
    return blog;
  }

  // ── D. Gazette Object ──
  if (raw.includes('"board"') || raw.includes('"totalCandidates"')) {
    const gazette: any = {
      title: getField("title") || "Result Gazette Notification",
      board: getField("board") || "BISE Lahore",
      classSlug: getField("classSlug") || "11th-class",
      year: getField("year", true) || 2026,
      session: getField("session") || "1st Annual Examination",
      totalCandidates: getField("totalCandidates") || "185,000 Candidates",
      passingPercentage: getField("passingPercentage") || "68%",
      pdfUrl: getField("pdfUrl") || "https://www.biselahore.com/",
      directResultUrl: getField("directResultUrl") || "https://www.biselahore.com/",
      actionButtonText: getField("actionButtonText") || "Download Official Gazette PDF",
      actionButtonUrl: getField("actionButtonUrl") || "https://www.biselahore.com/",
      content: extractContentText(/",\s*"(?:pdfUrl|directResultUrl|actionButtonText|actionButtonUrl)"|"\s*}/),
    };
    return gazette;
  }

  throw new Error("Unable to parse structured JSON from AI output.");
}

// Cascading Gemini caller with automatic fallback across genuine production models
async function callGeminiCascade(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  maxOutputTokens: number = 8192,
  temperature: number = 0.3,
  deadlineAt: number = Number.POSITIVE_INFINITY
): Promise<string> {
  // Preferred production models. The API catalog below filters this list to
  // models actually enabled for the current key before any generation call.
  const preferredModels = [
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
  ];
  let models = [...preferredModels];

  let lastErrorText = "";
  try {
    const catalogResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`, { signal: AbortSignal.timeout(Math.max(1, Math.min(8000, deadlineAt - Date.now()))) });
    if (catalogResponse.ok) {
      const catalog = await catalogResponse.json();
      const supported = (catalog.models || [])
        .filter((item: any) => item.supportedGenerationMethods?.includes('generateContent'))
        .map((item: any) => String(item.name || '').replace(/^models\//, ''))
        .filter((name: string) => /flash/i.test(name));
      const preferredSupported = preferredModels.filter((model) => supported.includes(model));
      models = [...preferredSupported, ...supported.filter((model: string) => !preferredSupported.includes(model))];
    }
  } catch {
    // Keep the requested cascade when model discovery is unavailable.
  }

  for (const model of models) {
    if (Date.now() >= deadlineAt) throw new Error('Lesson generation timed out before completion. No incomplete lesson was saved; please retry.');
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        signal: AbortSignal.timeout(Math.max(1, Math.min(60000, deadlineAt - Date.now()))),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\nSOURCE INTEGRITY: You are an independent educational assistant. Never impersonate a board official. Do not invent statistics, marks, result dates, deadlines, fees, SMS codes, citations, PDF URLs or official status. Use current-session factual claims only from sources supplied in the prompt; otherwise clearly state that official confirmation is required. Length requirements never justify inventing or repeating facts.\n\n${userPrompt}\n\nIMPORTANT: Output ONLY valid JSON matching the requested schema. Do not enclose in markdown ticks, just raw JSON.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature,
            maxOutputTokens,
            responseMimeType: "application/json",
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim().length > 0) {
          return candidateText;
        }
      } else {
        const errBody = await res.text();
        lastErrorText = `Model ${model} returned ${res.status}: ${errBody.slice(0, 600)}`;
      }
    } catch (e: any) {
      lastErrorText = `Model ${model} fetch exception: ${e.message}`;
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastErrorText}`);
}

function wordCount(value: unknown): number {
  return typeof value === 'string' ? value.trim().split(/\s+/).filter(Boolean).length : 0;
}

function validateLongFormContent(item: any, minimumWords: number, label: string, minimumHeadings: number): any {
  if (!item || typeof item !== 'object') throw new Error(`AI returned an invalid ${label} object.`);
  const title = String(item.title || '').trim();
  const content = String(item.content || '').trim();
  const headingCount = (content.match(/^#{2,6}\s+\S.+$/gm) || []).length;
  if (title.length < 12) throw new Error(`AI ${label} is missing a useful title.`);
  if (wordCount(content) < minimumWords) throw new Error(`AI ${label} must contain at least ${minimumWords} words.`);
  if (headingCount < minimumHeadings) throw new Error(`AI ${label} must contain at least ${minimumHeadings} structured Markdown headings.`);
  return { ...item, title, content };
}

async function expandIfTooShort(apiKey: string, item: any, minimumWords: number, label: string): Promise<any> {
  if (wordCount(item?.content) >= minimumWords) return item;
  let best = item;
  for (let attempt = 1; attempt <= 3 && wordCount(best?.content) < minimumWords; attempt++) {
    const currentWords = wordCount(best?.content);
    const expansionPrompt = `Expand the following ${label} into a complete, publication-ready Pakistani board education guide. This is expansion attempt ${attempt}. Return ONLY valid JSON with the same fields. Keep all factual details, but replace content with at least ${minimumWords} words; the current draft has only ${currentWords} words. Use rich Markdown headings, substantial explanatory paragraphs, tables where useful, practical examples, student checklists, and FAQs. Never return a short summary and never truncate content.\n\nCURRENT JSON:\n${JSON.stringify(best)}`;
    const expandedRaw = await callGeminiCascade(apiKey, `You are a meticulous senior academic editor. The minimum word count is a hard acceptance requirement, not a suggestion.`, expansionPrompt, 24576, 0.25);
    const expanded = extractAndParseJson(expandedRaw);
    if (wordCount(expanded?.content) > wordCount(best?.content)) best = { ...best, ...expanded };
    else break;
  }
  return best;
}

function validateMcqs(value: any, expectedCount: number): any[] {
  if (!Array.isArray(value)) throw new Error('AI response did not contain an MCQ array.');
  const seenQuestions = new Set<string>();
  const valid = value.filter((item) => {
    const question = String(item?.question || '').trim();
    const options: string[] = Array.isArray(item?.options) ? item.options.map((option: unknown) => String(option || '').trim()) : [];
    const distinctOptions = new Set(options.map((option) => option.toLocaleLowerCase().replace(/\s+/g, ' ')));
    const explanation = String(item?.explanation || '').trim();
    const normalizedQuestion = question.toLocaleLowerCase().replace(/\s+/g, ' ');
    const isValid = question.length >= 12
      && options.length === 4
      && options.every(Boolean)
      && distinctOptions.size === 4
      && Number.isInteger(item?.correctIndex)
      && item.correctIndex >= 0
      && item.correctIndex <= 3
      && explanation.length >= 20;
    if (!isValid || seenQuestions.has(normalizedQuestion)) return false;
    seenQuestions.add(normalizedQuestion);
    return true;
  }).map((item) => ({
    question: String(item.question).trim(),
    codeSnippet: item.codeSnippet ? String(item.codeSnippet) : undefined,
    options: item.options.map((option: unknown) => String(option).trim()),
    correctIndex: Number(item.correctIndex),
    explanation: String(item.explanation || 'Review this answer against the relevant textbook.').trim(),
  }));
  if (valid.length < expectedCount) throw new Error(`AI returned ${valid.length} valid MCQs; ${expectedCount} are required.`);
  return valid.slice(0, expectedCount);
}

// OpenCode Zen caller with error capture
async function callOpenCode(
  apiKey: string,
  baseUrl: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  try {
    const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "big-pickle",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `${userPrompt}\n\nRespond with valid JSON only.` },
        ],
        temperature: 0.2,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) return text;
    }
  } catch {}
  return null;
}

async function dispatchStaticRebuild(record: any = {}) {
  const token = Deno.env.get('GITHUB_DISPATCH_TOKEN');
  const repository = Deno.env.get('GITHUB_REPOSITORY') || 'mahaddevelpoer/RayTechInstitute';
  if (!token) throw new Error('GITHUB_DISPATCH_TOKEN is not configured in Supabase Secrets.');
  // A waiting main-branch build has not fetched its snapshot yet. Reuse it;
  // an already-running build still needs one queued successor for new edits.
  try {
    const runs=await fetch(`https://api.github.com/repos/${repository}/actions/workflows/deploy-firebase.yml/runs?per_page=10`,{headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'User-Agent':'RayTech-static-publisher'},signal:AbortSignal.timeout(8000)});
    if(runs.ok){const data=await runs.json();if(data.workflow_runs?.some((run:{head_branch:string;status:string})=>run.head_branch==='main'&&['queued','pending','waiting','requested'].includes(run.status)))return{success:true,repository,eventType:'content-published',reused:true};}
  }catch{ /* A failed optimization must not prevent a fresh dispatch. */ }

  const response = await fetch(`https://api.github.com/repos/${repository}/dispatches`, {
    method: 'POST',
    signal: AbortSignal.timeout(15000),
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'RayTech-static-publisher',
    },
    body: JSON.stringify({
      event_type: 'content-published',
      client_payload: {
        source: 'supabase',
        table: record.table || record.entity || 'content',
        operation: record.operation || record.eventType || 'upsert',
        id: record.record?.id || record.new_record?.id || record.id || null,
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`GitHub repository dispatch failed (${response.status}): ${message}`);
  }
  return { success: true, repository, eventType: 'content-published' };
}

async function mutateContent(serviceRoleKey: string, payload: any) {
  const result = await writeEducationalContent(Deno.env.get('SUPABASE_URL') || '', serviceRoleKey, payload);
  try { await dispatchStaticRebuild({table:result.table,operation:result.operation,id:payload.record?.id||payload.filter?.id||payload.filter?.slug}); return {...result,rebuild:'queued'}; }
  catch { return {...result,rebuild:'failed'}; }
}

async function subscribeNotifications(serviceRoleKey: string, payload: any) {
  const token = String(payload?.token || '').trim();
  const userAgent = String(payload?.userAgent || '').trim().slice(0, 512);
  if (token.length < 20 || token.length > 4096) {
    throw new Error('Invalid notification subscription token.');
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (!supabaseUrl) throw new Error('SUPABASE_URL is not configured.');

  const response = await fetch(`${supabaseUrl}/rest/v1/notification_subscribers`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({
      token,
      user_agent: userAgent || null,
      subscribed_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) throw new Error(`Notification subscription failed (${response.status}).`);
  return { success: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  // Response helper that always returns HTTP 200 so Supabase JS invoke() never throws
  // "Edge Function returned a non-2xx status code" and clients receive clean error objects.
  const respond = (data: any, status: number = 200) => {
    if (typeof data?.error === 'string' && (data.error.length > 600 || /schema cache|SQLSTATE|PostgREST|Supabase .*failed|returned \d{3}|fetch exception|github.*failed|github_pat_|sk-or-|AIza|Bearer |stack trace/i.test(data.error)))
      data = { ...data, error: 'The service could not complete this request. Your existing content is unchanged. Check service health or retry shortly.' };
    return new Response(JSON.stringify(data), {
      status,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  };

  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return respond({ success: false, error: "Invalid JSON in request body." });
    }

    const { action, payload = {} } = body;

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const opencodeApiKey = Deno.env.get("OPENCODE_API_KEY");
    const opencodeBaseUrl = Deno.env.get("OPENCODE_BASE_URL") || "https://opencode.ai/zen/v1";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY");

    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const currentYear = new Date().getFullYear();

    // Public notification registration is intentionally isolated from all
    // administrator actions and writes through the service role only.
    if (action === 'subscribe_notifications') {
      const origin = req.headers.get('origin') || '';
      if (!origin || !getAllowedOrigins().includes(origin)) {
        return respond({ success: false, error: 'Origin is not allowed.' }, 403);
      }
      if (!canAcceptNotificationSubscription(req)) {
        return respond({ success: false, error: 'Too many subscription attempts. Try again later.' }, 429);
      }
      if (!serviceRoleKey) return respond({ success: false, error: 'Notification service is not configured.' }, 503);
      try {
        return respond(await subscribeNotifications(serviceRoleKey, payload));
      } catch (error: any) {
        return respond({ success: false, error: error.message || 'Unable to save notification subscription.' }, 400);
      }
    }

    // Supabase Database Webhooks post their event envelope directly. This
    // bridge turns every admin content change into repository_dispatch.
    if (!action && (body.table || body.type || body.record || body.new_record)) {
      const expectedSecret = Deno.env.get('CONTENT_WEBHOOK_SECRET');
      const suppliedSecret = req.headers.get('x-content-webhook-secret');
      if (!expectedSecret || suppliedSecret !== expectedSecret) {
        return respond({ success: false, error: 'Invalid content webhook secret.' }, 401);
      }
      try {
        return respond(await dispatchStaticRebuild(body));
      } catch (error: any) {
        return respond({ success: false, error: error.message }, 502);
      }
    }

    // All browser-triggered actions are administrator-only. Database webhooks
    // above use their separate shared secret and never pass through this gate.
    const admin = await verifyFirebaseAdmin(req);
    if (!admin.ok) return respond({ success: false, error: admin.error || 'Unauthorized.' }, admin.status || 401);

    if (action === 'verify_admin') {
      return respond({ success: true, email: admin.email });
    }
    if (action === 'content_catalog') {
      try { return respond(await readEducationalCatalog(Deno.env.get('SUPABASE_URL') || '',serviceRoleKey || '')); }
      catch { return respond({success:false,error:'The admin catalog could not be refreshed. Existing content is unchanged.'},503); }
    }

    if (action === 'learning_health') {
      const origin = req.headers.get('origin') || getAllowedOrigins()[0] || '';
      if (cachedLearningHealth && cachedLearningHealth.origin === origin && Date.now() - cachedLearningHealth.at < 30000) return respond({ ...cachedLearningHealth.report, cached: true });
      const report = await collectLearningHealth({
        databaseUrl: Deno.env.get('SUPABASE_URL') || '', serviceKey: serviceRoleKey || '',
        geminiKey: geminiApiKey || '', openRouterKey: studentReviewKey(name => Deno.env.get(name)), youtubeKey: learningYouTubeKey(name => Deno.env.get(name)),
        githubToken: Deno.env.get('GITHUB_DISPATCH_TOKEN') || '', repository: Deno.env.get('GITHUB_REPOSITORY') || 'mahaddevelpoer/RayTechInstitute',
        origin,
      });
      cachedLearningHealth = { at: Date.now(), origin, report };
      return respond(report);
    }

    if (action === 'learning_ai_settings' || action === 'learning_ai_set_enabled') {
      try {
        const settings = createLearningAiSettings(Deno.env.get('SUPABASE_URL') || '', serviceRoleKey || '');
        const value = action === 'learning_ai_settings' ? await settings.read() : await settings.set(payload.enabled, payload.expectedUpdatedAt);
        return respond({ success: true, settings: value, message: value.enabled ? 'AI topic generation is on.' : 'AI topic generation is off. Manual editing and public lessons are unchanged.' });
      } catch (error) { return respond({ success: false, error: error instanceof Error ? error.message : 'AI settings could not be saved.' }, 400); }
    }

    if (action === 'learning_generate_next') {
      const aiSettings = createLearningAiSettings(Deno.env.get('SUPABASE_URL') || '', serviceRoleKey || '');
      try { await aiSettings.requireEnabled(); }
      catch (error) { return respond({ success: false, error: error instanceof Error ? error.message : 'AI generation is disabled.' }, 403); }
      const openRouterKey = studentReviewKey(name => Deno.env.get(name));
      if (!serviceRoleKey || (!openRouterKey&&!geminiApiKey)) return respond({ success: false, error: 'Course generation or learning storage is not configured.' }, 503);
      return learningGenerationResponse(getCorsHeaders(req), async (emit, signal) => {
        const repository = createLearningRepository(Deno.env.get('SUPABASE_URL') || '', serviceRoleKey, async () => {});
        const guarded = { ...repository, write: async (...args: Parameters<typeof repository.write>) => { signal.throwIfAborted(); await aiSettings.requireEnabled(); signal.throwIfAborted(); await repository.write(...args); } };
        return await generateNextLearningTopic(payload, guarded,
          (system, prompt, kind='topic') => generateLearningWithFallback(openRouterKey||'',geminiApiKey||'',system,prompt,kind,emit,signal), 'openrouter-with-gemini-fallback');
      });
    }

    if (action === 'learning_videos') {
      try { return respond(await listLearningVideos(learningYouTubeKey(name => Deno.env.get(name)), payload.pageToken || '')); }
      catch (error) { return respond({ success: false, error: error instanceof Error ? error.message : 'Video selection failed.' }, 400); }
    }

    if (['learning_catalog', 'learning_save_draft', 'learning_publish', 'learning_delete', 'learning_discard_draft', 'learning_registry_state'].includes(action)) {
      if (!serviceRoleKey) return respond({ success: false, error: 'Learning storage is not configured.' }, 503);
      try {
        const repository = createLearningRepository(Deno.env.get('SUPABASE_URL') || '', serviceRoleKey,
          () => dispatchStaticRebuild({ table: 'learning_topics', operation: action }), fetch,
          ids => verifyLearningVideos(ids, learningYouTubeKey(name => Deno.env.get(name))));
        return respond(await handleLearningAdmin(action, payload, repository));
      } catch (error) {
        return respond({ success: false, error: error instanceof Error ? error.message : 'Learning update failed.' }, 400);
      }
    }

    if (action === 'trigger_static_rebuild') {
      try {
        return respond(await dispatchStaticRebuild({ ...payload, operation: 'manual' }));
      } catch (error: any) {
        return respond({ success: false, error: error.message }, 502);
      }
    }

    if (action === 'mutate_content') {
      if (!serviceRoleKey) return respond({ success: false, error: 'Service role key is not configured.' }, 500);
      try {
        return respond(await mutateContent(serviceRoleKey, payload));
      } catch (error: any) {
        return respond({ success: false, error: error.message }, 400);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 1. ACTION: AI BLOG GENERATOR (Pillar Authority SEO Content)
    // ─────────────────────────────────────────────────────────────
    if (action === "generate_blog") {
      if (!geminiApiKey) {
        return respond({
          success: false,
          error: "GEMINI_API_KEY is not configured in Supabase Secrets Vault. Please add GEMINI_API_KEY in your Supabase dashboard.",
        });
      }

      const { mode, topic, category, targetAudience, userNotes, referenceLinks } = payload;
      if (!topic || !topic.trim()) {
        return respond({ success: false, error: "Topic is required to generate a blog article." });
      }

      const systemPrompt = `You are a Senior Academic Authority & SEO Content Specialist in Pakistan with 15+ years of experience leading educational portals for Intermediate (11th and 12th class, F.Sc Pre-Medical, F.Sc Pre-Engineering, ICS, I.Com) students across ALL Punjab Educational Boards (BISE Lahore, Gujranwala, Rawalpindi, Faisalabad, Multan, Sahiwal, Bahawalpur, DG Khan, Sargodha) and Federal Board (FBISE Islamabad).

TODAY'S OFFICIAL DATE: ${currentDate} (Current Academic Cycle: ${currentYear})

STRICT MANDATORY RULES (ZERO EXCEPTIONS):
1. LENGTH & DEPTH MANDATE: Do NOT write short articles! You MUST write an EXHAUSTIVE, ULTIMATE AUTHORITY PILLAR ARTICLE (minimum 3,000+ words, comprehensive). Every section must be elaborated thoroughly with paragraphs of analysis, breakdown, practical examples, and official board citations.
2. TOPIC-ADAPTIVE STRUCTURE (EVERY SECTION MUST BE FULLY ELABORATED):
   - Begin with a 40-60 word direct answer block for the exact search intent, followed by a factual introduction.
   - Use 5-8 descriptive Markdown headings selected for the topic and category. Date-sheet topics need schedules and exam rules; admission topics need eligibility, deadlines, application steps, fees, documents, and selection; career topics need comparison criteria, skills, pathways, costs, and outcomes.
   - Add tables, checklists, examples, and a practical student action plan only where they genuinely clarify the topic. Do not force unrelated board sections or repeat generic headings.
   - Include an official-source and verification section. Separate confirmed facts from estimates, expectations, and items that must be checked on the relevant board or institution website.
   - End with at least 6 useful, topic-specific FAQs with direct answers. Every section must contain substantial explanation rather than filler.
3. PAKISTAN ACADEMIC CONTEXT ONLY: Every reference, grading rule, pairing scheme, practical exam rule, and board policy MUST strictly apply to Pakistani boards (BISE Lahore, Gujranwala, Rawalpindi, Faisalabad, Multan, Sahiwal, Bahawalpur, DG Khan, Sargodha, FBISE Islamabad). Never invent an official date, SMS code, statistic, policy, or board notice. If a fact was not supplied in the brief or an official reference link, label it clearly as expected, illustrative, or requiring confirmation from the board.
4. NO GENERIC AI CLICHES: Never use phrases like "In today's fast-paced digital world", "delve into", "embark on", "testament", "beacon of hope", "tapestry". Write like a senior board chairperson and university professor.
5. AUTHENTIC PAKISTANI RELEVANT IMAGES:
   - Suggest ONLY realistic high-quality education image URLs from Unsplash representing Pakistani/South Asian students studying, examination halls, library books, or computing laboratories.
   - Do NOT use repeated images across different prompts.
6. CRITICAL JSON FORMATTING: In the 'content' string, NEVER use unescaped double quotes ("). Always use single quotes (') or code formatting when referencing terms or quotes inside markdown.
7. Return response STRICTLY as a valid JSON object matching this schema:
{
  "title": "Comprehensive, compelling educational headline (e.g. BISE Lahore 11th & 12th Class Annual Date Sheet ${currentYear}: Complete Schedule, Pairing Schemes & Exam Center Protocols)",
  "slug": "url-friendly-slug-with-hyphens",
  "category": "${category || 'date-sheets'}",
  "excerpt": "40-60 word factual summary for Google AI Overviews and meta description",
  "content": "Massive topic-specific Markdown content of at least 3,000 words containing a direct answer block, relevant headings, complete tables or checklists where useful, official-source notes, a practical action plan, FAQs, and no filler or truncation",
  "featuredImage": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
  "author": "Academic Coordination Cell",
  "readTime": "12 min read",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]
}`;

      let userPrompt = "";
      if (mode === "search_and_write") {
        userPrompt = `Autonomous Search & Write Mode:
Current Date: ${currentDate}
Topic: ${topic}
Category: ${category}
Audience: ${targetAudience || "11th & 12th Class Students (Punjab Boards & FBISE)"}

Task:
Write a massive, complete, topic-specific pillar guide of at least 3,000 words. Select the structure that best answers this topic and category. Do NOT skip important user questions, abbreviate, or use placeholders like 'etc.' or 'more details follow'. Never invent dates, statistics, policies, fees, or official claims. Use an explicit verification label whenever the brief does not provide a confirmed source.`;
      } else {
        userPrompt = `Detailed Custom Mode:
Current Date: ${currentDate}
Topic: ${topic}
Category: ${category}
Reference Notes / Context: ${userNotes || "None"}
Reference Links / Circulars: ${referenceLinks || "None"}

Task:
Write a complete topic-specific pillar guide of at least 3,000 words (target 3,000-3,500 words) using the supplied notes and circulars. Choose headings that match the topic, include several substantial paragraphs, concrete Pakistani context, tables or checklists where useful, and never reduce the article to a short summary or truncate it. Do not invent facts that are absent from the supplied sources.`;
      }

      try {
        const rawText = await callGeminiCascade(geminiApiKey, systemPrompt, userPrompt, 24576, 0.35);
        const parsedArticle = await expandIfTooShort(geminiApiKey, extractAndParseJson(rawText), 3000, 'article');
        const validatedArticle = validateLongFormContent(parsedArticle, 3000, 'article', 4);
        return respond({ success: true, article: validatedArticle });
      } catch (err: any) {
        return respond({
          success: false,
          error: `AI Blog Generation failed: ${err.message}`,
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. ACTION: AI MCQS GENERATOR (OpenCode with Gemini Fallback)
    // ─────────────────────────────────────────────────────────────
    if (action === "generate_mcqs") {
      const { classSlug, subjectSlug, chapterNumber, topic, count } = payload;
      const numQuestions = Math.min(Math.max(Number(count) || 5, 1), 15);

      const mcqSystemPrompt = `You are a Senior Examination Setter for Intermediate Board Examination (BISE Lahore, Gujranwala, Rawalpindi, Faisalabad, Multan, FBISE Islamabad) specializing in Computer Science, Physics, Chemistry, and Mathematics.

TODAY'S ACADEMIC CYCLE: ${currentYear} | Current Date: ${currentDate}
TARGET:
- Class: ${classSlug || "11th-class"}
- Subject: ${subjectSlug || "computer-science"}
- Chapter: Chapter ${chapterNumber || 1}
- Topic: ${topic || "Core Chapter Syllabus"}

CRITICAL RULES FOR PAKISTAN BOARD EXAMINATION:
1. Every question must have EXACTLY 4 distinct choices (Index 0, 1, 2, 3 representing A, B, C, D).
2. For programming topics (Python / C / C++ / HTML), include realistic code snippets with loops, conditionals, list operations, or syntax logic matching Punjab textbook syllabus.
3. correctIndex MUST strictly be an integer (0 for A, 1 for B, 2 for C, 3 for D). Double-check the answer key against standard board textbooks.
4. Include a concise, unambiguous explanation citing standard textbook reasoning.
5. Return your response STRICTLY as a JSON array of MCQ objects matching this schema:
[
  {
    "question": "Question statement text here",
    "codeSnippet": "optional code snippet or null",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Official textbook rationale"
  }
]`;

      const userPrompt = `Generate ${numQuestions} verified board examination MCQs for Chapter ${chapterNumber || 1} on "${topic || "Key Concepts"}". Respond with JSON array only.`;

      let rawResponse: string | null = null;
      let usedProvider = "";

      // ── Step A: Try OpenCode if key is present ──
      if (opencodeApiKey) {
        rawResponse = await callOpenCode(opencodeApiKey, opencodeBaseUrl, mcqSystemPrompt, userPrompt);
        if (rawResponse) usedProvider = "opencode";
      }

      // ── Step B: Seamless Fallback to Gemini ──
      if (!rawResponse && geminiApiKey) {
        try {
          rawResponse = await callGeminiCascade(geminiApiKey, mcqSystemPrompt, userPrompt, 8192, 0.2);
          if (rawResponse) usedProvider = "gemini";
        } catch (e: any) {
          return respond({
            success: false,
            error: `MCQs generation failed on both OpenCode and Gemini. Error: ${e.message}`,
          });
        }
      }

      if (!rawResponse) {
        return respond({
          success: false,
          error: "Neither GEMINI_API_KEY nor OPENCODE_API_KEY is configured in Supabase Secrets.",
        });
      }

      try {
        const mcqs = validateMcqs(extractAndParseJson(rawResponse), numQuestions);
        return respond({ success: true, mcqs, provider: usedProvider });
      } catch (err: any) {
        return respond({
          success: false,
          error: `Failed to parse generated MCQs: ${err.message}`,
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. ACTION: AI GAZETTE & RESULT NOTIFICATION GENERATOR
    // ─────────────────────────────────────────────────────────────
    if (action === "generate_gazette") {
      if (!geminiApiKey) {
        return respond({
          success: false,
          error: "GEMINI_API_KEY is not configured in Supabase Secrets.",
        });
      }

      const { board, classSlug, year, session, customNotes, actionButtonText, actionButtonUrl } = payload;
      const targetBoard = board || "BISE Lahore";
      const targetYear = Number(year) || currentYear;
      const targetSession = session || "1st Annual Examination";
      const className = classSlug === "11th-class" ? "11th Class (1st Year HSSC-I)" : "12th Class (2nd Year HSSC-II)";

      const boardPortalMap: Record<string, string> = {
        "BISE Lahore": "https://www.biselahore.com/",
        "BISE Gujranwala": "https://www.bisegrw.edu.pk/",
        "BISE Rawalpindi": "https://www.biserwp.edu.pk/",
        "BISE Faisalabad": "http://www.bisefsd.edu.pk/",
        "BISE Multan": "https://www.bisemultan.edu.pk/",
        "BISE Sahiwal": "https://www.bisesahiwal.edu.pk/",
        "BISE Bahawalpur": "https://www.bisebwp.edu.pk/",
        "BISE DG Khan": "https://www.bisedgkhan.edu.pk/",
        "BISE Sargodha": "https://www.bisesargodha.edu.pk/",
        "Federal Board (FBISE)": "https://www.fbise.edu.pk/",
      };

      const defaultPortal = boardPortalMap[targetBoard] || "https://www.biselahore.com/";

      const gazetteSystemPrompt = `You are an independent educational editor at RayTech Institute. You do not represent PBCC, any BISE board, or FBISE. Never claim to announce, certify, or issue results.
Current Date: ${currentDate}

TASK:
Write an authentic, highly detailed, official Board Result Gazette Notification and Analysis for:
- Board: ${targetBoard}
- Class: ${className}
- Academic Year: ${targetYear}
- Session: ${targetSession}
- Notes/Circular context: ${customNotes || "None"}

MANDATORY DATA REQUIREMENTS:
1. Do not present invented statistics as official. If the input does not provide confirmed figures, omit the statistics entirely. Never estimate pass percentages, candidate counts, fees, dates, or release times. Explain how to verify these with the original notice.
2. Rich Markdown Writing ('content') containing:
   - ### Official Result Declaration & Executive Overview
   - ### Statistical Analysis (Science, Humanities, Pre-Medical, Pre-Engineering, ICS breakdown)
   - ### Official Online Roll Number Verification & Portal Steps
   - ### Result Verification & SMS Guidance (include an SMS code only when it is confirmed by the supplied official source; otherwise direct students to the current board portal and clearly mark the code as requiring verification)
   - ### Rechecking & Scrutiny Application Protocols (Dates, bank challan submission, re-counting rules)
   - ### Supplementary / 2nd Annual Examination Guidelines
3. CRITICAL JSON FORMATTING: In the 'content' string, NEVER use unescaped double quotes ("). Always use single quotes (') or code formatting when referencing terms or quotes inside markdown.

Return response STRICTLY as a valid JSON object matching:
{
  "title": "${targetBoard} ${className} Result Gazette ${targetYear} (${targetSession})",
  "board": "${targetBoard}",
  "classSlug": "${classSlug || '11th-class'}",
  "year": ${targetYear},
  "session": "${targetSession}",
  "totalCandidates": "Not provided - verify from the official board notice",
  "passingPercentage": "Not provided - verify from the official board notice",
  "pdfUrl": "",
  "directResultUrl": "${defaultPortal}",
  "actionButtonText": "${actionButtonText || 'Visit Board Website'}",
  "actionButtonUrl": "${actionButtonUrl || defaultPortal}",
  "content": "Rich Markdown text with full headings, statistics tables, SMS codes, and rechecking instructions..."
}`;

      try {
        const rawText = await callGeminiCascade(geminiApiKey, gazetteSystemPrompt, "Generate a detailed independent result verification guide in JSON, with at least 1,800 words in content. Do not summarize; include complete headings, tables, procedures, verification steps, rechecking rules, and student guidance.", 16384, 0.3);
        const parsedGazette = await expandIfTooShort(geminiApiKey, extractAndParseJson(rawText), 1800, 'result gazette');
        const validatedGazette = validateLongFormContent(parsedGazette, 1800, 'result gazette', 4);
        return respond({ success: true, gazette: validatedGazette });
      } catch (err: any) {
        return respond({
          success: false,
          error: `AI Gazette Generation failed: ${err.message}`,
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 4. ACTION: AI NOTES STUDY GUIDE GENERATOR
    // ─────────────────────────────────────────────────────────────
    if (action === "generate_notes") {
      if (!geminiApiKey) {
        return respond({
          success: false,
          error: "GEMINI_API_KEY is not configured in Supabase Secrets.",
        });
      }

      const { classSlug, subjectSlug, chapterNumber, chapterTitle, topic, customNotes, actionButtonText, actionButtonUrl } = payload;
      const className = classSlug === "11th-class" ? "11th Class (1st Year HSSC-I)" : "12th Class (2nd Year HSSC-II)";
      const subjectName = subjectSlug ? subjectSlug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Computer Science";

      const notesSystemPrompt = `You are a Senior Academic Content Writer and Board Examination Notes Specialist with 15+ years of experience preparing solved chapter notes, handouts, and study guides for Intermediate (11th and 12th class) students across ALL Punjab Educational Boards (BISE Lahore, Gujranwala, Rawalpindi, Faisalabad, Multan, Sahiwal, Bahawalpur, DG Khan, Sargodha) and Federal Board (FBISE Islamabad).

TODAY'S DATE: ${currentDate} | Academic Year: ${currentYear}

TASK: Generate a comprehensive Chapter Study Guide for:
- Class: ${className}
- Subject: ${subjectName}
- Chapter ${chapterNumber || 1}: ${chapterTitle || "Overview"}
- Specific Focus: ${topic || chapterTitle || "Core Concepts"}
- Additional Context: ${customNotes || "None"}

STRICT MANDATORY RULES:
1. Write an EXHAUSTIVE chapter study guide covering all key concepts from the Punjab Textbook Board / FBISE approved syllabus.
2. MANDATORY SECTIONS IN 'content' (Rich Markdown):
   - ## Chapter Overview & Learning Objectives
   - ## Key Definitions & Terminology (with bold terms)
   - ## Detailed Topic Breakdown (cover every sub-topic of this chapter thoroughly)
   - ## Important Formulas / Code Snippets / Diagrams Description (subject-specific)
   - ## Solved Short Questions (at least 8 board-pattern short questions with complete answers)
   - ## Solved Long Questions / Exercises Summary (at least 4 comprehensive answers)
   - ## Board Exam Tips & Most Repeated Questions for This Chapter
   - ## Quick Revision Checklist (bullet-point summary of all must-know items)
3. Every explanation must be written for Pakistani board exam preparation context.
4. NO generic AI cliches. Write like a senior professor and textbook author.
5. CRITICAL JSON FORMATTING MANDATE: In the 'content' string, NEVER write unescaped double quotes ("). Always use single quotes (') or code formatting when enclosing names, terms, commands, or code (e.g. use 'router' instead of double quotes). Do not break the JSON format.
6. Return response STRICTLY as a valid JSON object matching:
{
  "chapterNumber": ${chapterNumber || 1},
  "chapterTitle": "${chapterTitle || "Overview"}",
  "title": "Chapter ${chapterNumber || 1}: ${chapterTitle || "Overview"} - Complete Solved Notes & Study Guide (${className} ${subjectName})",
  "description": "Comprehensive solved notes covering key definitions, short questions, long questions, exercises, and board exam preparation tips for Chapter ${chapterNumber || 1}: ${chapterTitle || "Overview"}.",
  "content": "Comprehensive rich Markdown study guide with all mandatory sections. Use single quotes or backticks inside markdown, never unescaped double quotes.",
  "pdfUrl": "",
  "previewPdfUrl": "",
  "fileSize": "3.5 MB",
  "actionButtonText": "${actionButtonText || ""}",
  "actionButtonUrl": "${actionButtonUrl || ""}"
}`;

      try {
        const rawText = await callGeminiCascade(geminiApiKey, notesSystemPrompt, "Generate a complete chapter notes study guide in JSON format with at least 2,500 words in content. Do not use unescaped double quotes inside content and do not shorten any mandatory section.", 24576, 0.3);
        const parsedNote = await expandIfTooShort(geminiApiKey, extractAndParseJson(rawText), 2500, 'chapter study guide');
        const validatedNote = validateLongFormContent(parsedNote, 2500, 'chapter study guide', 6);
        return respond({ success: true, note: validatedNote });
      } catch (err: any) {
        return respond({
          success: false,
          error: `AI Notes Generation failed: ${err.message}`,
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 5. ACTION: PUSH NOTIFICATIONS BROADCAST
    // ─────────────────────────────────────────────────────────────
    if (action === "send_broadcast") {
      const { title, body: msgBody, url } = payload;
      return respond({
        success: true,
        message: "Broadcast notification dispatched to subscribers.",
        timestamp: new Date().toISOString(),
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 6. ACTION: HEALTH CHECK & DIAGNOSTICS (ping)
    // ─────────────────────────────────────────────────────────────
    if (action === "ping") {
      return respond({
        status: "healthy",
        hasServiceRole: Boolean(serviceRoleKey),
        hasGeminiKey: Boolean(geminiApiKey),
        hasOpencodeKey: Boolean(opencodeApiKey),
        currentDate,
        time: new Date().toISOString(),
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 7. ACTION: TEST OPENCODE DIRECTLY
    // ─────────────────────────────────────────────────────────────
    if (action === "test_opencode") {
      if (!opencodeApiKey) {
        return respond({ success: false, error: "OPENCODE_API_KEY is not set in Supabase Secrets." });
      }
      try {
        const opencodeUrl = `${opencodeBaseUrl.replace(/\/+$/, "")}/chat/completions`;
        const res = await fetch(opencodeUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${opencodeApiKey}`,
          },
          body: JSON.stringify({
            model: "big-pickle",
            messages: [{ role: "user", content: "Say hello" }],
            max_tokens: 10,
          }),
        });
        const text = await res.text();
        return respond({
          success: res.ok,
          status: res.status,
          endpointTested: opencodeUrl,
          response: text,
        });
      } catch (e: any) {
        return respond({ success: false, error: e.message });
      }
    }

    return respond({ success: false, error: `Unknown action: "${action}"` });
  } catch (error: any) {
    return respond({ success: false, error: error.message || "Unhandled server exception." });
  }
});

