import {readFile,access,readdir} from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const json=async p=>JSON.parse(await readFile(p,'utf8'));
const publicFields=new Set(['ref','status','brand','line','version','year','box','motor','km','fuel','color','doors','registration','inspection','plateDigit','oneOwner','soat','technical','price','negotiable','tradeIn','pitch']);
const safe=p=>typeof p==='string'&&/^(assets\/|VEHICULOS_VENDIDOS\/02_WEB\/)/.test(p)&&!p.split('/').includes('..')&&!p.includes('\\')&&!/01_ORIGINALES|tarjeta|traspaso|identificaci[oó]n|administrativ/i.test(p);
export async function validateSources(){
 for(const js of ['app.js','theme.js','src/celescar.js','src/home.js','scripts/build.mjs','scripts/validate.mjs','scripts/preview.mjs']){
  const r=spawnSync(process.execPath,['--check',js],{encoding:'utf8'});assert.equal(r.status,0,js+': '+r.stderr);
 }
 const catalog=await json('data/catalogo.json'),media=await json('data/media.json'),site=await json('data/site.json'),deliveries=await json('data/entregas.json'),story=await json('data/historia.json');
 assert.equal(new Set(catalog.cars.map(c=>c.ref)).size,catalog.cars.length,'Duplicate vehicle references');
 assert.match(site.whatsapp,/^\d{10,15}$/);
 for(const c of catalog.cars){
  for(const key of Object.keys(c))assert(publicFields.has(key),'Non-public field: '+key);
  assert.match(c.ref,/^CC\d{3}$/);assert(media[c.ref],'Missing gallery '+c.ref);
  assert(c.price===null||(Number.isFinite(c.price)&&c.price>=0),'Invalid price '+c.ref);
 }
 // Visual acceptance checks for the approved V0.10 homepage changes.
 const home=await readFile('src/pages/index.html','utf8');
 const layout=await readFile('src/layout.html','utf8');
 const build=await readFile('scripts/build.mjs','utf8');
 const app=await readFile('app.js','utf8');
 const css=await readFile('styles.css','utf8');
 assert(!/AUTOMOTIVE EXPERIENCE|¿Qué quieres hacer\?/i.test(home),'Old homepage copy is still visible');
 assert(!/AUTOMOTIVE EXPERIENCE/.test(layout),'Old English tagline in header');
 assert(layout.includes('EXPERIENCIA AUTOMOTRIZ'),'Missing approved Spanish tagline');
 assert(build.includes('share-whatsapp')&&app.includes('api.whatsapp.com/send?text='),'Missing header WhatsApp sharing');
 assert(css.includes('body[data-page="home"] main{height:calc(100dvh - 76px)'),'Homepage is not bounded to viewport');
 assert(css.includes('.cinema-tab.is-active'),'Missing cinematic navigation styles');
 // V0.10 follow-up: mobile routes, catalog priority and section labels.
 const carPage=await readFile('src/pages/celescar.html','utf8');
 const carJs=await readFile('src/celescar.js','utf8');
 assert(home.includes('EXPERIENCIA AUTOMOTRIZ'),'Homepage tagline missing');
 assert((home.match(/role="tabpanel"/g)||[]).length===3,'Expected three cinematic scenes');
 assert(home.includes('href="/historia"')&&home.includes('href="/celescar"')&&home.includes('href="/celespaint"'),'Missing original navigation routes');
 assert(build.includes('src/home.js')&&build.includes('home.js?v=cinema1'),'Home module not included in build');
 assert((home.match(/<h1[\\s>]/g)||[]).length===1,'Homepage must keep one h1');
 assert(!home.includes('<i aria-hidden="true">↗</i>'),'Homepage cards must not contain arrows');
 assert(carPage.includes('<h2>Nuestros Servicios</h2>'),'Services heading incorrect');
 assert(carPage.includes('<h2>Proceso de venta</h2>'),'Sales process heading incorrect');
 assert((carPage.match(/<li><h3>/g)||[]).length===5,'Process must preserve five steps');
 assert(carPage.includes('class="button primary car-explore"'),'Mobile CTA styling hook missing');
 assert(css.includes('grid-auto-columns:clamp(270px,31%,420px)'),'Desktop catalog width not compacted');
 assert(css.includes('.process-section .process li:before'),'Process numbers not emphasized');
 assert(layout.includes('/app.js?v=0.10.2')&&carJs.includes("/app.js?v=0.10.2"),'Module version mismatch');

 const imagePaths=new Set([site.home.image,site.car.image,site.paint.image]);
 for(const [ref,m] of Object.entries(media)){
  assert.equal(new Set([m.cover,...m.gallery]).size,1+m.gallery.length,'Repeated path '+ref);
  [m.cover,...m.gallery].forEach(p=>imagePaths.add(p));
 }
 const ids=new Set();
 for(const d of deliveries.entregas){
  for(const k of ['id','vehiculo','marca','modelo','fecha','archivo_original','archivo_web','fuente','url_fuente','observacion','estado_publicacion'])assert(k in d,'Missing delivery field '+k);
  assert(!ids.has(d.id),'Duplicate delivery ID');ids.add(d.id);
  assert(['BORRADOR','REVISION','PUBLICADO'].includes(d.estado_publicacion),'Invalid publication state');
  if(d.estado_publicacion==='PUBLICADO'){assert(d.archivo_web&&d.vehiculo,'Incomplete delivery');imagePaths.add(d.archivo_web);}
 }
 for(const p of story.fotografias.filter(x=>x.estado_publicacion==='PUBLICADO'))imagePaths.add(p.archivo_web);
 if(story.video?.estado_publicacion==='PUBLICADO'){imagePaths.add(story.video.poster);assert(safe(story.video.archivo_web));await access(story.video.archivo_web);}
 for(const p of imagePaths){assert(safe(p),'Unsafe media path '+p);await access(p);}
 for(const p of [site.paint.video,'assets/logo-celesgroup.jpg']){assert(safe(p));await access(p);}
 for(const p of ['index','celescar','celespaint','historia']){
  const html=await readFile('src/pages/'+p+'.html','utf8');assert(!/RECOMENDADO/i.test(html),'Removed feature remains');
 }
 console.log('PASS: syntax, public data schema, references, publication states and source media');
}
export async function validateOutput(dir){
 const walk=async d=>(await Promise.all((await readdir(d,{withFileTypes:true})).map(async e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]))).flat();
 const files=await walk(dir);
 assert(!files.some(f=>/\.(pdf|xlsx?|docx|zip)$/i.test(f)),'Private document in output');
 for(const filename of files.filter(f=>f.endsWith('.html'))){
  const html=await readFile(filename,'utf8');
  assert(!/\{\{[A-Z_]+\}\}/.test(html),'Unresolved placeholder '+filename);
  if(!filename.includes(path.sep+'qa'+path.sep)){
   assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,'Exactly one h1 '+filename);
   assert(!/RECOMENDADO/i.test(html));
  }
  for(const match of html.matchAll(/(?:src|href|poster)="(\/[^"]*)"/g)){
   const p=match[1].split(/[?#]/)[0];
   const relative=p==='/'?'index.html':p.slice(1);
   const options=[relative,relative+'.html',relative+'/index.html'];
   assert(await Promise.any(options.map(async f=>{await access(path.join(dir,f));return true;})).catch(()=>false),'Missing link '+p+' in '+filename);
  }
 }
 console.log('PASS: four pages, heading structure, media links, no original/private documents in output');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await validateSources();
