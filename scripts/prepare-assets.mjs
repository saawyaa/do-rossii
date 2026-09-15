import sharp from 'sharp';
import {readdir} from 'node:fs/promises';
const root=new URL('../public/assets/',import.meta.url).pathname;
const refs=new URL('../reference-assets/',import.meta.url).pathname;
const originals=new URL('../../assets/',import.meta.url).pathname;
for(const [src,dest] of [['01-hero-landscape.png','hero'],['03-kermek.png','kermek'],['04-denisova-cutaway.png','denisova'],['05-kostenki.png','kostenki'],['06-sungir-background.png','sungir']]) await sharp(originals+src).webp({quality:90}).toFile(root+dest+'.webp');
for(const folder of [refs,root]) for(const f of await readdir(folder)) if(/\.(jpg|png)$/.test(f)) try{await sharp(folder+f).resize({width:1800,withoutEnlargement:true}).webp({quality:88}).toFile(root+f.replace(/\.(jpg|png)$/,'.webp'));}catch{console.log('Invalid image:',f);}
