import {chromium} from 'playwright';
import {writeFile,mkdir} from 'node:fs/promises';
const rate=Number(process.argv[2] || 4);
const browser=await chromium.launch({channel:'chrome'});
const page=await browser.newPage({viewport:{width:1920,height:1080}});
await page.goto('http://localhost:4173/#3');await page.locator('main[data-phase="hold"]').waitFor();
const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate});
await page.evaluate(()=>{
 window.__profile={frames:[],longTasks:[]};
 new PerformanceObserver(list=>{for(const e of list.getEntries())window.__profile.longTasks.push(e.duration);}).observe({type:'longtask',buffered:false});
 let prev=performance.now();function frame(t){window.__profile.frames.push(t-prev);prev=t;if(!window.__profile.stop)requestAnimationFrame(frame);}requestAnimationFrame(frame);
});
await page.keyboard.press('ArrowRight');await page.locator('main[data-phase="hold"][data-slide="4"]').waitFor();
const data=await page.evaluate(()=>{window.__profile.stop=true;return window.__profile;});
const frames=data.frames.filter(n=>n>0).sort((a,b)=>a-b);
const report={environment:`Headless local Chrome, 1920×1080, ${rate}× CPU throttle; not a guarantee for board GPU`,route:'Kermek → Denisova',frames:frames.length,medianMs:frames[Math.floor(frames.length*.5)],p95Ms:frames[Math.floor(frames.length*.95)],p99Ms:frames[Math.floor(frames.length*.99)],over50ms:frames.filter(n=>n>50).length,longTasksMs:data.longTasks};
await mkdir('qa',{recursive:true});await writeFile(`qa/motion-profile-${rate}.json`,JSON.stringify(report,null,2));console.log(report);await browser.close();
