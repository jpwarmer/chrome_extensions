/** Tiempo máximo de espera antes de responder con error al popup (ms). */
const PAGE_CONTENT_TIMEOUT_MS = 10_000;
/** Límite de caracteres del cuerpo enviado al modelo (coincide con truncado en ai-service). */
const MAX_BODY_TEXT_LENGTH = 50_000;
/** Contenido demasiado corto para analizar (alineado con AIService). */
const MIN_PAGE_CONTENT_LENGTH = 50;
/** Filtro de fragmentos candidatos a comentario. */
const MIN_COMMENT_FRAGMENT_LENGTH = 20;
const MAX_COMMENT_FRAGMENT_LENGTH = 5000;

const COMMENT_KEYWORD_SELECTORS = [
    '[class*="comment" i]',
    '[class*="content" i]',
    '[id*="comment" i]',
    '[id*="content" i]',
    '[data-testid*="comment" i]',
    '[aria-label*="comment" i]',
    '[aria-label*="comentario" i]',
].join(', ');

/** Evita bloques que suelen ser layout (no el comentario en sí). */
function shouldSkipCommentElement(classList) {
    const cls = classList.toString().toLowerCase();
    return (
        cls.includes('container') ||
        cls.includes('wrapper') ||
        cls.includes('actions') ||
        cls.includes('header')
    );
}

// Crear el botón flotante solo una vez
const floatingButton = document.createElement('button');
floatingButton.className = 'floating-button';
// Usar un emoji que representa resumir/comprimir
floatingButton.innerHTML = '✂️'; // Opciones: 📝 (nota), 📄 (documento), 🔍 (búsqueda), ✂️ (tijeras), 📊 (gráfico), 📋 (clipboard)
floatingButton.title = 'TL;DR.ai - Resumir Contenido';

// Crear el modal solo una vez
const modal = document.createElement('div');
modal.id = 'summary-modal';
modal.className = 'tldr-modal';

const iframe = document.createElement('iframe');
iframe.className = 'tldr-modal-frame';
iframe.src = chrome.runtime.getURL('popup.html');
iframe.title = 'TL;DR.ai';
modal.appendChild(iframe);

// Agregar elementos al DOM solo una vez
document.body.appendChild(floatingButton);
document.body.appendChild(modal);

// Manejar la visibilidad del modal de manera eficiente
floatingButton.addEventListener('click', () => {
    modal.classList.toggle('is-open');
});

/** Recopila texto de nodos que parecen comentarios (heurística por selectores). */
function extractComments() {
    const commentsSet = new Set();
    const nodes = document.querySelectorAll(COMMENT_KEYWORD_SELECTORS);

    nodes.forEach((element) => {
        if (shouldSkipCommentElement(element.classList)) {
            return;
        }

        const text = element.textContent.trim();
        if (
            text &&
            text.length > MIN_COMMENT_FRAGMENT_LENGTH &&
            text.length < MAX_COMMENT_FRAGMENT_LENGTH
        ) {
            commentsSet.add(text);
        }
    });

    return Array.from(commentsSet).join('\n\n');
}

// Escuchar mensajes del popup de manera más eficiente
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageContent") {
        // Agregar un timeout de 10 segundos
        const timeoutId = setTimeout(() => {
            sendResponse({
                error: "No se pudo obtener respuesta. Por favor, intente nuevamente más tarde.",
                url: window.location.href
            });
        }, PAGE_CONTENT_TIMEOUT_MS);

        try {
            const content = document.body.innerText.trim();
            const comments = extractComments();
            const url = window.location.href;
            
            // Limpiar el timeout ya que obtuvimos respuesta
            clearTimeout(timeoutId);
            
            if (!content || content.length < MIN_PAGE_CONTENT_LENGTH) {
                sendResponse({
                    error: "No se encontró suficiente contenido para analizar en esta página.",
                    url: url
                });
                return true;
            }
            
            const truncatedContent =
                content.length > MAX_BODY_TEXT_LENGTH
                    ? content.substring(0, MAX_BODY_TEXT_LENGTH) + '...'
                    : content;
            
            sendResponse({
                content: truncatedContent,
                comments: comments,
                url: url
            });
        } catch (error) {
            // Limpiar el timeout en caso de error
            clearTimeout(timeoutId);
            sendResponse({
                error: "Error al procesar el contenido. Por favor, intente nuevamente más tarde.",
                url: window.location.href
            });
        }
    }
    return true;
});

// Escuchar mensajes del iframe
window.addEventListener('message', (event) => {
    if (event.data === 'closeModal') {
        modal.classList.remove('is-open');
    }
});