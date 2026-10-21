"use client";

import React, { useState, useEffect } from "react";
import {
  Newspaper,
  Plus,
  CheckCircle,
  ExternalLink,
  Eye,
  Edit3,
  Sparkles,
  Trash2,
  Edit2,
  X,
  RefreshCw,
  Search,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { EducationalStore } from "@/data/educationalStore";
import { BlogPostItem, BlogCategory } from "@/types/educational";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { supabase } from "@/lib/supabase";
import { readingMinutes } from "@/utils/editorial";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<BlogCategory>("date-sheets");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
  );
  const [author, setAuthor] = useState("Academic Coordination Committee");
  const [tags, setTags] = useState(
    "Date Sheet, 11th Class, 12th Class, BISE Lahore",
  );
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── Optional Action / Download Button State ────────────────
  const [hasActionButton, setHasActionButton] = useState(false);
  const [actionButtonText, setActionButtonText] = useState(
    "Download Official PDF",
  );
  const [actionButtonUrl, setActionButtonUrl] = useState("");

  // ── AI Generator Modal State ───────────────────────────────
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiMode, setAiMode] = useState<"search_and_write" | "custom_details">(
    "search_and_write",
  );
  const [aiTopic, setAiTopic] = useState("");
  const [aiCategory, setAiCategory] = useState<BlogCategory>("date-sheets");
  const [aiAudience, setAiAudience] = useState(
    "11th & 12th Class Students (Punjab Boards & FBISE)",
  );
  const [aiUserNotes, setAiUserNotes] = useState("");
  const [aiReferenceLinks, setAiReferenceLinks] = useState("");
  const [aiEnableActionButton, setAiEnableActionButton] = useState(false);
  const [aiActionButtonText, setAiActionButtonText] = useState(
    "Download Official Notification PDF",
  );
  const [aiActionButtonUrl, setAiActionButtonUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const loadData = async () => {
    setIsSyncing(true);
    await EducationalStore.syncFromSupabase();
    setBlogs(EducationalStore.getBlogs());
    setIsSyncing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !title.trim() || !slug.trim() || !content.trim()) return;
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const blogItem: BlogPostItem = {
        id: editingId || `blog-${Date.now()}`,
        title: title.trim(),
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        category,
        excerpt: excerpt.trim() || title.trim(),
        content: content.trim(),
        featuredImage: featuredImage.trim(),
        author: author.trim() || "RayTech Academic Cell",
        datePublished:
          blogs.find((item) => item.id === editingId)?.datePublished ||
          new Date().toISOString().split("T")[0],
        readTime: `${readingMinutes(content)} min read`,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        actionButtonText:
          hasActionButton && actionButtonText.trim()
            ? actionButtonText.trim()
            : undefined,
        actionButtonUrl:
          hasActionButton && actionButtonUrl.trim()
            ? actionButtonUrl.trim()
            : undefined,
      };

      await EducationalStore.saveBlog(blogItem);
      setBlogs(EducationalStore.getBlogs());
      resetForm();
      setSuccessMsg(
        `Article "${blogItem.title}" saved. Check the rebuild status above; it appears publicly after a successful deployment.`,
      );
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Could not save the article. Please retry.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (b: BlogPostItem) => {
    setEditingId(b.id);
    setTitle(b.title);
    setSlug(b.slug);
    setCategory(b.category as BlogCategory);
    setExcerpt(b.excerpt);
    setContent(b.content);
    setFeaturedImage(b.featuredImage);
    setAuthor(b.author);
    setTags(b.tags.join(", "));
    if (b.actionButtonText && b.actionButtonUrl) {
      setHasActionButton(true);
      setActionButtonText(b.actionButtonText);
      setActionButtonUrl(b.actionButtonUrl);
    } else {
      setHasActionButton(false);
      setActionButtonText("Download Official PDF");
      setActionButtonUrl("");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setHasActionButton(false);
    setActionButtonText("Download Official PDF");
    setActionButtonUrl("");
    setActiveTab("write");
  };

  const handleDelete = async (id: string, blogTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to permanently delete "${blogTitle}"? This will delete it from Supabase.`,
      )
    ) {
      return;
    }
    setErrorMsg("");
    try {
      await EducationalStore.deleteBlog(id);
      setBlogs(EducationalStore.getBlogs());
      if (editingId === id) resetForm();
      setSuccessMsg(
        "Article deleted from the database. The public page disappears after a successful rebuild.",
      );
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Could not delete the article. Please retry.",
      );
    }
  };

  // ── AI Autonomous Generation Handler ───────────────────────
  const handleGenerateWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsGenerating(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "secure-dispatch",
        {
          body: {
            action: "generate_blog",
            payload: {
              mode: aiMode,
              topic: aiTopic.trim(),
              category: aiCategory,
              targetAudience: aiAudience.trim(),
              userNotes: aiUserNotes.trim(),
              referenceLinks: aiReferenceLinks.trim(),
            },
          },
        },
      );

      if (error || !data?.success) {
        throw new Error(
          data?.error ||
            error?.message ||
            "Failed to generate article from AI.",
        );
      }

      const generated = data.article;
      setTitle(generated.title || aiTopic);
      setSlug(
        generated.slug ||
          generated.title
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") ||
          `article-${Date.now()}`,
      );
      setCategory(generated.category || aiCategory);
      setExcerpt(generated.excerpt || "");
      setContent(generated.content || "");
      if (generated.featuredImage) setFeaturedImage(generated.featuredImage);
      if (generated.author) setAuthor(generated.author);
      if (Array.isArray(generated.tags)) setTags(generated.tags.join(", "));

      if (aiEnableActionButton) {
        setHasActionButton(true);
        setActionButtonText(
          aiActionButtonText.trim() || "Download Official Notification PDF",
        );
        setActionButtonUrl(aiActionButtonUrl.trim() || "");
      } else {
        setHasActionButton(false);
      }

      setAiModalOpen(false);
      setActiveTab("preview"); // Show live preview immediately
      setSuccessMsg(
        `AI Article generated successfully! Review below and click "Publish".`,
      );
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Error occurred while contacting AI service.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900">
            Educational Blogs &amp; Updates Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Write, edit, and publish rich Markdown articles with AI search and
            live Supabase cloud sync.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setAiModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ Write Article with AI</span>
          </button>

          <button
            onClick={loadData}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`}
            />
            <span>{isSyncing ? "Syncing..." : "Sync Supabase"}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── AI GENERATOR MODAL ────────────────────────────────────── */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-navy-900">
                    AI Academic Article Creator (Gemini Flash)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Auto-search or craft in-depth academic guides without AI
                    fingerprinting.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded text-xs">
              <button
                type="button"
                onClick={() => setAiMode("search_and_write")}
                className={`py-2 px-3 rounded font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  aiMode === "search_and_write"
                    ? "bg-white text-navy-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span>Search &amp; Write (Auto)</span>
              </button>
              <button
                type="button"
                onClick={() => setAiMode("custom_details")}
                className={`py-2 px-3 rounded font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  aiMode === "custom_details"
                    ? "bg-white text-navy-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-navy-600" />
                <span>Custom Prompt &amp; Links</span>
              </button>
            </div>

            <form onSubmit={handleGenerateWithAI} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Topic / Headline Intent{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder={
                    aiMode === "search_and_write"
                      ? "e.g. BISE Lahore 11th Class Date Sheet 2026 or FAST CS Admissions 2026"
                      : "e.g. Complete 12th Class Computer Science Pairing Scheme and Chapter Weightage"
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Category
                  </label>
                  <select
                    value={aiCategory}
                    onChange={(e) =>
                      setAiCategory(e.target.value as BlogCategory)
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                  >
                    <option value="date-sheets">Date Sheets</option>
                    <option value="admissions">Admission Alerts</option>
                    <option value="career-guides">Career Guides</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={aiAudience}
                    onChange={(e) => setAiAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {aiMode === "search_and_write" ? (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-[11px] text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-emerald-800">
                    <Search className="w-3.5 h-3.5" />
                    <span>Autonomous Search Active</span>
                  </div>
                  <p className="leading-relaxed">
                    AI will research recent Pakistani board notifications,
                    official exam timelines, guidelines, and admission criteria.
                    It writes 100% human-like educational prose with structured
                    comparison tables and no AI clichés.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Reference Notes / Outline / Key Details
                    </label>
                    <textarea
                      value={aiUserNotes}
                      onChange={(e) => setAiUserNotes(e.target.value)}
                      rows={3}
                      placeholder="Paste any bullet points, exam dates, or specific teacher remarks you want included..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official Links / Circular URLs
                    </label>
                    <input
                      type="text"
                      value={aiReferenceLinks}
                      onChange={(e) => setAiReferenceLinks(e.target.value)}
                      placeholder="e.g. https://www.biselahore.com/ or university notice URL"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Optional Custom Action / Download Button in AI Draft */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={aiEnableActionButton}
                    onChange={(e) => setAiEnableActionButton(e.target.checked)}
                    className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Attach Action / Download Button (Optional)</span>
                </label>

                {aiEnableActionButton && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200 animate-fade-in">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Button Label / Text (e.g. Download, Apply, Go)
                      </label>
                      <input
                        type="text"
                        value={aiActionButtonText}
                        onChange={(e) => setAiActionButtonText(e.target.value)}
                        placeholder="e.g. Download Official Date Sheet PDF"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:border-navy-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Target Link / URL
                      </label>
                      <input
                        type="text"
                        value={aiActionButtonUrl}
                        onChange={(e) => setAiActionButtonUrl(e.target.value)}
                        placeholder="e.g. https://... or /results-gazettes/"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-900 text-xs focus:border-navy-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  disabled={isGenerating}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded flex items-center gap-2 transition-colors disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing &amp; Writing Article...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Full Article Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MAIN ARTICLE EDITOR GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
              {editingId ? (
                <Edit2 className="w-4 h-4 text-navy-600" />
              ) : (
                <Plus className="w-4 h-4 text-navy-600" />
              )}
              <span>{editingId ? "Edit Article" : "Compose New Article"}</span>
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Article Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingId && !slug) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, ""),
                    );
                  }
                }}
                placeholder="e.g. BISE Lahore 11th Class Date Sheet 2026 Announced"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. bise-lahore-11th-date-sheet-2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BlogCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                >
                  <option value="date-sheets">Date Sheets</option>
                  <option value="admissions">Admission Alerts</option>
                  <option value="career-guides">Career Guides</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Summary / Excerpt (GEO &amp; Search Snippet)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="Direct 40-60 word summary for search engines and students..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Markdown Editor / Preview Tabs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-700">
                  Article Content (Markdown Supported)
                </label>
                <div className="inline-flex rounded border border-slate-200 overflow-hidden text-[11px]">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`px-3 py-1 font-medium transition-colors ${
                      activeTab === "write"
                        ? "bg-navy-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Edit3 className="w-3 h-3 inline mr-1" />
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1 font-medium transition-colors ${
                      activeTab === "preview"
                        ? "bg-navy-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    Live Preview
                  </button>
                </div>
              </div>

              {activeTab === "write" ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  placeholder={`Write or paste your article in Markdown.
AI-generated articles from Gemini/ChatGPT can be previewed seamlessly!

### Heading 3
- Bullet points
1. Numbered lists

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |`}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono text-xs focus:border-navy-600 focus:bg-white focus:outline-none leading-relaxed"
                  required
                />
              ) : (
                <div className="min-h-[280px] max-h-[350px] overflow-y-auto p-4 bg-slate-50 border border-slate-200 rounded prose-educational text-xs space-y-3">
                  {/* Action Button Preview if enabled */}
                  {hasActionButton && actionButtonUrl && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-emerald-900 block">
                          Preview: Action / Download Button
                        </span>
                        <span className="text-[11px] text-emerald-700 font-mono">
                          {actionButtonUrl}
                        </span>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-700 text-white font-semibold rounded text-xs shadow-sm">
                        {actionButtonText || "Download File"}
                      </span>
                    </div>
                  )}

                  {content ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <p className="text-slate-400 italic">
                      Nothing to preview yet. Type markdown in the Write tab or
                      use "✨ Write Article with AI".
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Optional Action / Download Button Configuration */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={hasActionButton}
                    onChange={(e) => setHasActionButton(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Attach Action / Download Button (Optional)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {hasActionButton ? "✓ Enabled" : "○ Disabled"}
                </span>
              </div>

              {hasActionButton && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 animate-fade-in">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Button Label / Text (Admin defined name)
                    </label>
                    <input
                      type="text"
                      value={actionButtonText}
                      onChange={(e) => setActionButtonText(e.target.value)}
                      placeholder="e.g. Download Complete Date Sheet PDF, Apply Now, Go to Portal"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Button Target Link / URL
                    </label>
                    <input
                      type="text"
                      value={actionButtonUrl}
                      onChange={(e) => setActionButtonUrl(e.target.value)}
                      placeholder="e.g. https://... or /results-gazettes/"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Academic Cell"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Date Sheet, 11th Class, Lahore Board"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Featured Cover Image URL
              </label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:border-navy-600 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="disabled:opacity-50 w-full py-2.5 bg-navy-600 hover:bg-navy-700 text-white font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
            >
              {editingId ? (
                <Edit2 className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>
                {isSaving
                  ? "Saving article..."
                  : editingId
                    ? "Save Article Changes"
                    : "Save Article & Request Rebuild"}
              </span>
            </button>
          </form>
        </div>

        {/* Existing Articles List Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">
              Published Articles ({blogs.length})
            </h2>
            <span className="text-[11px] text-slate-500">Live on website</span>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {blogs.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm space-y-2 hover:border-navy-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <Newspaper className="w-4 h-4 text-navy-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-navy-900 leading-snug">
                        {b.title}
                      </h3>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-navy-700">
                          {b.category}
                        </span>{" "}
                        &bull; {b.datePublished}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(b)}
                      className="p-1.5 text-slate-600 hover:text-navy-600 hover:bg-slate-100 rounded transition-colors"
                      title="Edit Article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.title)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Article Permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {b.excerpt}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex flex-wrap gap-1">
                    {b.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={
                      [
                        "punjab-boards-inter-date-sheet-2026",
                        "fast-nuces-punjab-university-admissions-2026",
                        "computer-science-vs-software-engineering-career-guide",
                      ].includes(b.slug)
                        ? `/blogs/${b.slug}`
                        : `/blogs/post?slug=${encodeURIComponent(b.slug)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-600 hover:text-navy-800 font-semibold flex items-center gap-1"
                  >
                    <span>View Post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
