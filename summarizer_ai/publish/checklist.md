# Checklist antes de subir el ZIP a Chrome Web Store

- [ ] `manifest.json`: `version` incrementada respecto a la última publicación.
- [ ] Probar en **chrome://extensions** con “Cargar descomprimida” en una carpeta limpia (solo archivos necesarios).
- [ ] Política de privacidad publicada en una **URL HTTPS** estable; enlazarla en la consola de desarrollador.
- [ ] Sustituir `[DATE]`, `[YOUR_EMAIL...]`, enlaces de donación reales en `popup.html` si aplica.
- [ ] Capturas: mínimo según guía actual de Google (resolución y número); sin datos sensibles reales.
- [ ] Iconos: `icons/icon48.png` e `icons/icon128.png` presentes y nítidos.
- [ ] ZIP: **sin** `.git`, **sin** `README` si no quieres incluirlos (opcional); **sin** archivos de desarrollo eliminados del proyecto.
- [ ] Revisar el cuestionario de **datos del usuario** y **justificación de permisos** usando `permissions-and-data-disclosure.md`.
- [ ] Probar flujo: pestaña normal → Resumir → error sin clave / éxito con clave de prueba.
