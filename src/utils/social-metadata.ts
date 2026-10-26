import type { Metadata } from 'next';
import { DEFAULT_SOCIAL_IMAGE } from '../data/social';

/** Child metadata replaces nested defaults, so each page gets a complete share card. */
export function withSocialMetadata(metadata: Metadata): Metadata {
  const canonical = metadata.alternates?.canonical;
  const url = typeof canonical === 'string' || canonical instanceof URL ? canonical : canonical?.url;
  return {
    ...metadata,
    openGraph: {
      title: metadata.title || 'RayTech Institute', description: metadata.description || '', url,
      siteName: 'RayTech Institute', type: 'website', ...metadata.openGraph,
      images: metadata.openGraph?.images || [DEFAULT_SOCIAL_IMAGE],
    },
    twitter: {
      card: 'summary_large_image', title: metadata.title || 'RayTech Institute', description: metadata.description || '',
      ...metadata.twitter, images: metadata.twitter?.images || [DEFAULT_SOCIAL_IMAGE.url],
    },
  };
}
