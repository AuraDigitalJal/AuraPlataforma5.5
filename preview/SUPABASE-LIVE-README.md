# Aura Digital · Live View con Supabase (PRUEBAS)

Versión de prueba: **aura-live-supabase-v12**. No modifica Aura Pro.

## Cómo activarlo en un proyecto Supabase existente

1. En el proyecto **visoraura**, confirma que en Supabase Dashboard → Authentication están activados **Anonymous Sign-Ins**. Al pasar a producción se debe usar autenticación de administrador más estricta y controles antiabuso (CAPTCHA, límites).
2. El bucket `aura-live` y las políticas de acceso ya se configuraron en el proyecto **visoraura**. El archivo [SUPABASE-LIVE-SETUP.sql](SUPABASE-LIVE-SETUP.sql) queda solo como referencia.
3. Los datos públicos del proyecto **visoraura** ya vienen configurados en el editor de pruebas. No es necesario pegar una clave ni una URL. **Jamás** uses claves secret o `service_role` en código público.
4. Abre [Aura Digital · Editor Pruebas](https://auradigitaljal.com/AuraPlataforma5.5/preview/?v=aura-live-supabase-v12) y pulsa **Compartir Live View**.
5. Cuando muestre "Live View activo", toca **Copiar enlace** y ábrelo en otro móvil. Mantén el editor abierto mientras haces cambios.

## Cómo funciona

- **Fotos, música y HTML** → Supabase Storage. El archivo original permanece intacto; las fotografías JPG/PNG/WebP superiores a 500 KB se optimizan en copias temporales WebP (objetivo 500 KB, margen recomendado hasta 800 KB sin forzar pérdida excesiva). Los GIF animados y archivos de música mantienen su formato.
- **Archivos grandes** → TUS resumable upload.
- **Cambio inmediato** → Supabase Realtime Broadcast. Solo existe una versión HTML activa (`previews/current.html`) por sesión; cada actualización la sustituye.
- **Si falla WebSocket** → el cliente consulta \`latest.json\` cada 3 segundos y recupera la versión vigente.
- **Vista del cliente** → altura completa del navegador; header/footer superpuestos y semitransparentes.
- **Sin ntfy.sh**, sin la cuota de adjuntos de ntfy.sh y sin dependencia de conexiones WebRTC P2P.

## Seguridad y límites de esta PRUEBA

- El bucket SQL es **público para lectura**. Una persona que conoce un URL de archivo puede acceder a él. Solo usar fotos/datos de prueba, nunca documentos confidenciales.
- Las subidas requieren Supabase Auth y las políticas RLS comprueban la carpeta con UUID del usuario.
- La URL de sesión tiene 160 bits de aleatoriedad. No la publiques en redes sociales.
- **Limpieza temporal:** al pulsar **Terminar sesión** se borran fotografías, música y HTML de la sesión mediante Supabase Storage API, quedando `latest.json` como aviso de cierre. Si se abandona una sesión cerrando la pestaña, se intentan borrar sus archivos tras 24 horas **la próxima vez que ese mismo usuario inicie Live View**. Mientras el editor sigue abierto, renueva la actividad cada 5 minutos. No es un cron de servidor ni se borran datos sin fecha verificable.
- Las conexiones anónimas necesitan controles antiabuso antes de producción.
- Si se eliminan datos de navegador, la sesión anónima del editor puede cambiar; las sesiones anteriores de Storage no se reasignan automáticamente.
- El costo y el consumo dependen del número de clientes, número/peso de fotos, audio y transferencias. Consulta límites del plan Supabase.
- La integración de compresión y limpieza se ha validado por simulaciones. **Falta comprobar el flujo real en computadora y celular**; la implementación no modifica Aura Pro.

## Comprobación rápida

1. Añade una portada de JPG.
2. Inicia Live View, confirma que muestra "Actualizado".
3. Abre el enlace en otro celular, verifica que se vea la portada.
4. Cambia un nombre, espera unos segundos; debe actualizarse sin recargar.
5. Añade una foto de galería y una canción MP3/M4A. Verifica que las descarga el celular y que el usuario puede pulsar reproducir.
6. Pulsa **Terminar sesión**. El visor debe mostrar que terminó o dejar de recibir cambios.
