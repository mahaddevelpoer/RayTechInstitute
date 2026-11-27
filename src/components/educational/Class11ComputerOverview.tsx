import Link from 'next/link';
import map from '../../../content/class11-computer-2027/study-map.json';

export function Class11ComputerOverview(){
 return <section className="directory-guidance" aria-labelledby="class11-alp-heading">
  <h2 id="class11-alp-heading">Computer Science: ALP 2027 study pack</h2>
  <p>All nine chapters follow the supplied Punjab textbook and the 2026-27 smart syllabus. Deleted sections and specified deleted exercise questions are excluded. Start with chapter notes, then practise the {map.mcqs} MCQs and attempt the solved model paper.</p>
  <div className="resource-quick-links">{map.downloads.map(d=><a key={d.url} href={d.url}>{d.title} PDF</a>)}<Link prefetch={false} href="/classes/11th-class/computer-science/notes/class11-alp2027-model-paper-solutions/">Read model-paper solutions</Link></div>
  <p>The 2024 archive papers use an older course. Their study pages identify the limited overlap with this textbook and link the original scans separately.</p>
 </section>;
}
