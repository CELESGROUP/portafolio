import {readFile,writeFile,mkdir,copyFile,rm,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {validateSources,validateOutput} from './validate.mjs';
await validateSources();
const root=process.cwd(),out=path.resolve(root,'dist');
if(out!==path.join(root,'dist'))throw new Error('Invalid output directory');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const site=await read('data/site.json'),catalog=await read('data/catalogo.json'),media=await read('data/media.json'),deliveries=await read('data/entregas.json'),story=await read('data/historia.json');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const published=deliveries.entregas.filter(x=>x.estado_publicacion==='PUBLICADO');
const paths=new Set([site.home.image,site.car.image,site.paint.image,...Object.values(media).flatMap(x=>[x.cover,...x.gallery]),...published.map(x=>x.archivo_web),...story.fotografias.filter(x=>x.estado_publicacion==='PUBLICADO').map(x=>x.archivo_web)]);
if(story.video?.estado_publicacion==='PUBLICADO')paths.add(story.video.poster);
const manifest={},report=[];
for(const src of paths){
 const original=await readFile(src),hash=createHash('sha256').update(original).digest('hex');
 const metadata=await sharp(original).metadata();
 const variants=[];
 for(const width of [240,640,1280]){
  const target='assets/web/'+src.replace(/^assets\//,'').replace(/\.[^.]+$/,'')+'-'+width+'.webp';
  await mkdir(path.dirname(path.join(out,target)),{recursive:true});
  const info=await sharp(original).rotate().resize({width,withoutEnlargement:true}).webp({quality:width===240?68:80,effort:5}).toFile(path.join(out,target));
  variants.push({url:'/'+target,width:info.width,height:info.height,bytes:info.size});
 }
 const large=variants[2],record={src:large.url,thumb:variants[0].url,srcset:variants.map(v=>v.url+' '+v.width+'w').join(', '),width:large.width,height:large.height};
 manifest[src]=record;manifest[large.url]=record;
 report.push({source:src,sha256:hash,sourceBytes:original.length,width:metadata.width,height:metadata.height,variants});
}
const write=async(p,content)=>{await mkdir(path.dirname(path.join(out,p)),{recursive:true});await writeFile(path.join(out,p),content);};
const json=async(p,data)=>write(p,JSON.stringify(data,null,2)+'\n');
const image=(source,alt,extra='')=>{const m=manifest[source];return '<img src="'+m.src+'" srcset="'+m.srcset+'" width="'+m.width+'" height="'+m.height+'" alt="'+esc(alt)+'" '+extra+'>';};
const whatsapp=page=>'https://wa.me/'+site.whatsapp+'?text='+encodeURIComponent(page==='celespaint'?'Hola CELESPAINT, quiero solicitar una valoración para mi vehículo.':'Hola CELESCAR, quiero información sobre los vehículos y la financiación.');
const social='<div class="contact-links"><a href="'+site.instagram+'" target="_blank" rel="noopener"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>Instagram ↗</a><a href="'+site.facebook+'" target="_blank" rel="noopener"><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M14 22v-9h3l.5-4H14V7c0-1.2.3-2 2-2h2V1.3A25 25 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v9z"/></svg>Facebook ↗</a></div>';
const contact=page=>'<section id="contacto" class="section contact"><span class="eyebrow">HABLEMOS / '+(page==='celespaint'?'CELESPAINT':'CELESCAR')+'</span><h2>'+(page==='celespaint'?'Tu carro merece<br>una nueva mirada.':'Tu próximo carro.<br>A una conversación.')+'</h2><p>Cuéntanos qué tienes en mente. Nuestro equipo te acompaña en el siguiente paso.</p><a class="button primary" href="'+whatsapp(page)+'" target="_blank" rel="noopener">Conversemos por WhatsApp ↗</a><p class="contact-number">+57 315 326 0079 · Cali, Colombia</p>'+social+'</section>';
const deliveryHTML=published.length?'<div class="delivery-grid">'+published.map(x=>'<article class="delivery-card">'+image(x.archivo_web,x.vehiculo+' · entrega real','loading="lazy" sizes="(min-width:1000px) 30vw, 90vw"')+'<h3>'+esc(x.vehiculo)+'</h3><p>'+esc(x.fecha||'')+'</p></article>').join('')+'</div>':'<div class="empty-state"><h3>Pronto, nuevos comienzos para compartir.</h3><p>Estamos reuniendo las fotografías de nuestras entregas. Mientras tanto, conoce más de CELESCAR en nuestra comunidad.</p><a class="text-link" href="'+site.instagram+'" target="_blank" rel="noopener">Visítanos en Instagram ↗</a></div>';
const layout=await readFile('src/layout.html','utf8');
const navLinks=[['/celescar','CELESCAR'],['/celespaint','CELESPAINT'],['/historia','Nuestra historia']];
const pages=[['index','home','Inicio','Compra, venta y cuidado automotriz. Descubre CELESCAR, CELESPAINT y nuestra historia.'],['celescar','celescar','Encuentra tu próximo carro','Explora vehículos reales, conoce sus características y consulta con CELESCAR.'],['celespaint','celespaint','Renueva el que ya tienes','Valoración, lámina y pintura, embellecimiento, porcelanizado y restauración de farolas.'],['historia','historia','Nuestra historia','Conoce CELESGROUP y sus dos unidades: CELESCAR y CELESPAINT.']];
for(const [filename,page,title,description] of pages){
 const context=page==='celescar'?[['portafolio','Vehículos'],['entregas','Clientes felices'],['servicios','Servicios'],['proceso','Proceso']]:page==='celespaint'?[['servicios','Servicios'],['trabajos','Trabajos'],['proceso','Proceso']]:[];
 const variables={TITLE:title,DESCRIPTION:description,PAGE:page,
  NAV:(page==='home'?navLinks.filter(([href])=>href!=='/historia'):navLinks).map(([href,label])=>'<a href="'+href+'"'+(href==='/'+page?' aria-current="page"':'')+'>'+label+'</a>').join('')+(page==='home'?'<button type="button" class="share-whatsapp">Compartir</button>':'')+'<a href="'+(['celescar','celespaint'].includes(page)?'#contacto':whatsapp(page))+'">Contacto</a>',
  MOBILE_ACTION:page==='home'?'<button type="button" class="mobile-share share-whatsapp">Compartir</button>':'<a class="mobile-history" href="/historia">Historia</a>',
  CONTEXT:context.map(([id,label])=>'<a href="/'+page+'#'+id+'">'+label+'</a>').join(''),
  WHATSAPP:whatsapp(page),INSTAGRAM:site.instagram,FACEBOOK:site.facebook,
  HOME_IMAGE:image(site.home.image,site.home.alt,'fetchpriority="high" sizes="(min-width:1000px) 76vw, 100vw"'),
  CAR_IMAGE:image(site.car.image,site.car.alt,'fetchpriority="high" sizes="(min-width:1000px) 56vw, 100vw"'),
  PAINT_IMAGE:image(site.paint.image,site.paint.alt,'fetchpriority="high" sizes="(min-width:1000px) 56vw, 100vw"'),
  PAINT_POSTER:manifest[site.paint.image].src,DELIVERIES:deliveryHTML,CONTACT:contact(page),
  ORIGIN:story.origen?.estado_publicacion==='PUBLICADO'?'<p>'+esc(story.origen.texto)+'</p>':'<p class="story-pending">Estamos preparando el relato de nuestros primeros pasos. Pronto podrás conocerlo aquí.</p>',
  HISTORY_VIDEO:story.video?.estado_publicacion==='PUBLICADO'?'<video controls playsinline preload="none" poster="'+manifest[story.video.poster].src+'"><source src="/'+esc(story.video.archivo_web)+'" type="video/mp4"></video>':'<p class="story-pending">Nuestro video de historia estará disponible próximamente.</p>',
  HISTORY_IMAGES:story.fotografias.filter(x=>x.estado_publicacion==='PUBLICADO').map(x=>'<figure>'+image(x.archivo_web,x.descripcion,'loading="lazy" sizes="80vw"')+'<figcaption>'+esc(x.descripcion)+'</figcaption></figure>').join('')||'<p class="story-pending">Estamos reuniendo las fotografías de nuestra evolución.</p>',
  SCRIPT:page==='celescar'?'<script type="module" src="/celescar.js?v=0.10.0"></script>':''};
 let content=await readFile('src/pages/'+filename+'.html','utf8');
 const fill=s=>s.replace(/\{\{([A-Z_]+)\}\}/g,(_,k)=>{if(!(k in variables))throw new Error('Unknown template '+k);return variables[k];});
 content=fill(content);variables.CONTENT=content;
 await write(filename+'.html',fill(layout));
}
const publicMedia=Object.fromEntries(Object.entries(media).map(([ref,m])=>[ref,{cover:manifest[m.cover].src,gallery:m.gallery.map(p=>manifest[p].src)}]));
await json('data/catalogo.json',catalog);await json('data/media.json',publicMedia);await json('data/images.json',manifest);
await json('data/site.json',{whatsapp:site.whatsapp,instagram:site.instagram,facebook:site.facebook});
await json('data/entregas.json',{version:deliveries.version,entregas:published.map(({id,vehiculo,marca,modelo,fecha,archivo_web})=>({id,vehiculo,marca,modelo,fecha,archivo_web:manifest[archivo_web].src}))});
for(const p of ['styles.css','app.js','theme.js','assets/logo-celesgroup.jpg','assets/porcelanizado.mp4']){
 await mkdir(path.dirname(path.join(out,p)),{recursive:true});await copyFile(p,path.join(out,p));
}
await copyFile('src/celescar.js',path.join(out,'celescar.js'));
if(story.video?.estado_publicacion==='PUBLICADO'){const p=story.video.archivo_web;await mkdir(path.dirname(path.join(out,p)),{recursive:true});await copyFile(p,path.join(out,p));}
await write('404.html','<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Página no encontrada · CELESGROUP</title><link rel="stylesheet" href="/styles.css"><main class="section"><span class="eyebrow">CELESGROUP / 404</span><h1>Este camino<br>no está disponible.</h1><a class="button primary" href="/">Volver al inicio ↗</a></main></html>');
// Preview-only visual audit sheets, generated from public media already in the repository.
if(process.env.VERCEL_ENV!=='production'){
 await json('qa/image-report.json',report);
 for(const [ref,m] of Object.entries(media)){
  const all=[m.cover,...m.gallery];
  await write('qa/'+ref+'.html','<!doctype html><html lang="es"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Auditoría '+ref+'</title><style>body{font:14px Arial;background:#12171c;color:white;margin:24px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}figure{margin:0}img{width:100%;height:230px;object-fit:contain;background:#090b0d}figcaption{padding:8px;font-size:11px}a{color:#b8d9dc;margin-right:12px}</style><h1>'+ref+' · '+esc(catalog.cars.find(c=>c.ref===ref)?.brand)+' '+esc(catalog.cars.find(c=>c.ref===ref)?.line)+'</h1><nav>'+Object.keys(media).map(r=>'<a href="/qa/'+r+'">'+r+'</a>').join('')+'</nav><main>'+all.map((src,i)=>'<figure>'+image(src,ref+' foto '+i,'sizes="400px"')+'<figcaption>'+i+' · '+src+'</figcaption></figure>').join('')+'</main></html>');
 }
}
await validateOutput(out);
const originalBytes=report.reduce((n,r)=>n+r.sourceBytes,0),largeBytes=report.reduce((n,r)=>n+r.variants[2].bytes,0);
console.log(JSON.stringify({version:'0.10.0',routes:pages.map(p=>p[0]),vehicles:catalog.cars.length,publicDeliveries:published.length,images:report.length,originalBytes,largeWebpBytes:largeBytes,reductionPercent:Math.round((1-largeBytes/originalBytes)*100),qa:'source/output validation passed'}));
