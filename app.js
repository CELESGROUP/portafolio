const menu = document.querySelector('#menu');
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click', () => { menu.showModal(); toggle.setAttribute('aria-expanded', 'true'); });
document.querySelector('.menu-close').addEventListener('click', () => menu.close());
menu.addEventListener('close', () => { toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); });
menu.addEventListener('click', e => { if (e.target.closest('a')) menu.close(); else if (e.target === menu) { const r = menu.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) menu.close(); } });
const themeButtons = [...document.querySelectorAll('[data-theme]')];
function syncTheme() { themeButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.theme === document.documentElement.dataset.theme))); }
themeButtons.forEach(b => b.addEventListener('click', () => { document.documentElement.dataset.theme = b.dataset.theme; try { localStorage.setItem('celes-theme', b.dataset.theme); } catch {} syncTheme(); }));
matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => { try { if(localStorage.getItem('celes-theme')) return; } catch {} document.documentElement.dataset.theme = e.matches ? 'light' : 'dark'; syncTheme(); });
syncTheme();
let timer;
export function toast(message) { const host=document.querySelector('#toast'); host.textContent=message; host.hidden=false; clearTimeout(timer); timer=setTimeout(()=>host.hidden=true,4000); }
export async function share(title = document.title, url = location.href) {
 try { if(navigator.share) await navigator.share({title,url}); else if(navigator.clipboard) { await navigator.clipboard.writeText(url); toast('Enlace copiado'); } else toast('Copia el enlace desde la barra de dirección'); }
 catch(e) { if(e.name !== 'AbortError') toast('Copia el enlace desde la barra de dirección'); }
}
document.querySelectorAll('.share').forEach(b => b.addEventListener('click', () => share()));
// WhatsApp share links point at this environment's home URL (preview or production).
document.querySelectorAll('.share-whatsapp').forEach(link => {
 const url = new URL('/', location.href).href;
 link.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent('Conoce CELESGROUP: ' + url);
});
// Keep old shared links working after the root becomes the institutional home.
if(document.body.dataset.page === 'home' && /^#(vehiculo-CC\d{3}|celescar|celespaint|portafolio|entregas|contacto|confianza)$/.test(location.hash)) {
 const destination=location.hash === '#celespaint' ? '/celespaint' : '/celescar';
 location.replace(destination + (location.hash.startsWith('#vehiculo-') ? location.hash : location.hash === '#confianza' ? '#proceso' : ['#celescar','#celespaint'].includes(location.hash) ? '' : location.hash));
}
