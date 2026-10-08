
export async function loadCars() {
  const [cat, media] = await Promise.all([
    fetch('/data/catalogo.json?v=0.11.0').then((r) => r.json()),
    fetch('/data/media.json?v=0.11.0').then((r) => r.json())
  ]);
  const abs = (p) => (p && !p.startsWith('/') ? '/' + p : p);
  return (cat.cars || [])
    .filter((c) => String(c.status || '').toUpperCase() !== 'VENDIDO' && media[c.ref])
    .map((c) => {
      const m = media[c.ref];
      const cover = abs(m.cover);
      return Object.assign({}, c, { card: cover, gallery: [cover].concat((m.gallery || []).map(abs)) });
    });
}
