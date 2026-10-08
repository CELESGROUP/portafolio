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

## 2026-10-07 — V0.9 · Recomendado fijo, vitrina y fichas completas

Solicitud explícita del usuario: cuatro ajustes sobre V0.8. Base: `533abb233ed4c0f2e5d917c02aaa55b0b4678b8b`.

- Recomendado con fotografía frontal real única; se elimina la secuencia y sus controles. Se amplía la escena para que el vehículo tenga más presencia. Configuración semanal manual en `data/catalogo.json` (`featured.ref`, `image`, `lead`).
- Título “Vehículos en vitrina”, espacio reducido antes del carrusel, tarjetas mayores y más cercanas.
- Lectura de la hoja vigente INVENTARIO_MAESTRO_CELESCAR, Untitled!A1:AF14. Se escriben únicamente 12 párrafos en AE2:AE13, preservando el resto de los campos y su formato.
- MINI CC012 incorpora QP, 1.600 cc, 147.000 km, precio $41.900.000, tres puertas, matrícula Bogotá y documentación registrada.
- Las fichas muestran combustible, color, puertas, matrícula, peritaje, dígito para pico y placa, único dueño, SOAT, tecnomecánica, negociación y retoma. Los campos vacíos conservan “Por confirmar”. Las fechas reportadas vencidas se señalan sin presuponer renovación.
- Catálogo comercial separado del JavaScript; se excluyen campos de gestión interna. No hay conexión pública al Google Sheet privado.
- Contacto con iconos SVG y accesos a Instagram/Facebook. WhatsApp no tiene número confirmado y mantiene ese estado visible.
- Validación previa: sintaxis JavaScript, diff sin errores de espacios, 12 referencias únicas, 12 descripciones y existencia de todas las fotos referenciadas. Escritura de descripciones verificada por lectura de la hoja.
- El navegador cloud no puede conectar con el servidor local; la revisión visual y funcional se realiza después del despliegue.

Verificación en producción: Vercel informa `success` para `7a4de4439ecdb597b0bbae4cb4813c7b006a4a45`. Las 12 tarjetas abren fichas con descripción, características y documentación; la galería del MINI cambia de fotografía. Los avisos de fechas vencidas aparecen en CC006 y CC007. Lectura posterior de la hoja confirma 12 descripciones y cero cambios ajenos en A:AD. Se refina la máscara de la fotografía fija para que el difuminado se aplique al contorno real de la imagen.

La composición móvil se adapta en CSS; verificación visual en móvil pendiente. El navegador disponible no permite visitar archivos locales ni ofrece ajuste de viewport. No se declara comprobación en teléfono real.


## 2026-10-07 — Auditoría de recursos fotográficos

- Se auditan las fotografías activas de CC001–CC012 por nombre, tamaño y SHA en `assets/cars`.
- Se detectan 13 alias binariamente duplicados: 4 en CC002, 4 en CC010 y 5 en CC011.
- Antes de eliminarlos se verifica que ninguno de los archivos de texto del repositorio los referencie; `app.js` utiliza las fotografías numeradas.
- Se eliminan únicamente los alias `*-gallery-*`, conservando intactas las imágenes numeradas usadas por las galerías.
- Verificación posterior: CC001–CC012 quedan con cero grupos de duplicados exactos entre los archivos activos de galería.
- La documentación registral y las tarjetas de propiedad permanecen exclusivamente en Google Drive privado; no se incorporan datos personales ni PDFs registrales al repositorio público.


## 2026-10-07 — V0.9.1 · portada, medios y correcciones críticas

Base protegida: `1b5edfadd9a8976977a19d66af5b04fe10c3f8b6`; respaldo creado en `backup/v0.9-2026-10-07`.

- Se crea una portada editorial CELESCAR separada del recomendado semanal. El hero usa una fotografía pública real de CC001 y el recomendado continúa independiente.
- Se elimina de `app.js` la matriz manual de medios y se crea `data/media.json` como manifiesto de portada/galería por referencia.
- CC006 Kia Sportage y CC007 Suzuki Grand Vitara dejan de mostrar las galerías equivocadas. Sus portadas públicas verificadas permanecen activas.
- En Google Drive se preparan 8 fotografías normalizadas para cada uno en `03_FOTOS_WEB`, con nomenclatura por ángulo. La promoción de esas fotografías privadas al repositorio público se mantiene como paso separado.
- WhatsApp comercial configurado en +57 315 326 0079; las fichas precargan referencia, vehículo y precio.
- Se incrementan recursos a V0.9.1 para evitar caché de CSS/JS.


## 2026-10-07 — V0.9.2 · galerías reales CC006 y CC007

- Base de trabajo: V0.9.1 en `main`; cambios desarrollados en `feature/v0.9.2-galerias-reales`.
- Se publican 8 fotografías verificadas de CC006 Kia Sportage 2019 y 8 de CC007 Suzuki Grand Vitara 2024 desde los sets normalizados de Drive.
- Los recursos quedan organizados en `assets/cars/cc006/` y `assets/cars/cc007/`.
- La primera fotografía normalizada coincide con la portada ya publicada; se conserva para trazabilidad, pero `data/media.json` la omite para evitar duplicación visual.
- Cada ficha presenta 8 imágenes únicas: portada más 7 complementarias.
- Se incrementa la versión de catálogo y caché a V0.9.2.
- La documentación privada de los vehículos permanece fuera del repositorio público.


## 2026-10-08 — V0.12 · sitio multipágina desde el diseño aprobado

Nota: publicada primero con el nombre V0.11 (commit `28ec719`); se renombra a V0.12 porque `feature/v0.10` y `feature/v0.11-cinematica-ventas` ya existían como líneas de trabajo independientes, sin integrar a `main`.

Base: V0.9.2 en `main` (`b734917`). Rama de trabajo: `v0.11-diseno-multipagina`.

Ajuste posterior: se retira el pie de página ampliado (páginas, contacto y redes) porque en móvil ocupaba demasiado; se vuelve al pie sencillo de una línea y "Contacto" regresa a la sección de contacto de CELESCAR. Los recursos pasan de `assets/v11/` a `assets/site/`.

- Se reemplaza la página única por seis páginas generadas desde el diseño aprobado: portada, CELESCAR, CELESPAINT, ENTREGAS, FINANCIACIÓN y NUESTRA HISTORIA.
- Correcciones de navegación de la auditoría: encabezado fijo con ocultamiento al bajar, ruta de ubicación, tarjeta "Sigue con", WhatsApp flotante, acceso "Simular cuota" desde la ficha, "Ver carros disponibles" en ENTREGAS y tarjeta de FINANCIACIÓN en NUESTRA HISTORIA.
- La vitrina conserva la fuente de datos `data/catalogo.json` + `data/media.json`; cada ficha muestra portada más galería completa.
- Simulador de crédito con tasa inicial de 20 % E.A. y rango 15–28 %; cuota aproximada sin seguros, sujeta a aprobación de la entidad.
- Material de Instagram publicado solo con piezas autorizadas y sin menores.
- Tipografía Jost alojada en el sitio (sin dependencia de Google Fonts).
- Se retiran `app.js` y `styles.css` de V0.9.2; el respaldo queda en el historial de `main`.

Validación local en Chromium (escritorio 1440 px y móvil 390 px): las seis páginas cargan sin errores de JavaScript; 12 tarjetas en la vitrina; la ficha abre con su galería y su enlace "Simular cuota"; la búsqueda filtra; el simulador recibe la referencia y recalcula; el menú móvil abre; el encabezado se oculta y reaparece.


## 2026-10-08 — V0.12.1 · ajustes en celular

- La portada ocupa exactamente la pantalla visible del celular (unidad `100svh`), sin quedar cortada por las barras del navegador.
- Se retira la tarjeta "Sigue con" al final de las páginas.
- En celular, la ruta "Inicio / página" se reemplaza por una fila de enlaces: Inicio · Celescar · Celespaint · Crédito · Historia, con la página actual en su color. En escritorio se conserva la ruta.
