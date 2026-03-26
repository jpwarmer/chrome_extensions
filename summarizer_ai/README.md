# TL;DR.ai (Chrome extension)

Extensión **Manifest V3** que resume y analiza la página activa con IA: resumen, análisis (sesgo, tono, posible desinformación) y, si la página tiene bloques reconocibles, un vistazo a **comentarios**. Las claves API las introduce el usuario; no hay backend propio del desarrollador.

## Características

- **Tres proveedores**: Google **Gemini** (p. ej. Gemini 3.1 Flash Lite), **OpenAI** (GPT-3.5-turbo), **Anthropic Claude** (Messages API).
- **Interfaz y prompts en el idioma elegido** (español / inglés).
- **Caché local** (`chrome.storage.local`): último resultado por URL normalizada y por modelo.
- **Botón flotante** en la página y **modal** con `iframe` al popup (misma UI que el icono de la extensión).
- **Extracción heurística** de texto principal y fragmentos tipo comentario en el content script.

## Estructura del proyecto

| Archivo / carpeta | Rol |
|-------------------|-----|
| `manifest.json` | MV3, permisos, CSP, content scripts |
| `popup.html`, `popup.js`, `styles.css` | UI del popup |
| `content.js` | Botón flotante, modal, extracción de contenido, mensajes al popup |
| `translations.js` | Cadenas ES/EN (UI y textos de IA) |
| `ai-service.js` | Llamadas a Gemini / OpenAI / Claude y parseo de secciones |
| `storage-manager.js` | Idioma, claves API por modelo, caché de análisis |
| `icons/` | `icon48.png`, `icon128.png` |
| `publish/` | Textos para Chrome Web Store, política de privacidad (plantillas) y checklist |

## Permisos

- **`activeTab`**: leer la pestaña activa al resumir.
- **`storage`**: preferencias, claves API y caché.
- **`host_permissions` `<all_urls>`**: inyectar el content script y exponer el popup en el modal.

Redes permitidas en CSP (`connect-src`): APIs de Google Generative Language, OpenAI y Anthropic (HTTPS). El popup puede cargar fuentes desde Google Fonts.

## Requisitos

- Navegador compatible con extensiones **Chromium** (Chrome, Edge, Brave, etc.).
- Al menos una **API key** válida para el modelo que elijas (cuotas y precios según cada proveedor).

## Instalación en desarrollo

1. Clona el repositorio y abre la carpeta `summarizer_ai`.
2. En Chrome, ve a `chrome://extensions/`.
3. Activa **Modo de desarrollador**.
4. **Cargar descomprimida** y selecciona `summarizer_ai`.

## Uso

1. Abre el popup desde el icono de la extensión o el botón flotante en una página web.
2. Elige **idioma**, **modelo** y guarda la **API key** correspondiente.
3. Pulsa **Resumir**; el texto enviado al modelo se trunca (aprox. 6 000 caracteres de cuerpo y 2 000 de comentarios).

## Publicación en tienda

En **`publish/`** hay plantillas en inglés y español: política de privacidad, textos de ficha, justificación de permisos y [checklist](./publish/checklist.md). Sustituye correos, fechas y URLs antes de enviar el ZIP a la [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

## Desarrollo

- Tras cambiar código, recarga la extensión en `chrome://extensions/`.
- No incluyas claves API en el repositorio.

## Contribuciones

Las contribuciones son bienvenidas (issues y pull requests).

## Licencia

Indica la licencia en la raíz del repositorio si distribuyes el proyecto.
