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

## 2026-10-07 — V0.7 · Bosquejo A aprobado

El usuario elige el bosquejo A: experiencia cinematográfica integrada en el bloque recomendado. Base: commit `a7705c8`.

- Se sustituye la galería enmarcada por una escena continua con las fotografías reales del MINI Cooper CC012. El fondo ambiental difuminado y los degradados integran la imagen con el texto y los bordes del bloque.
- Tres vistas seleccionadas se alternan con fundidos de 1,6 segundos y movimiento suave. Es una secuencia de fotografías; no se presenta como video real del MINI.
- Se añade pausa/reanudación, contador de fotografías y respeto inicial a la preferencia del sistema de movimiento reducido. El temporizador anterior se limpia al cambiar de unidad de negocio.
- El bloque y su acceso visible siguen abriendo la ficha del vehículo. El control de pausa queda fuera del área que abre la ficha.
- Se conserva CELESPAINT y su video real de porcelanizado. Se adapta la composición por CSS para móvil: fotografía superior y texto integrado debajo.
- README y referencias de recursos se actualizan a V0.7.

Código principal publicado: `26c31820af1356985738b530b0ec26757154ec4f`. GitHub informa estado Vercel `success` / “Deployment has completed”. Sitio verificado: https://celesgroup.vercel.app/.

Refinamiento final de bordes: `1908ce7d8187fde2bd6a8b53812dd66d2f94db82`, también con estado Vercel `success`.

Verificación en producción con navegador de escritorio: las tres vistas cargan; se observa avance hasta la tercera fotografía; el botón pausa y cambia a “Reanudar”; el recomendado abre el diálogo MINI Cooper; la tarjeta Mazda 2 abre su ficha; CELESPAINT reproduce el video con `readyState=4` y sin error. La sintaxis JavaScript se comprueba con `node --check`.

La conexión Vercel denegó la consulta del listado de despliegues (403); se verificó el estado mediante GitHub y la versión V0.7 visible en producción. No se ejecutó una comprobación visual en viewport móvil: este navegador no permite abrir la vista local de prueba. La adaptación móvil se revisó en el código.

Próxima continuación: revisión visual en un teléfono real; datos pendientes del MINI, WhatsApp oficial y evidencia autorizada del histórico. La planificación empresarial sigue en la guía maestra de Drive.

## 2026-10-07 — V0.8 · Ajuste a la composición del bosquejo

Aprobación explícita: “sí, que quede como el bosquejo”. Base: `c720bab12d3a9471117be41a7794ffd2580beb6c`.

- Se selecciona la fotografía frontal original `assets/cars/cc012-01.jpg` como primera vista del recomendado. Las siguientes muestran el frente en diagonal y el lateral.
- Se sustituye el recorte de la foto por encuadre contenido, conservando la proporción y mostrando el vehículo completo. La escena y la tipografía se reducen para recuperar el equilibrio del bosquejo.
- El recomendado presenta “Un compacto con identidad propia.”, transmisión y referencia. La descripción extensa y los datos pendientes permanecen en la ficha.
- Se conservan los fundidos, el movimiento suave, el control de pausa y la apertura de la ficha. El acceso visible ahora dice “Explorar vehículo”.
- Se ajusta la composición móvil por CSS. No se modifica la fotografía original ni se publica el vehículo recreado del bosquejo conceptual.

Código publicado: `408f7589cdc3f3b0a77959812e6c090c0c5eaffe`. La página de producción muestra V0.8. Verificación con navegador de escritorio: tres fotografías cargadas, encuadre `contain`, pausa/reanudación y acceso “Explorar vehículo” que abre MINI Cooper con su descripción completa y nueve imágenes en galería. Sintaxis JavaScript comprobada con `node --check`.

Pendiente: comprobar la composición en un teléfono real y completar los datos comerciales previamente identificados. La guía maestra conserva la planificación empresarial.
