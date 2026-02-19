import React, { useState, useEffect, useRef } from 'react';
import { IoReload } from "react-icons/io5";
import './Chatbot.css';
const parseJwt = (token) => {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch (e) { return null; }
};
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [mostrarbotonSoporte, setMostrarbotonSoporte] = useState(false);
  const [mostrarbotonesUtil, setMostrarbotonesUtil] = useState(false)
  // --- LÓGICA DE ESTADO DINÁMICO ---
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

  // Usamos una clave única para el historial basada en si está logueado o es invitado
  const storageKey = token ? `chat_history_user` : `chat_history_guest`;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [
      { text: "¡Hola! Soy tu asistente de Focus Room. ¿En qué puedo ayudarte?", isBot: true }
    ];
  });

  // --- EFECTO: REINICIAR AL CAMBIAR ESTADO DE AUTH ---
  // Este efecto limpia el chat de invitado cuando detecta que el usuario se deslogueó
  useEffect(() => {
    if (!token) {
      LimpiarChat();
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, storageKey]);

  const LimpiarChat = () => {
    setMessages([{ text: "¡Hola! Soy tu asistente de Focus Room.", isBot: true }]);
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem('guest_session_id');
    setMostrarbotonSoporte(false)
    setMostrarbotonesUtil(false);
    sessionStorage.removeItem('current_chat_session_id');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Obtener datos del usuario desde LocalStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || localStorage.getItem('usuario') || 'null');

    // 2. Variables base
    let userEmail = 'invitado@focusroom.com';
    let sessionId = sessionStorage.getItem('current_chat_session_id');

    // 3. Lógica de identificación (Token vs Invitado)
    if (token) {
      const decoded = parseJwt(token);

      // Prioridad de Email: 1. Token | 2. Storage | 3. Placeholder
      userEmail = decoded?.email || decoded?.email_user || decoded?.sub || storedUser?.email || 'usuario_registrado@focusroom.com';

      if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        sessionStorage.setItem('current_chat_session_id', sessionId);
      }
    } else {
      // Lógica para invitados
      let guestId = sessionStorage.getItem('guest_session_id');
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('guest_session_id', guestId);
      }
      sessionId = guestId;
      userEmail = 'invitado@focusroom.com';
    }

    // 4. Actualizar UI con el mensaje del usuario
    const userMsg = inputValue;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInputValue('');
    setIsLoading(true);
    setMostrarbotonSoporte(false); // Reset de botones al enviar nuevo mensaje
    setMostrarbotonesUtil(false);

    // 5. Preparar el Payload
    const bodyPayload = {
      chatInput: userMsg,
      userEmail: userEmail,
      sessionId: sessionId,
      authToken: token
    };

    console.log("Enviando a n8n:", bodyPayload);

    // 6. ÚNICA PETICIÓN al Webhook
    try {
      const response = await fetch('http://127.0.0.1:5678/webhook/43971ebb-4027-4bc2-9e37-022d34cd3ca4/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const data = await response.json();

      // n8n suele devolver la respuesta en 'output' o 'text'
      let textoBot = data.output || data.text || "No recibí respuesta del asistente.";

      // 7. Procesar Triggers (Soporte y Feedback)
      if (textoBot.includes("[TRIGGER_SUPPORT]")) {
        setMostrarbotonSoporte(true);
        textoBot = textoBot.replace("[TRIGGER_SUPPORT]", "").trim();
      }

      if (textoBot.includes("[TRIGGER_FEEDBACK]")) {
        setMostrarbotonesUtil(true);
        textoBot = textoBot.replace("[TRIGGER_FEEDBACK]", "").trim();
      }

      // 8. Mostrar respuesta del Bot
      setMessages(prev => [...prev, { text: textoBot, isBot: true }]);

    } catch (error) {
      console.error("Error Chatbot:", error);
      setMessages(prev => [...prev, { text: "Error de conexión con Focus AI.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };
  const enviarTicketSoporte = async () => {
    setIsLoading(true);
    const storedUser = JSON.parse(localStorage.getItem('user') || localStorage.getItem('usuario') || 'null');
    const userEmail = (storedUser && storedUser.email) ? storedUser.email : 'usuario_desconocido@focusroom.com';
    const sessionId = sessionStorage.getItem('current_chat_session_id') || userEmail;
    const historialTexto = messages
      .map(m => `${m.isBot ? "Bot" : "Usuario"}: ${m.text}`)
      .join("\n");
    try {
      const response = await fetch('http://localhost:5678/webhook/6ea964b7-0722-4cb7-9748-c0cc3bcf742b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: historialTexto, userEmail, sessionId }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { text: 'Solicitud enviada. Te contactaremos por email pronto.', isBot: true }]);
      setMostrarbotonSoporte(false);
      setIsLoading(false);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error de conexión con Focus AI.", isBot: true }]);
    } finally {
      setIsLoading(false);
    }

  }
  const enviarFeedback = async (esUtil) => {
    setIsLoading(true);
    const storedUser = JSON.parse(localStorage.getItem('user') || localStorage.getItem('usuario') || 'null');
    const userEmail = (storedUser && storedUser.email) ? storedUser.email : 'usuario_desconocido@focusroom.com';
    const sessionId = sessionStorage.getItem('current_chat_session_id'); // Usar el ID actual
    if (!token) {
      sessionId = sessionStorage.getItem('guest_session_id');
    }
    setMostrarbotonesUtil(false);
    const respuesta = esUtil ? "¡Genial! Nos alegra haber ayudado." : "Gracias. Lamentamos no haber sido de ayuda.";
    setMessages(prev => [...prev, { text: respuesta, isBot: true }]);
    try {
      const response = await fetch('http://localhost:5678/webhook/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId,
          util: esUtil ? 1 : 0
        }),
      });
      const data = await response.json();
      setMostrarbotonSoporte(false);
      setIsLoading(false);
      sessionStorage.removeItem('current_chat_session_id');
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error de conexión con Focus AI.", isBot: true }]);
      console.error("No se pudo guardar el feedback")
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <div key={token ? 'auth' : 'guest'}>
      <button className="chatbot-toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div onClick={() => setIsOpen(false)} className='cabeza-chatbot'>
            <div  className="chatbot-header">Focus Room AI</div>
            <button onClick={LimpiarChat}><IoReload /></button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.isBot ? "bot-message" : "user-message"}>
                {msg.text}
              </div>
            ))}
            {mostrarbotonSoporte && (
              <button className="chatbot-botonsoporte" onClick={enviarTicketSoporte}>Soporte</button>
            )}
            {mostrarbotonesUtil && (
              <div className="chatbot-botonesutil">
                <button className="chatbot-botonutil" onClick={() => enviarFeedback(true)}>Util</button>
                <button className="chatbot-botonutil" onClick={() => enviarFeedback(false)}>No Util</button>
              </div>
            )}
            {isLoading && (
              <div className="bot-message typing-indicator">
                <span>Escribiendo...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-container" onSubmit={handleSendMessage}>
            <input
              className="chatbot-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
            />
            <button type="submit" className="chatbot-send-button" disabled={isLoading}>
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;