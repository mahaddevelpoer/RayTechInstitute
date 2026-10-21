'use client';

import React from 'react';
import { channelData } from '@/data/channel';
import { Youtube, ExternalLink, CheckCircle } from 'lucide-react';
import { sanitizeUrl } from '@/utils/security';

interface FollowArchiveProps {
  videoCount?: number;
}

export const FollowArchive: React.FC<FollowArchiveProps> = () => {
  return (
    <section id="youtube" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Simple YouTube Subscription Box */}
        <div className="edu-card bg-red-50/50 border-red-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-500 flex-shrink-0 bg-white">
              <img
                src={channelData.profileImage}
                alt={channelData.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-navy-900 text-base">
                  {channelData.name}
                </h3>
                <CheckCircle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Subscribe on YouTube for new computer science video lectures and board updates.
              </p>
              <div className="text-xs font-semibold text-red-700 mt-1">
                {channelData.handle}
              </div>
            </div>
          </div>

          <a
            href={sanitizeUrl(channelData.youtubeUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded transition-colors shadow-sm"
          >
            <Youtube className="w-4 h-4" />
            <span>Subscribe on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
