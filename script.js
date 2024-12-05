const chatMain = document.getElementById('chatMain');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

// Configuración de la API de OpenAI
const OPENAI_API_KEY = "TU_CLAVE_API_AQUÍ"; // Reemplaza con tu clave de API
const API_URL = "https://api.openai.com/v1/chat/completions";

// Función para agregar un mensaje al chat
function addMessage(content, sender) {
    const message = document.createElement('div');
    message.classList.add('message', sender);
    message.textContent = content;
    chatMain.appendChild(message);
    chatMain.scrollTop = chatMain.scrollHeight; // Scroll automático al final
}

// Función para obtener respuesta del bot
async function getBotResponse(userMessage) {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
    };

    const body = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "Eres un asistente inteligente que responde preguntas con precisión." },
            { role: "user", content: userMessage }
        ]
    });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`Error de API: ${response.statusText}`);
        }

        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        return botMessage;
    } catch (error) {
        console.error(error);
        return "Lo siento, ocurrió un error al procesar tu pregunta. Inténtalo nuevamente.";
    }
}

// Manejar envío de mensajes
async function handleSendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === "") return;

    addMessage(userMessage, 'user'); // Agregar mensaje del usuario
    chatInput.value = ""; // Limpiar input

    // Mostrar un mensaje de "pensando" mientras el bot responde
    const thinkingMessage = document.createElement('div');
    thinkingMessage.classList.add('message', 'bot');
    thinkingMessage.textContent = "Pensando...";
    chatMain.appendChild(thinkingMessage);

    // Obtener respuesta del bot
    const botMessage = await getBotResponse(userMessage);

    // Eliminar el mensaje de "pensando" y agregar la respuesta real
    chatMain.removeChild(thinkingMessage);
    addMessage(botMessage, 'bot');
}

// Listeners para el botón y la tecla Enter
sendButton.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
});