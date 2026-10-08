# CELESGROUP — Portafolio V0.12

Sitio estático para CELESCAR y CELESPAINT, publicado desde `CELESGROUP/portafolio`, rama `main`, en https://celesgroup.vercel.app/.

## Datos y actualización del recomendado

La fuente comercial es el Google Sheet INVENTARIO_MAESTRO_CELESCAR, pestaña Untitled:
https://docs.google.com/spreadsheets/d/1VKKQlP0S9iOx1jeNP5yOrBvrStjAKWXM1RtZKaYTlbI/edit

`data/catalogo.json` contiene exclusivamente los campos comerciales para publicar. La ficha lee ese archivo y `data/media.json` define portada y galería por referencia. No se publican vendedor, precio de venta, fuentes de WhatsApp ni alertas administrativas.

Para cambiar el recomendado semanalmente, editar el objeto `featured`:
- `ref`: referencia disponible, por ejemplo CC012.
- `image`: ruta de una fotografía real existente.
- `lead`: frase corta para la portada.

La foto permanece fija. No hay temporizador ni cambio automático por semana. Seleccionar un nuevo recomendado y publicar el cambio cuando corresponda. Para modificar los demás datos, revisar la hoja vigente y actualizar sus campos correspondientes en el JSON. Esta versión no sincroniza Drive en segundo plano.

## V0.9

- Recomendado integrado con fotografía frontal fija de mayor tamaño, sin movimiento, contador ni pausa.
- Vitrina con título breve, menor espacio vertical, tarjetas mayores y separación reducida.
- Descripciones comerciales escritas en Untitled!AE2:AE13 y visibles en las fichas.
- Características, documentación, fechas de vencimiento y condiciones comerciales provenientes de la hoja.
- Pico y placa presenta solamente el dígito registrado; no calcula restricciones de circulación.
- Datos vacíos se muestran por confirmar; una fecha de documento anterior al día actual en Bogotá indica que debe confirmarse su renovación.
- Instagram y Facebook con accesos e iconos visibles. WhatsApp conserva indicación de número pendiente; no se inventa un teléfono.
- Clic y teclado abren las fichas; el arrastre horizontal conserva su umbral independiente.
- Video real de CELESPAINT, selector de unidad y temas claro/oscuro conservados.

Histórico y evidencia de versiones: `docs/BITACORA.md`.


## V0.9.1

- Portada editorial CELESCAR antes del selector de unidades, con CC001 como imagen real de entrada.
- Las asociaciones de fotografías salen de `app.js` y pasan a `data/media.json`.
- CC006 y CC007 dejan de mostrar galerías no verificadas; por seguridad se conserva únicamente su portada pública correcta mientras se promueven los sets normalizados.
- En Drive se preparó un set de 8 fotografías web para CC006 y otro de 8 para CC007 en `03_FOTOS_WEB`.
- WhatsApp se habilita con el contacto comercial publicado y mensajes precargados por referencia, vehículo y precio.
- Respaldo previo de producción: rama `backup/v0.9-2026-10-07`.


## V0.9.2

- Galerías reales verificadas para CC006 y CC007.
- Ocho imágenes distintas por vehículo en ficha: portada más siete complementarias.
- Recursos organizados en carpetas propias por referencia.
- `data/media.json` concentra la asociación de medios; `app.js` ya no contiene esa matriz.
- La publicación desde Drive e Inventario Maestro sigue siendo controlada y no automática.


## V0.12 · sitio multipágina desde el diseño aprobado

- Seis páginas con dirección propia: `/` (portada), `/celescar`, `/celespaint`, `/entregas`, `/financiacion` y `/historia`.
- Identidad de color por página: CELESCAR azul, CELESPAINT cobre, ENTREGAS verde claro, FINANCIACIÓN dorado.
- Navegación: encabezado fijo que se oculta al bajar y reaparece al subir, ruta "Inicio / página", pie de página sencillo, tarjeta "Sigue con" al final de cada página y botón flotante de WhatsApp (317 en CELESPAINT, 315 en las demás).
- La vitrina y el simulador leen `data/catalogo.json` y `data/media.json`; la ficha enlaza al simulador con el carro ya elegido (`/financiacion?ref=CC006`).
- Medios de las páginas en `assets/site/media/`, tipografía Jost alojada en `assets/site/fonts/` y Preact 10.24.3 en `assets/site/js/`.
- Las páginas se generan con `tools/dc2site.py` a partir de los archivos del diseño; no editar a mano los `.js` generados.
