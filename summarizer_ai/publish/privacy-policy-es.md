# Política de privacidad — TL;DR.ai (extensión de navegador)

**Última actualización:** [FECHA]  
**Contacto:** [TU_EMAIL_O_PÁGINA_DE_CONTACTO]

## Resumen

TL;DR.ai es una extensión de navegador que ayuda a resumir y analizar la **página web abierta** mediante inteligencia artificial. **Esta extensión no utiliza un servidor propio del desarrollador para recopilar tus datos personales.** El tratamiento se hace en tu dispositivo (almacenamiento local) o en **proveedores de IA de terceros** que **tú** eliges y autenticas con tus propias claves API.

## Qué datos se tratan

Al usar la acción de resumir, la extensión puede:

1. **Leer el texto visible** de la pestaña activa (contenido principal y, si se detectan, bloques tipo comentarios) para construir el prompt.
2. **Enviar ese texto, la URL de la página y las instrucciones** a una API de IA externa **que hayas configurado** (Google Gemini, OpenAI y/o Anthropic Claude), por HTTPS.
3. **Guardar localmente** en el navegador (mediante `chrome.storage.local`):
   - Tus **claves API** de los proveedores elegidos (el almacenamiento del navegador las guarda; no se envían al desarrollador).
   - **Preferencias**: idioma de la interfaz, modelo seleccionado.
   - **Caché de resultados** por URL normalizada y por modelo, para mostrar el último resultado al reabrir el popup sin repetir la llamada a la API.

La extensión **no vende** tus datos. El desarrollador **no recibe** copias del contenido de tus páginas ni de tus claves en un servidor propio en el uso normal de la extensión.

## Servicios de terceros

Si introduces claves API y usas el modelo correspondiente, los prompts se procesan según la **política de privacidad y condiciones** de:

- **Google** (API Gemini / Generative Language) — documentación en `https://ai.google.dev/` y términos de Google Cloud según aplique.
- **OpenAI** — `https://openai.com/policies`.
- **Anthropic** — `https://www.anthropic.com/legal/privacy`.

Eres responsable de cumplir las normas de esos proveedores y de mantener tus claves seguras.

## Permisos (para qué sirven)

- **activeTab**: Acceder a la pestaña cuando usas la extensión para leer el contenido a analizar.
- **storage**: Guardar ajustes, claves API y la caché local opcional de resultados.
- **Permiso de host `<all_urls>`**: Inyectar el script de contenido (botón flotante / modal) en las páginas que visitas; no implica que el desarrollador contacte con todos esos sitios de forma remota.

## Enlaces opcionales

Si la interfaz incluye un enlace de **donación** o apoyo, abre la URL configurada en la extensión (p. ej. Ko-fi, PayPal) en una pestaña nueva; ese sitio tiene su propia política de privacidad.

## Fuentes tipográficas

El popup puede cargar fuentes desde **Google Fonts** (véase la política de seguridad de contenidos de la extensión). Google puede recibir datos técnicos habituales en peticiones de fuentes, según sus políticas.

## Privacidad infantil

La extensión no está dirigida a menores de 13 años (o la edad mínima de tu jurisdicción). No la uses si no tienes edad para consentir el tratamiento de datos en tu región.

## Cambios

Podemos actualizar esta política cuando cambie el comportamiento de la extensión. La fecha de “Última actualización” reflejará esos cambios. El uso continuado implica la aceptación de la política vigente.

## Tus opciones

- Borrar datos guardados: usa la configuración de Chrome para borrar **datos de la extensión** de TL;DR.ai, o desinstala la extensión.
- Dejar de enviar datos a proveedores de IA: elimina tus claves API de la extensión o deja de usar la función de resumir.

---

*Texto orientativo para el proyecto TL;DR.ai. Para seguridad jurídica, revísalo con un profesional cualificado.*
