import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "¡Hola! ¿En qué puedo ayudarte hoy?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
    setInputValue('');
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Gracias por tu mensaje. Estoy procesando tu consulta.", sender: 'bot' }]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle-button" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header" onClick={() => setIsOpen(false)}>
            <span>Asistente Virtual</span>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.sender === 'user' ? 'user-message' : 'bot-message'}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu consulta aquí..."
              className="chatbot-input"
            />
            <button onClick={handleSendMessage} className="chatbot-send-button">
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
