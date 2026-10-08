# CELESGROUP — V0.10 (preview)
Producción protegida: V0.9.2, commit `b7349177b7578efebee51354d6f07db4006b5318`.
Desarrollo exclusivamente en `feature/v0.10`. No fusionar ni promover sin aprobación explícita.

## Arquitectura
Sitio estático multipágina, sin framework ni JavaScript de terceros en el navegador.
- `/`: home institucional.
- `/celescar`: vitrina, fichas, Clientes felices, servicios, compra y contacto.
- `/celespaint`: catálogo de servicios, video real, proceso y contacto.
- `/historia`: origen, reel, evolución y unidades; contenido faltante identificado.
- `src/layout.html`: cabecera, menú y pie compartidos.
- `src/pages/`: contenido de cada página.
- `app.js`: navegación, tema, compartir y compatibilidad de enlaces.
- `src/celescar.js`: catálogo, filtros, fichas y galería.
- `styles.css`: estilos mobile-first.
- `scripts/build.mjs`: HTML estático y derivados WebP.
- `scripts/validate.mjs`: validación de sintaxis, esquema público, medios y vínculos.
- `scripts/preview.mjs`: servidor de preview local.

## Operación
Node >=22. Instalar con `npm install`; ejecutar `npm run build` y `npm run preview`.
Abrir http://localhost:4173. `npm run validate` comprueba fuentes.
Vercel compila con `npm run build` y sirve únicamente `dist/`.
Sharp 0.34.3 se usa exclusivamente al compilar. No hay procesamiento remoto de fotos en cada visita.

## Datos y actualización controlada
`data/catalogo.json`: 12 registros públicos de la V0.9.2, datos comerciales intactos.
`data/media.json`: asociaciones de fotografía, nunca en app.js.
`data/site.json`: imágenes editoriales, redes y contacto.
`data/entregas.json`: entregas independientes; únicamente PUBLICADO se muestra.
`data/historia.json`: textos, fotografías y video con estado de publicación.
1. Actualizar fuente respaldada.
2. Validar datos y autorización de fotografías.
3. Generar derivados con build.
4. Revisar preview, móvil, escritorio y reporte de medios.
5. Obtener aprobación antes de PR, merge y producción.

## Fotografías
Los archivos existentes se conservan sin cambios. La compilación genera versiones 240/640/1280 y manifiesto responsive. Las fichas muestran cada imagen completa.
En preview, `/qa/CC001` a `/qa/CC012` permiten auditoría visual; `/qa/image-report.json` registra hashes, dimensiones y tamaños. No se generan en VERCEL_ENV=production.
No usar esos reportes como prueba de verificación visual: esta se documenta aparte.

## Privacidad
Nunca subir originales con datos personales, tarjetas de propiedad ni documentos administrativos.
La estructura privada de originales debe mantenerse fuera del repositorio:
`VEHICULOS_VENDIDOS/01_ORIGINALES/{INSTAGRAM,WHATSAPP,FOTOS_DIRECTAS}/`.
Únicamente derivados revisados en `VEHICULOS_VENDIDOS/02_WEB/`.
La exclusión de Git es preventiva, no una autorización para publicar imágenes sin revisar.

## Estado de contenidos
No hay entregas aprobadas ni material histórico en la base. Los componentes y estados vacíos están implementados. La aceptación de contenidos requiere archivos reales y autorización.
Documentación: docs/V0.10_AUDITORIA.md, docs/V0.10_QA.md y docs/V0.10_ACTUALIZACION.md.
