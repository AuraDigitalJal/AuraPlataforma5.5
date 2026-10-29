# Lúmina Studio · Android Beta

Aplicación Android WebView privada que abre **la misma V4**: https://auradigitaljal.com/AuraPlataforma5.5/preview/lumina-v4?v=lumina-direct-menu-v4-20261028

- Android 8.0 o superior; conexión a internet obligatoria.
- Selector nativo para fotos, música y archivos múltiples.
- Vista previa emergente dentro de la app.
- ZIPs generados en JavaScript se envían por fragmentos al almacenamiento Android y se guardan en Descargas/LuminaStudio (Android 10+).
- Android 8-9: los archivos se guardan en el directorio externo de la app, sin permiso de almacenamiento general.
- Textos y ajustes se guardan en el almacenamiento del sitio WebView de esta app; fotos y música se deben re-seleccionar.
- El APK beta va firmado con una clave de depuración temporal, **no es una versión definitiva ni se puede actualizar con otra clave sin reinstalar**.
- La app no aporta un servidor de publicación nuevo; usa la web existente.

## Crear APK

GitHub Actions: `.github/workflows/lumina-android-apk.yml`. El APK se entrega como archivo del workflow y, si se permite escritura del repositorio, como descarga de la release beta.
