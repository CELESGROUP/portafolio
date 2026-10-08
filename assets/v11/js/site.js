
// Encabezado que se esconde al bajar y reaparece al subir (páginas internas)
export function stickyHeader() {
  let last = window.scrollY, ticking = false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const bar = document.querySelector('.bar');
      const y = window.scrollY;
      if (bar && !document.querySelector('.msheet.is-open')) {
        const hide = !reduce && y > 160 && y > last + 4;
        const show = y < last - 4 || y <= 160;
        if (hide) bar.classList.add('is-hidden');
        else if (show) bar.classList.remove('is-hidden');
      }
      last = y;
      ticking = false;
    });
  }, { passive: true });
}
