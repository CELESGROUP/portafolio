# Bitácora de cambios del portafolio

## 2026-10-07 — V0.6.1

Base revisada: V0.6, commit `14e0f78` de `CELESGROUP/portafolio`.

- Se reproduce el fallo: el clic en una tarjeta no abre la ficha porque el carrusel captura el puntero desde el inicio y recibe el clic en lugar de la tarjeta.
- La captura del mouse se activa después de superar 9 píxeles de movimiento. Un clic normal conserva su destino y abre la ficha. El gesto táctil conserva el desplazamiento nativo.
- El recomendado presenta la fotografía real como fondo difuminado, información completa a la izquierda y galería enmarcada a la derecha. Se adapta a una columna en móvil.
- Se incorporan accesos visibles a la ficha y roles de botón para la navegación con teclado.
- Las referencias de CSS y JavaScript incluyen versión para evitar archivos anteriores en caché.

Publicación del código: commit `09bd69f` en `main`; despliegue de producción `dpl_8SY6Tg6rSycZVvPqccRzy8Kk6sij`, estado READY. Sitio: https://celesgroup.vercel.app/.

Validación en navegador: las tarjetas de los 12 vehículos abren el diálogo de su ficha con el título correspondiente; el recomendado abre la ficha del MINI; la miniatura 2 actualiza la foto principal y su texto alternativo. Se revisó visualmente el bloque recomendado publicado y el cambio de entorno CELESCAR/CELESPAINT. La sintaxis JavaScript y las rutas de las galerías se comprobaron antes de publicar.

Próxima continuación: validar datos comerciales pendientes, número oficial de WhatsApp y evidencia autorizada para el histórico. La guía maestra de Drive mantiene la planificación general; esta bitácora registra únicamente cambios del sitio.
