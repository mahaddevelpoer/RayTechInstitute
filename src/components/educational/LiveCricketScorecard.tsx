"use client";

import { useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

export const PAK_IND_LIVE_ARTICLE = 'pakistan-a-india-a-live-scorecard-rising-stars-2026';
export const PAK_IND_SCORECARD = 'https://www.ipl.com/matches/acc-mens-asia-cup-rising-stars-130297/india-a-vs-pakistan-a-100460/live';

export function LiveCricketScorecard() {
  const [reload, setReload] = useState(0);
  return (
    <section aria-labelledby="cricket-score-heading" className="my-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Cricket score centre</p>
          <h2 id="cricket-score-heading" className="mt-1 text-xl font-bold text-navy-900">Pakistan A vs India A: live scorecard</h2>
          <p id="cricket-feed-note" className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Select India A vs Pakistan A in the feed below. Scores and match status are supplied by IPL.com and can be delayed.</p>
        </div>
        <button type="button" onClick={() => setReload(value => value + 1)} className="inline-flex min-h-12 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-navy-900">
          <RefreshCw size={16} aria-hidden="true" /> Reload scores
        </button>
      </div>
      <iframe key={reload} src="https://www.ipl.com/widget/matchlist" title="Automatically updated cricket scores from IPL.com" aria-describedby="cricket-feed-note" width="100%" height="560" loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" className="block w-full border-0 bg-white" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5 text-sm leading-6">
        <span className="text-slate-600">Feed unavailable or showing another game? Open this match directly.</span>
        <a href={PAK_IND_SCORECARD} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 font-semibold text-navy-900 underline">Open full match scorecard <ExternalLink size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
