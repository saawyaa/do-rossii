import {chromium} from 'playwright';
import sharp from 'sharp';
const browser=await chromium.launch({channel:'chrome'});
const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
await page.goto('http://localhost:4173/#2');await page.locator('main[data-phase="hold"]').waitFor();await page.evaluate(()=>document.fonts.ready);
await page.addStyleTag({content:'.menu-toggle,.navigation { visibility:hidden !important; }'});
await page.evaluate(()=>{const travel=document.querySelector('.travel-layer');Object.assign(travel.style,{visibility:'visible',opacity:'1',zIndex:50});const world=travel.querySelector('.map-world');Object.assign(world.style,{visibility:'visible',opacity:'1',transform:'none'});for(const s of ['.travel-photo','.travel-aperture','.travel-map-raster']){const el=travel.querySelector(s);if(el)el.style.visibility='hidden';}const camera=travel.querySelector('.travel-camera');if(camera)camera.style.transform='none';});
const png=await page.locator('.travel-layer').screenshot();await sharp(png).webp({quality:94}).toFile('public/assets/map-overview.webp');await browser.close();
