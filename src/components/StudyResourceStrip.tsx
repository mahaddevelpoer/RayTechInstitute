import Link from 'next/link';
import navigation from '@/data/studyNavigation.json';
import type { StudyLink } from '@/utils/study-links';

export function StudyResourceStrip({ links = navigation.links }: { links?: StudyLink[] }) {
  const uniqueLinks = links.filter((link, index) => links.findIndex(item => item.href === link.href) === index);
  if (!uniqueLinks.length) return null;
  return <nav className="study-resource-strip" aria-label="Class study shortcuts">
    <span className="study-strip-label">Study links</span>
    <div className="study-strip-viewport">
      <div className="study-strip-track"><div className="study-strip-group">
        {uniqueLinks.map(link => <Link key={link.id} href={link.href} prefetch={false}>{link.label}</Link>)}
      </div></div>
    </div>
  </nav>;
}
