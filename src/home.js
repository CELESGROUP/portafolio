// Portada cinematográfica autónoma. No modifica el catálogo ni otras páginas.
const root = document.querySelector('.cinema');
if (root) {
  const tabs = [...root.querySelectorAll('.cinema-tab')];
  const panels = [...root.querySelectorAll('.cinema-slide')];
  const pause = root.querySelector('.cinema-pause');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const period = 11000;
  let active = 0;
  let timer = null;
  let manuallyPaused = reduced.matches;
  let hovering = false;

  function isPaused() {
    return manuallyPaused || hovering || document.hidden || reduced.matches;
  }
  function schedule() {
    clearTimeout(timer);
    root.classList.toggle('is-paused', isPaused());
    if (!isPaused()) timer = window.setTimeout(() => select((active + 1) % panels.length), period);
  }
  function select(index, focus = false) {
    active = (index + panels.length) % panels.length;
    tabs.forEach((tab, i) => {
      const selected = i === active;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach((panel, i) => {
      const selected = i === active;
      panel.classList.toggle('is-active', selected);
      panel.setAttribute('aria-hidden', String(!selected));
      panel.inert = !selected;
    });
    // A selected tab restarts its progress animation, even when reselected.
    const fill = tabs[active].querySelector('.cinema-progress');
    if (fill) {
      fill.style.animation = 'none';
      void fill.offsetWidth;
      fill.style.animation = '';
    }
    schedule();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i, true));
    tab.addEventListener('keydown', event => {
      let destination = null;
      if (event.key === 'ArrowRight') destination = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') destination = (i - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') destination = 0;
      if (event.key === 'End') destination = tabs.length - 1;
      if (destination !== null) {
        event.preventDefault();
        select(destination, true);
      }
    });
  });
  function syncPause() {
    pause.setAttribute('aria-pressed', String(manuallyPaused));
    pause.setAttribute('aria-label', manuallyPaused ? 'Reanudar transiciones' : 'Pausar transiciones');
    pause.title = manuallyPaused ? 'Reanudar transiciones' : 'Pausar transiciones';
    pause.textContent = manuallyPaused ? '▶' : 'Ⅱ';
    schedule();
  }
  pause.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    syncPause();
  });
  root.querySelector('.cinema-stage').addEventListener('mouseenter', () => { hovering = true; schedule(); });
  root.querySelector('.cinema-stage').addEventListener('mouseleave', () => { hovering = false; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => {
    if (reduced.matches) manuallyPaused = true;
    syncPause();
  });
  syncPause();
  select(0);
}