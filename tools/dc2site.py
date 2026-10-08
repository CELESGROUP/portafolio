"""Convert the CELESGROUP design pages (DC format) into a static multi-page site
rendered with Preact. Usage: python3 dc2site.py <dc_dir> <blob_dir> <repo_dir> <version>"""
import html, json, os, re, shutil, sys

DC, BLOBS, REPO, VER = sys.argv[1:5]

PAGES = {  # dc file -> (output html, js name, path)
    'Main': ('index.html', 'inicio', '/'),
    'Celescar': ('celescar.html', 'celescar', '/celescar'),
    'Celespaint': ('celespaint.html', 'celespaint', '/celespaint'),
    'Entregas': ('entregas.html', 'entregas', '/entregas'),
    'Historia': ('historia.html', 'historia', '/historia'),
    'Financiacion': ('financiacion.html', 'financiacion', '/financiacion'),
}
DESC = {
    'Main': 'CELES GROUP · Compra, venta, financiación y estética automotriz en Cali.',
    'Celescar': 'CELESCAR · Vehículos usados seleccionados en Cali, con asesoría y financiación.',
    'Celespaint': 'CELESPAINT · Lámina, pintura, porcelanizado y estética automotriz en Cali.',
    'Entregas': 'Entregas CELES GROUP · Clientes que ya estrenan con nosotros.',
    'Historia': 'Nuestra historia · Cómo nació CELES GROUP en Cali.',
    'Financiacion': 'Financiación CELESCAR · Simula tu cuota y conoce las opciones de crédito.',
}
VOID = {'img', 'source', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'track', 'wbr'}
A = '/assets/v11'

# ---------- media ----------
media_dir = os.path.join(REPO, 'assets/v11/media')
os.makedirs(media_dir, exist_ok=True)
blobmap = {}
for fn in os.listdir(BLOBS):
    bid, ext = os.path.splitext(fn)
    name = bid[:8] + ext
    shutil.copyfile(os.path.join(BLOBS, fn), os.path.join(media_dir, name))
    blobmap[bid] = f'{A}/media/{name}'

def fix_urls(s):
    for k, (_, _, path) in PAGES.items():
        s = s.replace(f'{k}.dc.html', path)
    s = s.replace('//#', '/#')
    return s

# ---------- template parsing ----------
TOK = re.compile(r'<!--.*?-->|<(/?)([a-zA-Z][\w:-]*)((?:\s+[^\s=/>]+(?:="[^"]*")?)*)\s*(/?)>', re.S)
ATTR = re.compile(r'([^\s=/>]+)(?:="([^"]*)")?')

def parse(src):
    root = {'tag': None, 'attrs': [], 'kids': []}
    stack = [root]
    pos = 0
    for m in TOK.finditer(src):
        if m.start() > pos:
            stack[-1]['kids'].append(src[pos:m.start()])
        pos = m.end()
        if m.group(0).startswith('<!--'):
            continue
        close, tag, attrs, selfc = m.groups()
        if close:
            while stack[-1]['tag'] != tag:
                stack.pop()
                assert len(stack) > 1, tag
            stack.pop()
            continue
        node = {'tag': tag, 'attrs': ATTR.findall(attrs), 'kids': []}
        stack[-1]['kids'].append(node)
        if not selfc and tag.lower() not in VOID:
            stack.append(node)
    if pos < len(src):
        stack[-1]['kids'].append(src[pos:])
    return root

HOLE = re.compile(r'\{\{\s*([A-Za-z_$][\w$.]*)\s*\}\}')

def expr(path, scope):
    return path if path.split('.')[0] in scope else 'v.' + path

def js_str(s):
    return json.dumps(s, ensure_ascii=False)

def tpl(value, scope):
    parts, last = [], 0
    for m in HOLE.finditer(value):
        parts.append(html.unescape(value[last:m.start()]).replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${'))
        parts.append('${' + expr(m.group(1), scope) + '}')
        last = m.end()
    parts.append(html.unescape(value[last:]).replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${'))
    return '`' + ''.join(parts) + '`'

def attr_js(name, value, scope):
    if value == '' and name in ('controls', 'muted', 'loop', 'autoplay', 'hidden', 'disabled', 'playsInline'):
        return 'true'
    m = HOLE.fullmatch(value.strip())
    if m:
        return expr(m.group(1), scope)
    if HOLE.search(value):
        return tpl(value, scope)
    return js_str(html.unescape(value))

def gen(node, scope):
    if isinstance(node, str):
        if not HOLE.search(node):
            t = re.sub(r'\s+', ' ', html.unescape(node))
            return js_str(t) if t else None
        out = []
        last = 0
        for m in HOLE.finditer(node):
            t = re.sub(r'\s+', ' ', html.unescape(node[last:m.start()]))
            if t: out.append(js_str(t))
            out.append(expr(m.group(1), scope))
            last = m.end()
        t = re.sub(r'\s+', ' ', html.unescape(node[last:]))
        if t: out.append(js_str(t))
        return ', '.join(out)
    tag = node['tag']
    attrs = dict(node['attrs'])
    if tag == 'sc-for':
        var = attrs['as']
        lst = expr(HOLE.fullmatch(attrs['list']).group(1), scope)
        inner = kids(node, scope | {var})
        return f'({lst} || []).map(({var}, __i) => h(Fragment, {{ key: __i }}{inner}))'
    if tag == 'sc-if':
        cond = expr(HOLE.fullmatch(attrs['value']).group(1), scope)
        return f'({cond}) ? h(Fragment, null{kids(node, scope)}) : null'
    props = []
    for name, value in node['attrs']:
        if name.startswith('hint-'):
            continue
        if name == 'onChange':
            name = 'onInput'
        props.append(f'{js_str(name)}: {attr_js(name, value, scope)}')
    p = '{ ' + ', '.join(props) + ' }' if props else 'null'
    return f'h({js_str(tag)}, {p}{kids(node, scope)})'

def kids(node, scope):
    parts = [gen(k, scope) for k in node['kids']]
    parts = [p for p in parts if p is not None]
    # drop pure-space text at the edges
    while parts and parts[0] == '" "': parts.pop(0)
    while parts and parts[-1] == '" "': parts.pop()
    return ''.join(', ' + p for p in parts)

# ---------- shared runtime ----------
os.makedirs(os.path.join(REPO, 'assets/v11/js'), exist_ok=True)
CARS_JS = r'''
export async function loadCars() {
  const [cat, media] = await Promise.all([
    fetch('/data/catalogo.json?v=__VER__').then((r) => r.json()),
    fetch('/data/media.json?v=__VER__').then((r) => r.json())
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
'''.replace('__VER__', VER)
open(os.path.join(REPO, 'assets/v11/js/cars.js'), 'w').write(CARS_JS)

SITE_JS = r'''
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
'''
open(os.path.join(REPO, 'assets/v11/js/site.js'), 'w').write(SITE_JS)
shutil.copyfile(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'vendor/package/dist/preact.module.js'),
                os.path.join(REPO, 'assets/v11/js/preact.module.js'))

# ---------- pages ----------
for page, (out, jsname, path) in PAGES.items():
    s = open(os.path.join(DC, page + '.dc.html')).read()
    s = fix_urls(s)
    title = re.search(r'<title>(.*?)</title>', s, re.S).group(1).strip()
    helmet = re.search(r'<helmet>(.*?)</helmet>', s, re.S).group(1)
    body = re.search(r'<x-dc>(.*?)</x-dc>', s, re.S).group(1)
    body = re.sub(r'<helmet>.*?</helmet>', '', body, flags=re.S)
    sm = re.search(r'<script type="text/x-dc"[^>]*?data-props=\'(.*?)\'[^>]*>(.*?)</script>', s, re.S)
    props = json.loads(sm.group(1)) if sm else {}
    props = {k: (v.get('default', v.get('value')) if isinstance(v, dict) and k != '$preview' else v) for k, v in props.items() if not k.startswith('$')}
    code = sm.group(2) if sm else re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>', s, re.S).group(1)

    uses_cars = 'cars()' in code
    if uses_cars:
        code, n = re.subn(r'cars\(\)\s*\{\s*return \[.*?\];\s*\}', 'cars() { return CARS_ADAPT(window.__CARS__ || []); }', code, count=1, flags=re.S)
        assert n == 1, page

    def blob(m):
        b = m.group(1)
        assert b in blobmap, (page, b)
        return blobmap[b]
    body = re.sub(r'/_blob/([0-9a-f]{32})', blob, body)
    helmet = re.sub(r'/_blob/([0-9a-f]{32})', blob, helmet)
    code = re.sub(r'/_blob/([0-9a-f]{32})', blob, code)

    tree = parse(body.strip())
    roots = [k for k in tree['kids'] if not isinstance(k, str)]
    assert len(roots) == 1, page
    tmpl = gen(roots[0], set())

    adapt = ''
    if page == 'Financiacion':
        adapt = "const CARS_ADAPT = (list) => list.map((c) => ({ ref: c.ref, name: c.brand + ' ' + c.line, year: c.year, price: c.price, img: c.card }));"
    elif uses_cars:
        adapt = 'const CARS_ADAPT = (list) => list;'

    js = f'''// CELES GROUP · {title} · V{VER} (generado desde el diseño)
import {{ h, render, Component as PreactComponent, Fragment }} from '{A}/js/preact.module.js?v={VER}';
{"import { loadCars } from '" + A + "/js/cars.js?v=" + VER + "';" if uses_cars else ''}
{"import { stickyHeader } from '" + A + "/js/site.js?v=" + VER + "';" if page != 'Main' else ''}

const T = (v) => {tmpl};

class DCLogic extends PreactComponent {{
  render() {{ return T(this.renderVals()); }}
}}
{adapt}
{code.strip()}

const mount = document.getElementById('app');
{"window.__CARS__ = await loadCars();" if uses_cars else ''}
mount.textContent = '';
render(h(Component, {json.dumps(props)}), mount);
{"stickyHeader();" if page != 'Main' else ''}
'''
    open(os.path.join(REPO, 'assets/v11/js', jsname + '.js'), 'w').write(js)

    helmet = re.sub(r'<link[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>\s*', '', helmet)
    head_extra = ''.join(f"@font-face{{font-family:Jost;font-style:normal;font-weight:{w};font-display:swap;src:url({A}/fonts/jost-latin-{w}-normal.woff2) format('woff2')}}\n" for w in (300, 400, 500, 600)) + '''
.bar{transition:transform .4s cubic-bezier(.19,1,.22,1)}
.bar.is-hidden{transform:translateY(-100%)}
#app:empty{min-height:100vh;background:#000}
'''
    page_html = f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{html.escape(DESC[page])}">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#000000">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(DESC[page])}">
<meta property="og:type" content="website">
<link rel="icon" href="{blobmap['e38ecb95dda1282eed3d4372d08d3c82']}">
<link rel="preload" href="{A}/fonts/jost-latin-300-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{A}/fonts/jost-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="modulepreload" href="{A}/js/preact.module.js?v={VER}">
{helmet.strip()}
<style>{head_extra}</style>
</head>
<body>
<div id="app"></div>
<noscript><p style="color:#F2F1EE;font-family:sans-serif;padding:24px">Esta página necesita JavaScript. Escríbenos por WhatsApp: <a style="color:#94DAFB" href="https://wa.me/573153260079">315 326 0079</a></p></noscript>
<script type="module" src="{A}/js/{jsname}.js?v={VER}"></script>
</body>
</html>
'''
    open(os.path.join(REPO, out), 'w').write(page_html)
    print('ok', page, len(js))
