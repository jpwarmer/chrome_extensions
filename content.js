// Crear el botón flotante solo una vez
const floatingButton = document.createElement('button');
floatingButton.className = 'floating-button';
// Usar un emoji que representa resumir/comprimir
floatingButton.innerHTML = '✂️'; // Opciones: 📝 (nota), 📄 (documento), 🔍 (búsqueda), ✂️ (tijeras), 📊 (gráfico), 📋 (clipboard)
floatingButton.title = 'TL;DR.ai - Resumir Contenido';

// Crear el modal solo una vez
const modal = document.createElement('div');
modal.id = 'summary-modal';
modal.style.cssText = `
    position: fixed;
    right: 80px;
    top: 50%;
    transform: translateY(-50%);
    width: 600px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10001;
    display: none;
`;

// Crear el iframe solo una vez
const iframe = document.createElement('iframe');
iframe.style.cssText = `
    width: 100%;
    height: 600px;
    border: none;
    border-radius: 8px;
    overflow-y: hidden;
`;
iframe.src = chrome.runtime.getURL('popup.html');
modal.appendChild(iframe);

// Agregar elementos al DOM solo una vez
document.body.appendChild(floatingButton);
document.body.appendChild(modal);

// Manejar la visibilidad del modal de manera eficiente
floatingButton.addEventListener('click', () => {
    const isVisible = modal.style.display === 'block';
    modal.style.display = isVisible ? 'none' : 'block';
});

// Función optimizada para extraer comentarios
function extractComments() {
    // Buscar elementos que contengan palabras clave relacionadas con comentarios
    const keywordSelectors = [
        '[class*="comment" i]',     // i flag hace la búsqueda case-insensitive
        '[class*="content" i]',
        '[id*="comment" i]',
        '[id*="content" i]',
        '[data-testid*="comment" i]',
        '[aria-label*="comment" i]',
        '[aria-label*="comentario" i]'  // Para sitios en español
    ];

    const commentsSet = new Set();
    
    const selector = keywordSelectors.join(', ');
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        // Ignorar elementos que probablemente sean contenedores o metadatos
        if (element.classList.toString().toLowerCase().includes('container') ||
            element.classList.toString().toLowerCase().includes('wrapper') ||
            element.classList.toString().toLowerCase().includes('actions') ||
            element.classList.toString().toLowerCase().includes('header')) {
            return;
        }

        const text = element.textContent.trim();
        // Filtrar contenido válido (más de 20 caracteres y menos de 5000)
        if (text && text.length > 20 && text.length < 5000) {
            commentsSet.add(text);
        }
    });

    return Array.from(commentsSet).join('\n\n');
}

// Escuchar mensajes del popup de manera más eficiente
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageContent") {
        requestAnimationFrame(() => {
            // Obtener el contenido principal
            const content = document.body.innerText.trim();
            const comments = extractComments();
            const url = window.location.href;
            
            // Validar si hay contenido para analizar
            if (!content || content.length < 50) { // Ajusta este número según necesites
                sendResponse({
                    error: "No se encontró suficiente contenido para analizar en esta página.",
                    url: url
                });
                return;
            }
            
            sendResponse({
                content: content,
                comments: comments,
                url: url
            });
        });
    }
    return true;
});

// Escuchar mensajes del iframe
window.addEventListener('message', (event) => {
    if (event.data === 'closeModal') {
        modal.style.display = 'none';
    }
});