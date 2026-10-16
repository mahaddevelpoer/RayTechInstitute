'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  thumbnail?: string;
  autoPlayOnClick?: boolean;
  className?: string;
}

export const YouTubeFacade: React.FC<YouTubeFacadeProps> = ({
  videoId,
  title,
  thumbnail,
  autoPlayOnClick = true,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  );

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlayOnClick ? '1' : '0'}&rel=0&modestbranding=1`;

  if (isPlaying) {
    return (
      <div className={`relative w-full aspect-video bg-charcoal-950 overflow-hidden border border-archival-border ${className}`}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video bg-charcoal-950 overflow-hidden border border-archival-border group cursor-pointer ${className}`}
      onClick={() => setIsPlaying(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsPlaying(true);
        }
      }}
      aria-label={`Play lecture video: ${title}`}
    >
      {/* Background Image / Thumbnail */}
      <img
        src={imgSrc}
        alt={title}
        width={640}
        height={360}
        onError={() => setImgSrc(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] filter brightness-[0.88] group-hover:brightness-95"
        loading="lazy"
      />

      {/* Subtle Editorial Tint Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-charcoal-950/30" />

      {/* Editorial Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-charcoal-900/90 text-copper border border-copper/50 shadow-lg group-hover:bg-copper group-hover:text-charcoal-950 transition-all duration-300 group-hover:scale-105">
          <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5 fill-current" />
        </div>
      </div>

      {/* Top Archive Tag */}
      <div className="absolute top-3 left-3 bg-charcoal-900/85 backdrop-blur-sm px-2.5 py-1 text-[11px] font-mono text-ivory-400 border border-archival-border uppercase tracking-wider">
        Official Lecture Embed
      </div>
    </div>
  );
};
