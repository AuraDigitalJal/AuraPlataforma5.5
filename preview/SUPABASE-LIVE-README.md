# Aura Digital · Live View con Supabase (PRUEBAS)

Versión de prueba: **aura-live-supabase-v9r2**. No modifica Aura Pro.

## Cómo activarlo en un proyecto Supabase existente

1. En Supabase Dashboard → Authentication → Providers habilita **Anonymous Sign-Ins**. Al pasar a producción se debe usar autenticación de administrador más estricta y controles antiabuso (CAPTCHA, límites).
2. En Supabase Dashboard → SQL Editor, crea una consulta y ejecuta completo el archivo [SUPABASE-LIVE-SETUP.sql](SUPABASE-LIVE-SETUP.sql). Crea el bucket \`aura-live\` con políticas RLS para que un usuario autenticado solo suba/borré archivos dentro de su carpeta.
3. En Supabase → Project Settings / Connect localiza la **Project URL** (\`https://xxx.supabase.co\`) y la **Publishable key** (\`sb_publishable_...\`). Son los **únicos** dos datos que debes introducir en el editor. **Jamás** incluyas \`sb_secret_\`, \`service_role\` ni credenciales de administrador.
4. Abre [Aura Digital · Editor Pruebas](https://auradigitaljal.com/AuraPlataforma5.5/preview/?v=aura-live-supabase-v9r2), pulsa **Compartir Live View**, completa los datos y elige **Guardar y conectar**.
5. Cuando muestre "Live View activo", toca **Copiar enlace** y ábrelo en otro móvil. Mantén el editor abierto mientras haces cambios.

## Cómo funciona

- **Fotos, música y HTML** → Supabase Storage. El archivo original permanece intacto; solo las fotos de más de 6 MB se optimizan en una copia temporal para Live View.
- **Archivos grandes** → TUS resumable upload.
- **Cambio inmediato** → Supabase Realtime Broadcast.
- **Si falla WebSocket** → el cliente consulta \`latest.json\` cada 3 segundos y recupera la versión vigente.
- **Vista del cliente** → altura completa del navegador; header/footer superpuestos y semitransparentes.
- **Sin ntfy.sh**, sin la cuota de adjuntos de ntfy.sh y sin dependencia de conexiones WebRTC P2P.

## Seguridad y límites de esta PRUEBA

- El bucket SQL es **público para lectura**. Una persona que conoce un URL de archivo puede acceder a él. Solo usar fotos/datos de prueba, nunca documentos confidenciales.
- Las subidas requieren Supabase Auth y las políticas RLS comprueban la carpeta con UUID del usuario.
- La URL de sesión tiene 160 bits de aleatoriedad. No la publiques en redes sociales.
- **No hay borrado automático** de las sesiones de Storage. El administrador del proyecto debe eliminar objetos de prueba antiguos del bucket \`aura-live\`. Las sesiones cerradas dejan de actualizarse, pero los archivos públicos persisten hasta su eliminación.
- Las conexiones anónimas necesitan controles antiabuso antes de producción.
- Si se eliminan datos de navegador, la sesión anónima del editor puede cambiar; las sesiones anteriores de Storage no se reasignan automáticamente.
- El costo y el consumo dependen del número de clientes, número/peso de fotos, audio y transferencias. Consulta límites del plan Supabase.
- La integración se ha validado sintácticamente y mediante simulación. **Sin proyecto configurado no se puede afirmar una prueba real entre dispositivos**.

## Comprobación rápida

1. Añade una portada de JPG.
2. Inicia Live View, confirma que muestra "Actualizado".
3. Abre el enlace en otro celular, verifica que se vea la portada.
4. Cambia un nombre, espera unos segundos; debe actualizarse sin recargar.
5. Añade una foto de galería y una canción MP3/M4A. Verifica que las descarga el celular y que el usuario puede pulsar reproducir.
6. Pulsa **Terminar sesión**. El visor debe mostrar que terminó o dejar de recibir cambios.
