# CELESGROUP — Portafolio V0.9

Sitio estático para CELESCAR y CELESPAINT, publicado desde `CELESGROUP/portafolio`, rama `main`, en https://celesgroup.vercel.app/.

## Datos y actualización del recomendado

La fuente comercial es el Google Sheet INVENTARIO_MAESTRO_CELESCAR, pestaña Untitled:
https://docs.google.com/spreadsheets/d/1VKKQlP0S9iOx1jeNP5yOrBvrStjAKWXM1RtZKaYTlbI/edit

`data/catalogo.json` contiene exclusivamente los campos comerciales para publicar. La ficha lee ese archivo; `app.js` conserva las asociaciones de fotografías por referencia. No se publican vendedor, precio de venta, fuentes de WhatsApp ni alertas administrativas.

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
