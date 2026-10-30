import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
const page=await browser.newPage({viewport:{width:1366,height:900}});
await page.goto('http://localhost:4186/competition/play/',{waitUntil:'networkidle'});
const color=await page.locator('.arena-signin .arena-button').evaluate(e=>getComputedStyle(e).color);
assert.equal(color,'rgb(255, 255, 255)');
await page.screenshot({path:'artifacts/competition-preview/screenshots/play-checkin-final.png',fullPage:true});
await page.goto('http://localhost:4186/competition/practice/',{waitUntil:'networkidle'});
await page.getByRole('button',{name:'Start practice',exact:true}).click();
await page.locator('.arena-options button').first().click();
await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(900);
assert.equal(await page.locator('.arena-options button[aria-pressed=true]').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(25, 44, 67)');
assert.equal(await page.locator('.arena-game .arena-button').evaluate(e=>getComputedStyle(e).color),'rgb(255, 255, 255)');
await page.screenshot({path:'artifacts/competition-preview/screenshots/play-board-final.png',fullPage:true});
await page.setViewportSize({width:360,height:800});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(700);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.screenshot({path:'artifacts/competition-preview/screenshots/play-board-mobile-final.png',fullPage:true});
console.log('PASS: white text on blue CTAs, selected answer state, desktop/mobile board screenshots, no mobile overflow.');
} finally {await browser.close();}
