/** Empty placement only. No provider script, tracking, fake ad or invisible link. */
export function AdReservation({ placement }: { placement: 'home' | 'lesson' | 'article' }) {
  return <div className="ad-reservation" data-ad-placement={placement} aria-hidden="true" />;
}
