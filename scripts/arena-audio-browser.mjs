import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{window.meters=[];const connect=AudioNode.prototype.connect;AudioNode.prototype.connect=function(destination,...rest){if(destination instanceof AudioDestinationNode){const meter=this.context.createAnalyser();meter.fftSize=2048;window.meters.push(meter);connect.call(this,meter);return connect.call(meter,destination,...rest);}return connect.call(this,destination,...rest);};});
await page.goto('http://localhost:4186/competition/practice/',{waitUntil:'networkidle'});assert.equal(await page.getByRole('button',{name:/Music on|Music off/}).count(),0);
const measure=()=>page.evaluate(async()=>{let peak=0;for(let i=0;i<15;i++){for(const meter of window.meters){const data=new Float32Array(meter.fftSize);meter.getFloatTimeDomainData(data);for(const n of data)peak=Math.max(peak,Math.abs(n));}await new Promise(r=>setTimeout(r,35));}return peak;});
const [effect]=await Promise.all([measure(),page.getByRole('button',{name:'Sound off',exact:true}).click()]);await page.getByRole('button',{name:'Start practice',exact:true}).click();assert.ok(effect>.005);await page.getByRole('button',{name:'Sound on',exact:true}).click();await page.waitForTimeout(1000);const muted=await measure();assert.ok(muted<.001);assert.deepEqual(errors,[]);console.log(JSON.stringify({effectPeak:effect,mutedPeak:muted,errors}));
}finally{await browser.close();}
