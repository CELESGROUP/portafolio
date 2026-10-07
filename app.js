const photos=(ref,order=[1,2,3,4,5])=>order.map(i=>`assets/cars/${ref.toLowerCase()}-${String(i).padStart(2,'0')}.webp`);
const jpgPhotos=(ref,count)=>Array.from({length:count},(_,i)=>`assets/cars/${ref.toLowerCase()}-${String(i+1).padStart(2,'0')}.jpg`);

const cars=[
{ref:'CC012',featured:true,brand:'MINI',line:'Cooper',version:'',year:2011,box:'Mecánica',km:null,motor:null,price:null,cover:'assets/cars/covers/cc012.jpg',gallery:['assets/cars/cc012-01.jpg','assets/cars/cc012-02.jpg','assets/cars/cc012-03.jpg','assets/cars/cc012-04.jpg','assets/cars/cc012-05.jpg','assets/cars/cc012-06.jpg','assets/cars/cc012-07.jpg','assets/cars/cc012-08.jpg'],pitch:'Un MINI con identidad propia: diseño clásico, techo negro, gráficos laterales de inspiración británica e interior azul que lo hacen difícil de pasar por alto. Una opción para quien busca un compacto con estilo y mucha personalidad.'},
{ref:'CC001',brand:'Mazda',line:'2',version:'Grand Touring LX',year:2024,box:'Automática',km:45000,motor:1500,price:77500000,cover:'assets/cars/covers/cc001.jpg',gallery:photos('CC001',[4,5,1,2,3]),pitch:'Versión Grand Touring LX, caja automática y un formato compacto para moverte con comodidad todos los días.'},
{ref:'CC003',brand:'Chevrolet',line:'Joy',version:'',year:2023,box:'Mecánica',km:39000,motor:1400,price:47500000,cover:'assets/cars/covers/cc003.jpg',gallery:photos('CC003',[2,4,1,3,5]),pitch:'Modelo 2023 con caja mecánica: una opción práctica para quien prioriza sencillez y funcionalidad.'},
{ref:'CC002',brand:'Kia',line:'Picanto',version:'Emotion',year:2018,box:'Mecánica',km:135000,motor:1000,price:42900000,cover:'assets/cars/covers/cc002.jpg',gallery:jpgPhotos('CC002',12),pitch:'Un compacto ágil y sencillo de usar, con caja mecánica y tamaño ideal para el ritmo urbano.'},
{ref:'CC004',brand:'Kia',line:'Picanto',version:'Zenith',year:2020,box:'Mecánica',km:85000,motor:1250,price:46900000,cover:'assets/cars/covers/cc004.jpg',gallery:photos('CC004',[2,4,5,1,3]),pitch:'Picanto Zenith con motor 1.250 cc y caja mecánica: compacto, fácil de llevar y con personalidad.'},
{ref:'CC005',brand:'Subaru',line:'Forester',version:'Premium 4x4',year:2017,box:'Automática',km:106000,motor:2000,price:78900000,cover:'assets/cars/covers/cc005.jpg',gallery:photos('CC005',[2,3,1,4,5]),pitch:'Forester Premium 4x4: espacio, tracción y versatilidad para quien busca una SUV preparada para distintos caminos.'},
{ref:'CC006',brand:'Kia',line:'Sportage',version:'Desire',year:2019,box:'Automática',km:78000,motor:2000,price:89500000,cover:'assets/cars/covers/cc006.jpg',gallery:photos('CC006',[3,5,2,4,1]),pitch:'Sportage Desire automática: una SUV con buen espacio y una configuración cómoda para uso diario y viajes.'},
{ref:'CC007',brand:'Suzuki',line:'Grand Vitara',version:'Híbrida',year:2024,box:'Automática',km:12000,motor:1500,price:108900000,cover:'assets/cars/covers/cc007.jpg',gallery:photos('CC007',[5,4,2,3,1]),pitch:'Grand Vitara híbrida 2024 y automática: una combinación moderna para quien quiere dar el salto a una SUV electrificada.'},
{ref:'CC008',brand:'Mazda',line:'CX-5',version:'Touring',year:2019,box:'Automática',km:85000,motor:2500,price:90900000,cover:'assets/cars/covers/cc008.jpg',gallery:photos('CC008',[5,2,3,1,4]),pitch:'CX-5 Touring automática con motor 2.5 L: una SUV de diseño sobrio y configuración versátil para ciudad y carretera.'},
{ref:'CC009',brand:'Audi',line:'Q3 Sportback',version:'',year:2024,box:'Automática',km:38000,motor:2000,price:124900000,cover:'assets/cars/covers/cc009.jpg',gallery:photos('CC009',[3,2,5,1,4]),pitch:'Q3 Sportback 2024: diseño deportivo, caja automática y una presencia claramente premium.'},
{ref:'CC010',brand:'Mazda',line:'CX-30',version:'Grand Touring LX híbrida',year:2025,box:'Automática',km:45000,motor:2000,price:118900000,cover:'assets/cars/covers/cc010.jpg',gallery:jpgPhotos('CC010',10),pitch:'CX-30 Grand Touring LX híbrida: diseño Mazda, caja automática y tecnología híbrida en un formato SUV compacto.'},
{ref:'CC011',brand:'Chevrolet',line:'Tracker',version:'Turbo LS',year:2021,box:'Mecánica',km:36000,motor:1200,price:61900000,cover:'assets/cars/covers/cc011.jpg',gallery:jpgPhotos('CC011',6),pitch:'Tracker Turbo LS: formato SUV, motor turbo y caja mecánica para quien busca una alternativa compacta con carácter.'}
];

const paintServices=[
 {name:'Lámina y pintura',copy:'Reparación y acabado de carrocería definidos después de una valoración técnica del vehículo.'},
 {name:'Enlucimiento',copy:'Cuidado exterior orientado a recuperar presencia, brillo y detalle con alcance previamente acordado.'},
 {name:'Porcelanizado',copy:'Proceso de acabado y protección exterior presentado con evidencia real del trabajo realizado.'}
];

const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);
const num=n=>new Intl.NumberFormat('es-CO').format(n);
let mode='car';

const priceText=c=>Number.isFinite(c.price)?money(c.price):'Precio por confirmar';
const kmText=c=>Number.isFinite(c.km)?`${num(c.km)} km`:'Kilometraje por confirmar';
const motorText=c=>Number.isFinite(c.motor)?`${num(c.motor)} cc`:'Motor por confirmar';
const galleryFor=c=>[c.cover,...(c.gallery||[]).filter(x=>x!==c.cover)];

function activeFilterCount(){
 return [$('#search').value.trim(),$('#transmission').value,$('#price').value].filter(Boolean).length;
}
function updateFilterUI(){
 const n=activeFilterCount();
 $('#filter-toggle span:first-child').textContent=n?`Buscar / filtrar · ${n}`:'Buscar / filtrar';
}

function renderFeatured(){
 if(mode==='paint'){
  $('#featured-content').innerHTML=`
   <div class="featured-grid paint-feature">
    <div class="featured-copy">
     <div class="eyebrow">RECOMENDADO / CELESPAINT</div>
     <h1>El detalle cambia<br><em>la experiencia.</em></h1>
     <p>Una muestra real de porcelanizado y cuidado exterior. El alcance de cada trabajo se define después de valorar el vehículo.</p>
     <div class="featured-meta"><span>Valoración previa</span><span>Proceso documentado</span><span>Entrega revisada</span></div>
    </div>
    <div class="featured-stage video-stage">
     <video controls playsinline muted autoplay loop preload="metadata" poster="assets/porcelanizado-poster.webp?v=3">
      <source src="assets/porcelanizado.mp4" type="video/mp4">
     </video>
     <div class="featured-shade"></div>
     <span class="featured-badge">CELESPAINT / EN ACCIÓN</span>
    </div>
   </div>`;
  return;
 }
 const c=cars.find(x=>x.featured)||cars[0];
 const imgs=galleryFor(c).slice(0,3);
 $('#featured-content').innerHTML=`
  <article class="featured-grid featured-car" data-featured-car="${c.ref}" tabindex="0" aria-label="Abrir ficha de ${c.brand} ${c.line}">
   <div class="featured-copy">
    <div class="eyebrow">RECOMENDADO</div>
    <h1>${c.brand} ${c.line}<br><em>${c.year}</em></h1>
    <p>${c.pitch}</p>
    <div class="featured-meta"><span>${c.box||'Caja por confirmar'}</span><span>${kmText(c)}</span><span>${priceText(c)}</span></div>
   </div>
   <div class="featured-stage">
    ${imgs.map((src,i)=>`<img src="${src}" alt="${c.brand} ${c.line}, fotografía ${i+1}" class="featured-slide slide-${i+1}" draggable="false">`).join('')}
    <div class="featured-shade"></div>
    <span class="featured-badge">SELECCIÓN CELESGROUP</span>
    <div class="featured-caption"><strong>${c.brand} ${c.line}</strong><span>${c.ref} · ${c.version||'Versión por confirmar'}</span></div>
   </div>
  </article>`;
 const card=document.querySelector('[data-featured-car]');
 card?.addEventListener('click',()=>showDetail(c.ref));
 card?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showDetail(c.ref)}});
}

function renderCars(){
 const q=$('#search').value.toLowerCase().trim();
 const box=$('#transmission').value;
 const limit=Number($('#price').value)||Infinity;
 const filtered=cars.filter(c=>(`${c.brand} ${c.line} ${c.version||''} ${c.year} ${c.ref}`.toLowerCase().includes(q))&&(!box||c.box===box)&&(limit===Infinity||(Number.isFinite(c.price)&&c.price<=limit)));
 $('#result-count').textContent=`${filtered.length} vehículos`;
 $('#cars').innerHTML=filtered.length?filtered.map(c=>`
  <article class="car-card" data-car="${c.ref}" tabindex="0" aria-label="Abrir ficha de ${c.brand} ${c.line}">
   <div class="car-photo">
    <img src="${c.cover}" loading="lazy" draggable="false" alt="${c.brand} ${c.line}, fotografía real del vehículo">
    <div class="card-shade"></div>
    <span class="ref">${c.ref}</span>
    ${c.featured?'<span class="new-badge">RECOMENDADO</span>':''}
    <div class="card-overlay">
     <div class="card-kicker">${c.year} · ${c.box||'Caja por confirmar'}</div>
     <h3>${c.brand} ${c.line}</h3>
     <p>${c.version||''}</p>
     <div class="overlay-footer"><strong>${priceText(c)}</strong></div>
    </div>
   </div>
  </article>`).join(''):'<p class="empty-results">No hay vehículos que coincidan. Prueba otros filtros.</p>';
 updateFilterUI();
}

function renderPaintServices(){
 $('#paint-services').innerHTML=paintServices.map(s=>`
  <article class="service-card" data-service="${s.name}" tabindex="0">
   <span class="service-line"></span>
   <h3>${s.name}</h3>
   <p>${s.copy}</p>
  </article>`).join('');
 document.querySelectorAll('[data-service]').forEach(card=>{
   const open=()=>showService(card.dataset.service);
   card.onclick=open;
   card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}};
 });
}

function renderHistory(){
 if(mode==='car'){
  $('#history-content').innerHTML=`
   <div class="history-empty">
    <div class="history-mark"></div>
    <div>
     <span>ARCHIVO CELESCAR</span>
     <h3>Las primeras entregas verificadas aparecerán aquí.</h3>
     <p>La carpeta de vehículos vendidos aún no contiene casos validados para publicación. Preferimos mostrar menos y mantener la trazabilidad de cada historia.</p>
    </div>
   </div>`;
 }else{
  $('#history-content').innerHTML=`
   <div class="history-empty">
    <div class="history-mark copper"></div>
    <div>
     <span>ARCHIVO CELESPAINT</span>
     <h3>El antes, el proceso y el resultado.</h3>
     <p>Este espacio quedará reservado para trabajos terminados con fotografías autorizadas y alcance técnico verificado.</p>
    </div>
   </div>`;
 }
}

function renderProcess(){
 const carSteps=[
  ['Conoce el vehículo','Fotografías reales, características disponibles y datos pendientes claramente identificados.'],
  ['Revisa y decide','Acompañamiento para validar condiciones, resolver dudas y entender la negociación.'],
  ['Formaliza con claridad','Documentación y condiciones comerciales revisadas antes del cierre.'],
  ['Recibe y sigue rodando','Entrega, cierre de la operación y continuidad del acompañamiento.']
 ];
 const paintSteps=[
  ['Valoración','Revisión del vehículo para definir necesidades reales antes de intervenir.'],
  ['Cotización','Alcance, precio y tiempo acordados antes de comenzar el trabajo.'],
  ['Trabajo documentado','Ejecución con seguimiento y evidencia del proceso cuando corresponda.'],
  ['Revisión y entrega','Control final del resultado antes de devolver el vehículo.']
 ];
 const steps=mode==='car'?carSteps:paintSteps;
 $('#process-title').textContent=mode==='car'?'Un proceso claro de principio a fin':'Cuidado con criterio y trazabilidad';
 $('#process-description').textContent=mode==='car'?'Queremos que cada decisión tenga información, acompañamiento y trazabilidad.':'Cada intervención comienza con una valoración y termina con una revisión del resultado.';
 $('#process-steps').innerHTML=steps.map(([title,copy])=>`
  <article><span class="process-dot"></span><h3>${title}</h3><p>${copy}</p></article>`).join('');
}

function applyTheme(theme){
 const selected=theme==='light'?'light':'dark';
 document.documentElement.dataset.theme=selected;
 document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===selected)));
 try{localStorage.setItem('celes-theme',selected)}catch(e){}
}

function switchMode(next){
 mode=next;
 document.body.classList.toggle('paint-mode',next==='paint');
 document.querySelectorAll('[data-mode]').forEach(b=>{const active=b.dataset.mode===next;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1});
 $('#car-portfolio').hidden=next!=='car';
 $('#paint-portfolio').hidden=next!=='paint';
 $('#portfolio-eyebrow').textContent=next==='car'?'PORTAFOLIO':'SERVICIOS';
 $('#portfolio-title').textContent=next==='car'?'Vehículos que merecen ser vistos con calma':'Cuidado que también merece ser visto con calma';
 $('#portfolio-description').textContent=next==='car'?'Explora nuestro portafolio y conoce cada referencia en detalle.':'Conoce las líneas de trabajo que estamos estructurando para CELESPAINT.';
 $('#history-eyebrow').textContent=next==='car'?'ENTREGAS HISTÓRICAS':'TRABAJOS HISTÓRICOS';
 $('#history-title').textContent=next==='car'?'Historias que siguen rodando':'Resultados que merecen quedar';
 $('#history-description').textContent=next==='car'?'Un archivo de entregas reales, publicado únicamente con evidencia validada.':'Un archivo de trabajos reales, publicado únicamente con evidencia autorizada.';
 renderFeatured();
 renderHistory();
 renderProcess();
 history.replaceState(null,'',`#${next==='car'?'celescar':'celespaint'}`);
}

function showDetail(ref){
 const c=cars.find(x=>x.ref===ref);if(!c)return;
 const gallery=galleryFor(c);
 $('#detail-body').innerHTML=`
  <div class="eyebrow">CELESCAR / ${c.ref}</div>
  <div class="detail-gallery">
   <img id="detail-main" class="detail-img" src="${gallery[0]}" alt="${c.brand} ${c.line}, foto real 1 de ${gallery.length}">
   <div class="detail-thumbs">${gallery.map((src,i)=>`<button class="${i===0?'active':''}" data-photo="${src}" data-alt="${c.brand} ${c.line}, foto real ${i+1} de ${gallery.length}" aria-label="Ver foto ${i+1}"><img src="${src}" alt="" loading="lazy"></button>`).join('')}</div>
  </div>
  <div class="detail-title-row"><div><h2>${c.brand} ${c.line}</h2><p>${c.version||'Versión por confirmar'}</p></div><strong>${priceText(c)}</strong></div>
  <p class="detail-lead">${c.pitch}</p>
  <div class="detail-specs"><span>Modelo: ${c.year}</span><span>Recorrido: ${kmText(c)}</span><span>Caja: ${c.box||'Por confirmar'}</span><span>Motor: ${motorText(c)}</span></div>
  <p class="detail-text">Fotografías reales del vehículo. Precio, disponibilidad, documentación y cualquier dato marcado como “por confirmar” deben validarse con el equipo antes de tomar una decisión.</p>
  <div class="detail-actions"><a class="primary" href="https://www.instagram.com/celes.group/" target="_blank" rel="noopener">Contactar al equipo</a><button class="ghost" id="share-car">Compartir ficha</button></div>`;
 $('#detail').showModal();
 document.querySelectorAll('[data-photo]').forEach(b=>b.onclick=()=>{const main=$('#detail-main');main.src=b.dataset.photo;main.alt=b.dataset.alt;document.querySelectorAll('[data-photo]').forEach(x=>x.classList.toggle('active',x===b))});
 $('#share-car').onclick=()=>share(`${c.brand} ${c.line} · ${c.ref} · CELESGROUP`,`${location.origin}${location.pathname}#vehiculo-${ref}`);
}

function showService(name){
 const service=paintServices.find(s=>s.name===name);
 $('#detail-body').innerHTML=`
  <div class="eyebrow">CELESPAINT / SERVICIO</div>
  <h2>${service?.name||name}</h2>
  <p class="detail-lead">${service?.copy||''}</p>
  <p class="detail-text">Primero se valora el vehículo; luego se define alcance, precio y tiempo. La publicación de trabajos históricos se realizará únicamente con evidencia autorizada.</p>
  <a class="primary" href="https://www.instagram.com/celes.group/" target="_blank" rel="noopener">Conocer al equipo</a>`;
 $('#detail').showModal();
}

function toast(t){
 $('#toast').textContent=t;
 $('#toast').style.display='block';
 clearTimeout(window.__toastTimer);
 window.__toastTimer=setTimeout(()=>$('#toast').style.display='none',3800);
}
async function share(title='CELESGROUP · Portafolio',url=location.href){
 try{
  if(navigator.share)await navigator.share({title,url});
  else if(navigator.clipboard){await navigator.clipboard.writeText(url);toast('Enlace copiado para compartir')}
  else toast('Copia la dirección de esta página para compartir');
 }catch(e){if(e.name!=='AbortError')toast('Puedes copiar el enlace desde la barra de dirección')}
}

let savedTheme='dark';
try{savedTheme=localStorage.getItem('celes-theme')||'dark'}catch(e){}
applyTheme(savedTheme);
document.querySelectorAll('[data-theme-choice]').forEach(b=>b.onclick=()=>applyTheme(b.dataset.themeChoice));

document.querySelectorAll('[data-mode]').forEach(b=>{
 b.onclick=()=>switchMode(b.dataset.mode);
 b.onkeydown=e=>{
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
   e.preventDefault();
   const next=mode==='car'?'paint':'car';
   switchMode(next);
   $('#tab-'+next).focus();
  }
 };
});

$('#filter-toggle').onclick=()=>{
 const panel=$('#filter-panel');
 const open=panel.hidden;
 panel.hidden=!open;
 $('#filter-toggle').setAttribute('aria-expanded',String(open));
 $('.filter-icon').textContent=open?'−':'＋';
 if(open)$('#search').focus();
};
['search','transmission','price'].forEach(id=>$('#'+id).addEventListener(id==='search'?'input':'change',renderCars));
$('#clear-filters').onclick=()=>{$('#search').value='';$('#transmission').value='';$('#price').value='';renderCars();};

const rail=$('#cars');
let dragActive=false,startX=0,startScroll=0,dragDistance=0,suppressClickUntil=0;
rail.addEventListener('dragstart',e=>e.preventDefault());
rail.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 dragActive=true;startX=e.clientX;startScroll=rail.scrollLeft;dragDistance=0;
 rail.classList.add('is-dragging');
 rail.setPointerCapture?.(e.pointerId);
});
rail.addEventListener('pointermove',e=>{
 if(!dragActive)return;
 const dx=e.clientX-startX;
 dragDistance=Math.max(dragDistance,Math.abs(dx));
 if(dragDistance>4)rail.scrollLeft=startScroll-dx;
});
function endDrag(e){
 if(!dragActive)return;
 dragActive=false;
 rail.classList.remove('is-dragging');
 if(dragDistance>9)suppressClickUntil=performance.now()+350;
 try{rail.releasePointerCapture?.(e.pointerId)}catch(_){}
}
rail.addEventListener('pointerup',endDrag);
rail.addEventListener('pointercancel',endDrag);
rail.onclick=e=>{
 if(performance.now()<suppressClickUntil)return;
 const card=e.target.closest('.car-card[data-car]');
 if(card)showDetail(card.dataset.car);
};
rail.addEventListener('keydown',e=>{
 const card=e.target.closest('.car-card[data-car]');
 if(card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();showDetail(card.dataset.car)}
});

document.querySelectorAll('.share').forEach(b=>b.onclick=()=>share());
$('#whatsapp-contact').onclick=()=>toast('El número oficial de WhatsApp de CELESGROUP está pendiente de validación.');
$('.close').onclick=()=>$('#detail').close();
$('#detail').onclick=e=>{
 if(e.target===$('#detail')){
  const r=e.target.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();
 }
};

renderCars();
renderPaintServices();
renderFeatured();
renderHistory();
renderProcess();

if(location.hash==='#celespaint')switchMode('paint');
if(location.hash.startsWith('#vehiculo-')){
 const ref=location.hash.replace('#vehiculo-','');
 if(cars.some(c=>c.ref===ref))showDetail(ref);
}
