/** Keep supplied English and Urdu paragraphs readable without mixing their direction. */
export function BilingualText({ text, className = '' }: { text: string; className?: string }) {
  return <span className={`bilingual-text ${className}`.trim()}>{text.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map((line, index) => {
    const urdu = /[\u0600-\u06ff]/.test(line);
    return <span key={index} className="bilingual-line" lang={urdu ? 'ur' : 'en'} dir={urdu ? 'rtl' : 'ltr'}>{line}</span>;
  })}</span>;
}
