const photos=(ref,order=[1,2,3,4,5])=>order.map(i=>`assets/cars/${ref.toLowerCase()}-${String(i).padStart(2,'0')}.webp`);
const jpgPhotos=(ref,count)=>Array.from({length:count},(_,i)=>`assets/cars/${ref.toLowerCase()}-${String(i+1).padStart(2,'0')}.jpg`);

const cars=[
{ref:'CC012',brand:'MINI',line:'Cooper',version:'',year:2011,box:'Mecánica',km:null,motor:null,price:null,cover:'assets/cars/covers/cc012.jpg',gallery:['assets/cars/cc012-01.jpg','assets/cars/cc012-02.jpg','assets/cars/cc012-03.jpg','assets/cars/cc012-04.jpg','assets/cars/cc012-05.jpg','assets/cars/cc012-06.jpg','assets/cars/cc012-07.jpg','assets/cars/cc012-08.jpg'],pitch:'Un MINI con identidad propia: diseño clásico, techo negro, gráficos laterales de inspiración británica e interior azul que lo hacen difícil de pasar por alto. Una opción para quien busca un compacto con estilo y mucha personalidad.'},
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

function renderCars(){
 const q=$('#search').value.toLowerCase().trim();
 const box=$('#transmission').value;
 const limit=Number($('#price').value)||Infinity;
 const filtered=cars.filter(c=>(`${c.brand} ${c.line} ${c.version||''} ${c.year} ${c.ref}`.toLowerCase().includes(q))&&(!box||c.box===box)&&(limit===Infinity||(Number.isFinite(c.price)&&c.price<=limit)));
 $('#result-count').textContent=`${filtered.length} vehículos`;
 $('#cars').innerHTML=filtered.length?filtered.map(c=>`
  <article class="car-card" data-car="${c.ref}" tabindex="0" aria-label="Abrir ficha de ${c.brand} ${c.line}">
   <div class="car-photo">
    <img src="${c.cover}" loading="lazy" alt="${c.brand} ${c.line}, fotografía real del vehículo">
    <div class="card-shade"></div>
    <span class="ref">${c.ref}</span>
    ${c.ref==='CC012'?'<span class="new-badge">NUEVO INGRESO</span>':''}
    <div class="card-overlay">
     <div class="card-kicker">${c.year} · ${c.box||'Caja por confirmar'}</div>
     <h3>${c.brand} ${c.line}</h3>
     <p>${c.version||''}</p>
     <div class="overlay-footer"><strong>${priceText(c)}</strong><span>Ver ficha</span></div>
    </div>
   </div>
  </article>`).join(''):'<p class="empty-results">No hay vehículos que coincidan. Prueba otros filtros.</p>';
 updateFilterUI();
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
 $('#panel-car').hidden=next!=='car';
 $('#panel-paint').hidden=next!=='paint';
 $('#hero-label').textContent=next==='car'?'CELESCAR / PORTAFOLIO':'CELESPAINT / EXPERIENCIA';
 $('#hero-title').textContent=next==='car'?'Vehículos que merecen ser vistos con calma':'El cuidado también merece ser visto con calma';
 $('#hero-description').textContent=next==='car'?'Explora nuestro portafolio y conoce cada referencia en detalle.':'Conoce nuestros procesos de cuidado, reparación y renovación del vehículo.';
 history.replaceState(null,'',`#${next==='car'?'celescar':'celespaint'}`);
}

function renderHistory(type){
 document.querySelectorAll('[data-history]').forEach(b=>{b.classList.toggle('active',b.dataset.history===type);b.setAttribute('aria-pressed',b.dataset.history===type)});
 $('#history-content').innerHTML=`<div><span class="empty-label">ARCHIVO ${type==='ventas'?'CELESCAR':'CELESPAINT'}</span><h3>${type==='ventas'?'Cada entrega, una historia.':'El antes. El proceso. El resultado.'}</h3><p>${type==='ventas'?'Aquí reuniremos vehículos entregados con su referencia, fecha y fotografías autorizadas.':'Aquí reuniremos trabajos terminados, fotografías del proceso y su alcance real.'}</p><span class="tag">Aún no hay casos históricos validados</span></div><div class="record-fields">${(type==='ventas'?['Referencia del vehículo','Fecha de entrega','Galería autorizada','Historia de la entrega']:['Referencia del trabajo','Servicio realizado','Antes y después','Fecha de entrega']).map(s=>`<span>${s}</span>`).join('')}</div>`;
}

function showDetail(ref){
 const c=cars.find(x=>x.ref===ref);if(!c)return;
 const gallery=galleryFor(c);
 $('#detail-body').innerHTML=`<div class="eyebrow">CELESCAR / ${c.ref}</div><div class="detail-gallery"><img id="detail-main" class="detail-img" src="${gallery[0]}" alt="${c.brand} ${c.line}, foto real 1 de ${gallery.length}"><div class="detail-thumbs">${gallery.map((src,i)=>`<button class="${i===0?'active':''}" data-photo="${src}" data-alt="${c.brand} ${c.line}, foto real ${i+1} de ${gallery.length}" aria-label="Ver foto ${i+1}"><img src="${src}" alt="" loading="lazy"></button>`).join('')}</div></div><div class="detail-title-row"><div><h2>${c.brand} ${c.line}</h2><p>${c.version||'Versión por confirmar'}</p></div><strong>${priceText(c)}</strong></div><p class="detail-lead">${c.pitch}</p><div class="detail-specs"><span>Modelo: ${c.year}</span><span>Recorrido: ${kmText(c)}</span><span>Caja: ${c.box||'Por confirmar'}</span><span>Motor: ${motorText(c)}</span></div><p class="detail-text">Fotografías reales del vehículo. Precio, disponibilidad, documentación y cualquier dato marcado como “por confirmar” deben validarse con el equipo antes de tomar una decisión.</p><p class="detail-text">Consulta al equipo mencionando la referencia <b>${c.ref}</b>.</p><div class="detail-actions"><a class="primary" href="https://www.instagram.com/celes.group/" target="_blank" rel="noopener">Quiero saber más</a><button class="ghost" id="share-car">Compartir ficha</button></div>`;
 $('#detail').showModal();
 document.querySelectorAll('[data-photo]').forEach(b=>b.onclick=()=>{const main=$('#detail-main');main.src=b.dataset.photo;main.alt=b.dataset.alt;document.querySelectorAll('[data-photo]').forEach(x=>x.classList.toggle('active',x===b))});
 $('#share-car').onclick=()=>share(`${c.brand} ${c.line} · ${c.ref} · CELESGROUP`,`${location.origin}${location.pathname}#vehiculo-${ref}`);
}

function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';setTimeout(()=>$('#toast').style.display='none',4000)}
async function share(title='CELESGROUP · Portafolio',url=location.href){
 try{if(navigator.share)await navigator.share({title,url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);toast('Enlace copiado para compartir')}else toast('Copia la dirección de esta página para compartir')}
 catch(e){if(e.name!=='AbortError')toast('Puedes copiar el enlace desde la barra de dirección')}
}

// Tema
let savedTheme='dark';try{savedTheme=localStorage.getItem('celes-theme')||'dark'}catch(e){}
applyTheme(savedTheme);
document.querySelectorAll('[data-theme-choice]').forEach(b=>b.onclick=()=>applyTheme(b.dataset.themeChoice));

// Unidades de negocio
document.querySelectorAll('[data-mode]').forEach(b=>{
 b.onclick=()=>switchMode(b.dataset.mode);
 b.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=mode==='car'?'paint':'car';switchMode(next);$(`#tab-${next}`).focus()}}
});

// Filtros desplegables
$('#filter-toggle').onclick=()=>{
 const panel=$('#filter-panel');
 const open=panel.hidden;
 panel.hidden=!open;
 $('#filter-toggle').setAttribute('aria-expanded',String(open));
 $('.filter-icon').textContent=open?'−':'＋';
 if(open) $('#search').focus();
};
['search','transmission','price'].forEach(id=>$(`#${id}`).addEventListener(id==='search'?'input':'change',renderCars));
$('#clear-filters').onclick=()=>{$('#search').value='';$('#transmission').value='';$('#price').value='';renderCars();};

// Arrastre / swipe del carrete
const rail=$('#cars');
let drag={active:false,startX:0,startScroll:0,moved:false};
rail.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 drag={active:true,startX:e.clientX,startScroll:rail.scrollLeft,moved:false};
 rail.classList.add('is-dragging');
 rail.setPointerCapture?.(e.pointerId);
});
rail.addEventListener('pointermove',e=>{
 if(!drag.active)return;
 const dx=e.clientX-drag.startX;
 if(Math.abs(dx)>5)drag.moved=true;
 rail.scrollLeft=drag.startScroll-dx;
});
const endDrag=e=>{
 if(!drag.active)return;
 drag.active=false;
 rail.classList.remove('is-dragging');
 try{rail.releasePointerCapture?.(e.pointerId)}catch(_){}
 setTimeout(()=>{drag.moved=false},0);
};
rail.addEventListener('pointerup',endDrag);
rail.addEventListener('pointercancel',endDrag);
rail.addEventListener('mouseleave',e=>{if(drag.active&&e.buttons===0)endDrag(e)});
rail.onclick=e=>{const card=e.target.closest('.car-card[data-car]');if(card&&!drag.moved)showDetail(card.dataset.car)};
rail.addEventListener('keydown',e=>{const card=e.target.closest('.car-card[data-car]');if(card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();showDetail(card.dataset.car)}});

// Resto de interfaz
document.querySelectorAll('.share').forEach(b=>b.onclick=()=>share());
document.querySelectorAll('[data-history]').forEach(b=>b.onclick=()=>renderHistory(b.dataset.history));
$('.close').onclick=()=>$('#detail').close();
$('#detail').onclick=e=>{if(e.target===$('#detail')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}};
document.querySelectorAll('[data-service]').forEach(b=>b.onclick=()=>{
 $('#detail-body').innerHTML=`<div class="eyebrow">CELESPAINT / PORTAFOLIO PROPUESTO</div><h2>${b.dataset.service}</h2><p class="detail-text">Primero se valora el vehículo; luego se define el alcance, el precio y el tiempo. Este servicio está presentado como propuesta y requiere confirmación del responsable del taller.</p><p class="detail-text">Las evidencias de trabajos reales se incorporarán al histórico cuando estén validadas y autorizadas.</p><a class="primary" href="https://www.instagram.com/celes.group/" target="_blank" rel="noopener">Conocer al equipo</a>`;
 $('#detail').showModal();
});

renderCars();
renderHistory('ventas');
if(location.hash==='#celespaint')switchMode('paint');
if(location.hash.startsWith('#vehiculo-')){const ref=location.hash.replace('#vehiculo-','');if(cars.some(c=>c.ref===ref))showDetail(ref)}
