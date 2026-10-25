import { ChannelMeta } from '@/types';

// CONFIGURABLE TIKTOK URL:
// Replace "PASTE_TIKTOK_URL_HERE" with the actual TikTok profile link once available.
// If left as "PASTE_TIKTOK_URL_HERE" or empty, the public TikTok button will be safely hidden.
export const TIKTOK_URL = "PASTE_TIKTOK_URL_HERE";

export const channelData: ChannelMeta = {
  name: "RayTech Institute",
  handle: "@RaytechInstitute",
  tagline: "Learn. Understand. Apply.",
  statement: "A growing digital archive of computer science education, programming fundamentals, practical development and guided learning.",
  videoCount: 15,
  subscriberCount: 208,
  profileImage: "/assets/avatar.jpg",
  coverImage: "/assets/banner.jpg",
  youtubeUrl: "https://www.youtube.com/@RaytechInstitute",
  tiktokUrl: TIKTOK_URL,
  contentAreas: [
    "Computer Science Fundamentals",
    "Python Programming",
    "C & C++ Architecture",
    "Software Development Life Cycle",
    "HTML & Web Development",
    "Modern Development Environments (VS Code, CLion)",
    "Class-wise Subjects & Examination Resources"
  ]
};

export const hasValidTikTokUrl = (url: string): boolean => {
  return Boolean(
    url &&
    url.trim() !== "" &&
    url !== "PASTE_TIKTOK_URL_HERE" &&
    !url.includes("PASTE_TIKTOK_URL")
  );
};
