import fs from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const root = path.resolve('out'); const pages = [];
async function files(directory) { for (const entry of await fs.readdir(directory, { withFileTypes: true })) { const file = path.join(directory, entry.name); if (entry.isDirectory()) await files(file); else if (entry.name.endsWith('.html')) pages.push(file); } }
await files(root);
const broken = []; let checked = 0;
for (const file of pages) {
  const document = new JSDOM(await fs.readFile(file, 'utf8')).window;
  for (const element of document.document.querySelectorAll('a[href], img[src], script[src], link[rel="stylesheet"][href]')) {
    const href = element.getAttribute(element.hasAttribute('src') ? 'src' : 'href');
    if (!href?.startsWith('/') || href.startsWith('//')) continue;
    const url = new URL(href, 'https://local.invalid'); let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { broken.push({ page: path.relative(root, file), target: 'invalid URL encoding' }); continue; }
    const target = path.resolve(root, `.${pathname}`);
    if (!target.startsWith(root + path.sep) && target !== root) { broken.push({ page: path.relative(root, file), target: 'invalid path' }); continue; }
    checked++;
    const candidates = [target, `${target}.html`, path.join(target, 'index.html')];
    const valid = await Promise.all(candidates.map(candidate => fs.stat(candidate).then(stat => stat.isFile()).catch(() => false)));
    if (!valid.some(Boolean)) broken.push({ page: path.relative(root, file), target: url.pathname });
  }
  document.close();
}
console.log(JSON.stringify({ publicHtmlFiles: pages.length, checkedLocalReferences: checked, broken }, null, 2));
if (broken.length) process.exitCode = 1;
