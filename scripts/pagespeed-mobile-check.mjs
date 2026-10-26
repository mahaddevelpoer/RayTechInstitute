// Lightweight component preview: one Edge process, no Next build or live API calls.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { chromium } from 'playwright';

const directory = path.resolve('artifacts/pagespeed-review/mobile');
await fs.mkdir(directory, {recursive:true});
await build({stdin:{resolveDir:process.cwd(),loader:'tsx',contents:`
  import React from 'react'; import {createRoot} from 'react-dom/client';
  import Home from './src/app/page'; import {ThemeProvider} from './src/hooks/useTheme';
  import CookieConsent from './src/components/CookieConsentBanner';
  import Notifications from './src/components/NotificationPrompt';
  import {FirebaseAnalytics} from './src/components/FirebaseAnalytics';
  createRoot(document.getElementById('root')).render(<ThemeProvider><Home/><CookieConsent/><Notifications/><FirebaseAnalytics/></ThemeProvider>);`},
  bundle:true,splitting:true,format:'esm',platform:'browser',jsx:'automatic',minify:true,outdir:directory,
  define:{'process.env.NODE_ENV':'"production"','process.env':'{}'},
});
const styles = (await Promise.all(['globals','home','catalog'].map(name => fs.readFile(`src/app/${name}.css`,'utf8')))).join('\n');
const css = await postcss([tailwind({config:'./tailwind.config.ts'}),autoprefixer]).process(styles,{from:'src/app/globals.css'});
await fs.writeFile(path.join(directory,'styles.css'),css.css);
const document = '<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Local performance component checks</title><link rel="stylesheet" href="/styles.css"><div id="root"></div><script type="module" src="/stdin.js"></script></html>';
const server = http.createServer(async (request,response) => {
  try {
    const pathname = new URL(request.url,'http://localhost').pathname;
    if (pathname === '/') {response.setHeader('Content-Type','text/html');response.end(document);return;}
    const relative = decodeURIComponent(pathname).replace(/^\/+/, '');
    const base = relative.startsWith('assets/') ? path.resolve('public') : directory;
    const file = path.resolve(base,relative);
    if (!file.startsWith(base+path.sep)) {response.writeHead(403);response.end();return;}
    response.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream');
    response.end(await fs.readFile(file));
  } catch {response.writeHead(404);response.end();}
});
let browser;
try {
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({channel:'msedge',headless:true,args:['--renderer-process-limit=1','--disable-gpu']});
  const page = await browser.newPage({viewport:{width:375,height:812},deviceScaleFactor:1});
  const external = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*',route => {const url = route.request().url();if(url.startsWith(origin+'/'))return route.continue();external.push(url);return route.abort();});
  await page.goto(origin,{waitUntil:'networkidle'});
  await page.getByRole('heading',{level:1}).waitFor();
  assert.equal(await page.getByRole('heading',{level:1}).count(),1);
  await page.getByRole('button',{name:'Decline Optional',exact:true}).click();
  await page.getByRole('complementary',{name:'Cookie and Privacy Consent'}).waitFor({state:'detached'});
  const measurements = [];
  for (const width of [375,768,1280]) for (const dark of [false,true]) {
    await page.setViewportSize({width,height:812});
    await page.evaluate(value => document.documentElement.classList.toggle('dark',value),dark);
    // Measure settled theme colors after the existing 150ms color transitions.
    await page.waitForTimeout(250);
    const result = await page.evaluate(() => {
      const luminance = color => {const values=color.match(/[\d.]+/g).slice(0,3).map(Number).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return .2126*values[0]+.7152*values[1]+.0722*values[2];};
      const ratio = (first,second) => {const [a,b]=[luminance(first),luminance(second)].sort((x,y)=>y-x);return(a+.05)/(b+.05);};
      const footer = getComputedStyle(document.querySelector('.site-footer')).backgroundColor;
      const links = [...document.querySelectorAll('.footer-board-link,.footer-youtube-link')].map(link=>ratio(getComputedStyle(link).color,footer));
      const button = [...document.querySelectorAll('a')].find(link=>link.textContent.includes('Open Python Lessons'));
      const style = getComputedStyle(button);
      return {width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,footerBackground:footer,footerColors:[...document.querySelectorAll('.footer-board-link,.footer-youtube-link')].map(link=>getComputedStyle(link).color),footerContrast:links,buttonContrast:ratio(style.color,style.backgroundColor)};
    });
    assert.ok(result.overflow<=1,`Horizontal overflow at ${width}px, dark=${dark}: ${result.overflow}`);
    assert.ok(result.footerContrast.every(ratio=>ratio>=4.5),JSON.stringify(result));
    assert.ok(result.buttonContrast>=4.5,JSON.stringify(result));
    measurements.push({...result,dark});
  }
  assert.deepEqual(external.filter(url=>/firebaseapp|identitytoolkit|securetoken|supabase|google-analytics|googletagmanager|apis\.google/.test(url)),[],'Public page must not initialize backend or analytics after decline');
  assert.deepEqual(errors,[]);
  await fs.writeFile(path.join(directory,'checks.json'),JSON.stringify({componentPreview:true,notNextReleaseMeasurement:true,measurements,unwantedServiceRequests:0,pageErrors:errors},null,2));
  console.log('PASS: real homepage components at 375/768/1280px in light/dark; no horizontal overflow; reported text contrast >=4.5; decline works; no Auth/database/analytics requests or JS page errors.');
} finally {
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
