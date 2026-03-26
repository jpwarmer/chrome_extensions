# Permissions & data disclosure (Chrome Web Store questionnaire)

Use these answers in the **Privacy practices** and **Permission justification** sections. Align checkbox answers with what you actually ship.

---

## English

### Justification — `activeTab`

The extension reads the visible text of the **currently active tab** only when the user triggers summarization, to build the prompt sent to the user-chosen AI API.

### Justification — `storage`

Stores **user-provided API keys**, **UI language**, **selected AI model**, and an optional **local cache** of analysis results keyed by page URL and model. No custom remote database operated by the developer.

### Justification — `host_permissions` / `<all_urls>`

Required to **inject the content script** (floating entry point and modal iframe) on web pages the user visits. The developer does not silently crawl all sites; processing happens when the user uses the extension.

### Remote code

**No.** (MV3 extension; code is bundled.)

### Data collection — categories (typical honest answers)

- **Personally identifiable information:** Not collected by the developer’s own servers (none in this project).
- **User activity:** Not tracked by a developer analytics pipeline in the reference implementation; if you add analytics later, update this.
- **Website content:** Processed **client-side** and sent to **third-party AI APIs** chosen by the user; governed by those providers’ policies.

### Certify handling of user data

You must confirm you comply with the [Developer Program Policy](https://developer.chrome.com/docs/webstore/program-policies/) and disclose remote endpoints: **Google Generative Language API**, **OpenAI API**, **Anthropic API** (HTTPS).

---

## Español (resumen para el mismo formulario)

- **activeTab:** leer el texto de la pestaña activa solo cuando el usuario pide resumir/analizar.
- **storage:** guardar claves API del usuario, idioma, modelo y caché local de resultados; sin base de datos propia del desarrollador.
- **`<all_urls>`:** inyectar el content script (botón flotante y modal) en las páginas visitadas; el procesamiento ocurre cuando el usuario usa la extensión.

**Código remoto:** no (extensión empaquetada MV3).

**Datos:** el contenido de la página se envía a las APIs de terceros que el usuario configura; revisar políticas de Google, OpenAI y Anthropic.

---

## Remote domains (for disclosure / review)

| Domain | Purpose |
|--------|---------|
| `generativelanguage.googleapis.com` | Google Gemini API |
| `api.openai.com` | OpenAI Chat Completions |
| `api.anthropic.com` | Anthropic Messages API |
| `fonts.googleapis.com`, `fonts.gstatic.com` | Fonts in extension popup (optional; CSP allows) |

User-configured donation link (e.g. `ko-fi.com`) opens in a new tab — not controlled by the extension author’s code beyond the href in `popup.html`.
