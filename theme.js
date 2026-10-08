// Run before paint; theme failures never block navigation.
try {
 const saved = localStorage.getItem('celes-theme');
 document.documentElement.dataset.theme = saved === 'light' || saved === 'dark' ? saved : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
} catch { document.documentElement.dataset.theme = 'dark'; }
