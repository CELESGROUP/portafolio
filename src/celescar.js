import { share, toast } from '/app.js?v=0.10.2';
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const num = n => new Intl.NumberFormat('es-CO').format(n);
const money = n => Number.isFinite(n) ? new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n) : 'Precio por confirmar';
const value = x => x === null || x === undefined || x === '' ? 'Por confirmar' : String(x);
const normalize = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let cars=[], images={}, updatedAt='', site={}, current=null, activePhoto=0, trigger=null;
const dialog=$('#detail'), rail=$('#cars');
const date = s => /^\d{4}-\d{2}-\d{2}$/.test(s||'') ? s.split('-').reverse().join('/') : value(s);
function docDate(s) {
 if(/^\d{4}-\d{2}-\d{2}$/.test(s||'')) {
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Bogota'}).format(new Date());
  return date(s)+(s<today?' · Fecha vencida; confirmar renovación':'');
 }
 return /^N\/A/i.test(s||'') ? 'No aplica según vendedor · Por confirmar' : value(s);
}
function imageTag(path,alt,extra='') {
 const m=images[path];
 return '<img src="'+escapeHTML(path)+'" '+(m?'srcset="'+escapeHTML(m.srcset)+'" width="'+m.width+'" height="'+m.height+'" ':'')+'alt="'+escapeHTML(alt)+'" '+extra+'>';
}
function whatsapp(c) {
 const message='Hola CELESCAR, me interesa '+c.ref+' · '+c.brand+' '+c.line+' · modelo '+value(c.year)+' · versión '+value(c.version)+' · '+money(c.price)+'. ¿Sigue disponible?';
 return 'https://wa.me/'+site.whatsapp+'?text='+encodeURIComponent(message);
}
let activeQuickFilter='all';
const matchesFilter=(c,group)=>{
 const p=Number.isFinite(c.price)?c.price:null;
 switch(group){
  case 'auto':return normalize(c.box)==='automatica';
  case 'manual':return normalize(c.box)==='mecanica';
  case 'under50':return p!==null&&p<=50000000;
  case 'from50to90':return p!==null&&p>50000000&&p<=90000000;
  case 'above90':return p!==null&&p>90000000;
  default:return true;
 }
};
function updateQuickCounts(){
 document.querySelectorAll('[data-count]').forEach(el=>{
  const group=el.dataset.count, n=cars.filter(c=>matchesFilter(c,group)).length;
  el.textContent='('+n+')';
 });
}
function renderCars(){
 const query=normalize($('#search').value.trim());
 const choice=$('#sort').value;
 let filtered=cars.filter(c=>matchesFilter(c,activeQuickFilter)&&normalize([c.ref,c.brand,c.line,c.version,c.year].join(' ')).includes(query));
 // Keep vehicles without published prices at the end, never invent amounts.
 if(choice==='recent')filtered=[...filtered].sort((a,b)=>(b.year||0)-(a.year||0));
 else if(choice==='price-asc'||choice==='price-desc'){
  const direction=choice==='price-asc'?1:-1;
  filtered=[...filtered].sort((a,b)=>{
   const aOk=Number.isFinite(a.price),bOk=Number.isFinite(b.price);
   if(aOk!==bOk)return aOk?-1:1;
   return aOk&&bOk?direction*(a.price-b.price):0;
  });
 }
 $('#result-count').textContent=filtered.length+' vehículo'+(filtered.length===1?'':'s')+' disponible'+(filtered.length===1?'':'s');
 rail.innerHTML=filtered.length?filtered.map(c=>{
  const carRef=escapeHTML(c.ref), title=escapeHTML(c.brand+' '+c.line);
  const href='/celescar#vehiculo-'+carRef, chat=whatsapp(c);
  const year=escapeHTML(value(c.year)), gearbox=escapeHTML(value(c.box));
  const km=Number.isFinite(c.km)?escapeHTML(num(c.km)+' km'):'Por confirmar';
  return '<article class="car-card sales-car-card">'+
   '<a class="sales-card-primary" data-car="'+carRef+'" href="'+href+'" aria-label="Abrir ficha de '+title+' '+carRef+'">'+
    '<div class="car-photo">'+imageTag(c.cover,c.brand+' '+c.line+' · '+c.ref,'loading="lazy" decoding="async" draggable="false" sizes="(min-width:1200px) 31vw, (min-width:640px) 43vw, 84vw"')+
     '<span class="car-ref">'+carRef+'</span></div>'+
    '<div class="car-info"><h3>'+title+'</h3><p class="car-version">'+escapeHTML(c.version||'Versión por confirmar')+'</p>'+
     '<div class="sales-specs"><span><small>Modelo</small>'+year+'</span><span><small>Caja</small>'+gearbox+'</span><span><small>Recorrido</small>'+km+'</span></div>'+
     '<strong class="sales-price">'+money(c.price)+'</strong></div>'+
   '</a>'+
   '<div class="sales-card-actions"><a data-car="'+carRef+'" href="'+href+'">VER FICHA</a>'+
    '<a href="'+chat+'" target="_blank" rel="noopener noreferrer" aria-label="Consultar '+title+' por WhatsApp">WHATSAPP</a></div>'+
  '</article>';
 }).join(''):'<p class="empty-state">No hay vehículos que coincidan con la búsqueda. Prueba otro filtro.</p>';
 rail.scrollLeft=0;
 updateRailPosition(filtered.length);
}
function updateRailPosition(count){
 const first=rail.querySelector('.car-card');
 const total=count??rail.querySelectorAll('.car-card').length;
 const label=$('#rail-position');
 if(!label)return;
 if(!total){label.textContent='00 / 00';return;}
 const gap=parseFloat(getComputedStyle(rail).columnGap)||0;
 const step=(first?.getBoundingClientRect().width||rail.clientWidth)+gap;
 const index=Math.min(total,Math.max(1,Math.round(rail.scrollLeft/step)+1));
 label.textContent=String(index).padStart(2,'0')+' / '+String(total).padStart(2,'0');
}
const gallery=c=>[...new Set([c.cover,...(c.gallery||[])])];
function changePhoto(index) {
 if(!current)return;
 const photos=gallery(current); activePhoto=(index+photos.length)%photos.length;
 const main=$('#detail-main'), m=images[photos[activePhoto]];
 main.src=photos[activePhoto]; if(m)main.srcset=m.srcset;else main.removeAttribute('srcset');
 main.alt=current.brand+' '+current.line+' · fotografía '+(activePhoto+1)+' de '+photos.length;
 $('#gallery-count').textContent=(activePhoto+1)+' / '+photos.length;
 document.querySelectorAll('[data-photo]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===activePhoto)));
 const selected=document.querySelector('[data-photo="'+activePhoto+'"]');
 if(selected){ const row=selected.parentElement; row.scrollLeft=selected.offsetLeft-row.offsetLeft-(row.clientWidth-selected.clientWidth)/2; }
}
const specs=c=>[['Modelo',c.year],['Recorrido',Number.isFinite(c.km)?num(c.km)+' km':null],['Transmisión',c.box],['Motor',Number.isFinite(c.motor)?num(c.motor)+' cc':null],['Combustible',c.fuel],['Color',c.color],['Puertas',c.doors],['Matrícula · ciudad',c.registration]];
const documents=c=>[['SOAT · vencimiento',docDate(c.soat)],['Tecnomecánica · vencimiento',docDate(c.technical)],['Peritaje',c.inspection],['Pico y placa · dígito registrado',c.plateDigit],['Único dueño',c.oneOwner],['Precio negociable',c.negotiable],['Recibe retoma',c.tradeIn]];
const list=rows=>'<dl class="specs">'+rows.map(([k,v])=>'<div><dt>'+escapeHTML(k)+'</dt><dd>'+escapeHTML(value(v))+'</dd></div>').join('')+'</dl>';
function showDetail(ref) {
 const c=cars.find(x=>x.ref===ref); if(!c) {toast('Este vehículo no está disponible en la vitrina actual.');return;}
 current=c;activePhoto=0;trigger=document.activeElement;
 const photos=gallery(c), url=whatsapp(c);
 $('#detail-body').innerHTML='<p class="detail-reference">REFERENCIA / '+escapeHTML(c.ref)+'</p>'+
 '<div class="detail-gallery">'+imageTag(photos[0],c.brand+' '+c.line+' · fotografía 1 de '+photos.length,'id="detail-main" class="detail-main" sizes="(min-width:640px) 800px, 100vw"')+
 '<div class="gallery-controls"><button class="icon-button" id="photo-prev" aria-label="Foto anterior">←</button><span id="gallery-count" class="gallery-counter" role="status">1 / '+photos.length+'</span><button class="icon-button" id="photo-next" aria-label="Foto siguiente">→</button></div>'+
 '<div class="detail-thumbs" aria-label="Miniaturas">'+photos.map((path,i)=>'<button data-photo="'+i+'" aria-label="Ver foto '+(i+1)+'" aria-pressed="'+(i===0)+'">'+imageTag(images[path]?.thumb||path,'','loading="lazy" decoding="async" sizes="72px"')+'</button>').join('')+'</div></div>'+
 '<h2 id="detail-title">'+escapeHTML(c.brand+' '+c.line)+'</h2><p class="detail-version">'+escapeHTML(c.version||'Versión por confirmar')+'</p><strong class="detail-price">'+money(c.price)+'</strong>'+
 '<a class="button primary" href="'+url+'" target="_blank" rel="noopener">WhatsApp · Consultar ↗</a>'+
 '<p class="detail-lead">'+escapeHTML(c.pitch)+'</p>'+
 '<section class="detail-section"><h3>Características</h3>'+list(specs(c))+'</section>'+
 '<section class="detail-section"><h3>Documentación / condiciones</h3>'+list(documents(c))+'<p class="fineprint">Datos actualizados el '+date(updatedAt)+'. Confirma precio, disponibilidad, documentación y condiciones con el equipo antes de decidir.</p></section>'+
 '<a class="button primary" href="'+url+'" target="_blank" rel="noopener">Consultar este vehículo por WhatsApp ↗</a><button class="text-button detail-share" id="share-car">Compartir ficha ↗</button>';
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
 document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>changePhoto(Number(b.dataset.photo))));
 $('#photo-prev').onclick=()=>changePhoto(activePhoto-1);$('#photo-next').onclick=()=>changePhoto(activePhoto+1);
 $('#share-car').onclick=()=>share(c.brand+' '+c.line+' · '+c.ref,location.origin+'/celescar#vehiculo-'+c.ref);
 $('#detail-close').focus();
}
function routeDetail() {
 const match=location.hash.match(/^#vehiculo-(CC\d{3})$/);
 if(match)showDetail(match[1]);else if(dialog.open)dialog.close();
}
$('#detail-close').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>{if(location.hash.startsWith('#vehiculo-'))history.replaceState(null,'',location.pathname+location.search+'#portafolio');current=null;if(trigger instanceof HTMLElement&&trigger.isConnected)trigger.focus();});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
dialog.addEventListener('keydown',e=>{if(e.target.closest('.detail-gallery')&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();changePhoto(activePhoto+(e.key==='ArrowRight'?1:-1));}});
window.addEventListener('hashchange',routeDetail);
rail.addEventListener('click',e=>{const link=e.target.closest('[data-car]');if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();if(suppressClick){suppressClick=false;return;}history.pushState(null,'',link.getAttribute('href'));showDetail(link.dataset.car);});
let drag=null,suppressClick=false;
rail.addEventListener('dragstart',e=>e.preventDefault());
rail.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===0){drag={x:e.clientX,scroll:rail.scrollLeft,moved:false};suppressClick=false;}});
rail.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>9){drag.moved=true;rail.setPointerCapture(e.pointerId);rail.classList.add('dragging');rail.scrollLeft=drag.scroll-dx;}});
function endDrag(e){if(!drag)return;suppressClick=drag.moved;drag=null;rail.classList.remove('dragging');if(rail.hasPointerCapture(e.pointerId))rail.releasePointerCapture(e.pointerId);}
rail.addEventListener('pointerup',endDrag);rail.addEventListener('pointercancel',endDrag);rail.addEventListener('pointerleave',e=>{if(!rail.hasPointerCapture(e.pointerId))endDrag(e)});
rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();rail.scrollBy({left:rail.clientWidth*(e.key==='ArrowRight'?0.8:-0.8),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}});
$('#rail-prev').onclick=()=>rail.scrollBy({left:-rail.clientWidth*.8,behavior:'smooth'});
$('#rail-next').onclick=()=>rail.scrollBy({left:rail.clientWidth*.8,behavior:'smooth'});
document.querySelectorAll('.quick-filter').forEach(button=>button.addEventListener('click',()=>{
 activeQuickFilter=button.dataset.filter;
 document.querySelectorAll('.quick-filter').forEach(b=>{
  const active=b===button;
  b.classList.toggle('is-active',active);
  b.setAttribute('aria-pressed',String(active));
 });
 renderCars();
}));
$('#search').addEventListener('input',renderCars);
$('#sort').addEventListener('change',renderCars);
rail.addEventListener('scroll',()=>updateRailPosition(),{passive:true});
window.addEventListener('resize',()=>updateRailPosition(),{passive:true});
async function initialize() {
 try {
  const paths=['catalogo','media','images','site'];
  const data=await Promise.all(paths.map(async name=>{const r=await fetch('/data/'+name+'.json');if(!r.ok)throw new Error(name);return r.json();}));
  const [catalog,media,manifest,config]=data;images=manifest;site=config;updatedAt=catalog.updatedAt;
  cars=catalog.cars.filter(c=>c.status==='DISPONIBLE').map(c=>({...c,...media[c.ref]}));
  updateQuickCounts();
  renderCars();$('#catalog-date').textContent='Fotografías reales · Inventario actualizado el '+date(updatedAt)+'.';
  routeDetail();
 } catch { $('#result-count').textContent='Vitrina no disponible';rail.innerHTML='<div class="empty-state"><p>No pudimos cargar los vehículos.</p><button class="outline-button" id="retry">Volver a intentar</button></div>';$('#retry').onclick=initialize; }
}
initialize();
