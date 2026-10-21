import fs from 'node:fs/promises';
import path from 'node:path';
import { loadTypescript } from './load-typescript.mjs';

/** Fail before Hosting replaces a working release with a partial/old export. */
export async function verifyStaticRelease(root, catalog, revision) {
  const required = new Set(['/', '/classes/', '/blogs/', '/results-gazettes/', '/courses/', '/admin/login/', '/admin/courses/', '/admin/health/']);
  const safe = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  for (const language of catalog.LEARNING_LANGUAGES) {
    if (!safe(language.slug)) throw new Error('Invalid language route in release catalog.');
    required.add(`/learn/${language.slug}/`);
    for (const topic of catalog.LEARNING_TOPICS.filter(t => t.languageId === language.id)) {
      if (!safe(topic.slug)) throw new Error('Invalid lesson route in release catalog.');
      for (const suffix of ['', 'quiz/', 'assignment/']) required.add(`/learn/${language.slug}/${topic.slug}/${suffix}`);
    }
  }
  for (const course of catalog.LEARNING_COURSES) { if (!safe(course.slug)) throw new Error('Invalid course route.'); required.add(`/courses/${course.slug}/`); }
  const failures = [];
  for (const route of required) {
    const base = path.join(root, route.slice(1));
    const html = await fs.readFile(path.join(base, 'index.html'), 'utf8').catch(() => '');
    if (!/^<!doctype html/i.test(html) || !/<html\b/i.test(html) || (!route.startsWith('/admin/') && !/<h1\b/i.test(html))) { failures.push(`${route}: missing HTML page`); continue; }
    const rsc = await fs.readFile(path.join(base, 'index.txt'), 'utf8').catch(() => '');
    if (!rsc.trim() || /^<!doctype/i.test(rsc)) failures.push(`${route}: missing Next navigation payload`);
  }
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'deployment.json'), 'utf8'));
  if (manifest.learning?.topics !== catalog.LEARNING_TOPICS.length || manifest.learning?.languages !== catalog.LEARNING_LANGUAGES.length || manifest.learning?.courses !== catalog.LEARNING_COURSES.length) failures.push('Deployment manifest does not match the exported catalog.');
  if (revision && manifest.revision !== revision) failures.push('Export revision does not match the workflow revision.');
  if (failures.length) throw new Error(`Static deployment blocked:\n${failures.join('\n')}`);
  return { routes: required.size, topics: catalog.LEARNING_TOPICS.length, revision: manifest.revision };
}
if (process.argv[1]?.replaceAll('\\', '/').endsWith('/verify-static-release.mjs')) {
  const catalog = await loadTypescript('src/data/learningCatalog.ts');
  console.log('[static-release]', await verifyStaticRelease(path.resolve('out'), catalog, process.env.GITHUB_SHA));
}
