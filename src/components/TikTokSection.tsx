'use client';

import React from 'react';
import { channelData, hasValidTikTokUrl } from '@/data/channel';
import { ExternalLink, Smartphone } from 'lucide-react';

export const TikTokSection: React.FC = () => {
  const isConfigured = hasValidTikTokUrl(channelData.tiktokUrl);

  if (!isConfigured) return null;

  return (
    <section id="tiktok" className="py-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="edu-card p-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-700">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-sm">
                Follow on TikTok
              </h3>
              <p className="text-xs text-slate-500">
                Short 60-second tips, coding MCQs, and exam quick revisions.
              </p>
            </div>
          </div>

          <a
            href={channelData.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs py-2 px-4"
          >
            <span>Visit TikTok</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
