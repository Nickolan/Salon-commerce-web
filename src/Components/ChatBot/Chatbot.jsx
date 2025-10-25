import React, { useState, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isJotformLoaded, setIsJotformLoaded] = useState(false);

  const handleClick = () => {
    // Si ya está cargado, no lo vuelvas a crear
    if (isJotformLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/agent/embedjs/0199ee8a76e9771aa184f621e1f7aa20b530/embed.js';
    script.async = true;

    // Cuando se cargue el script de Jotform
    script.onload = () => {
      setIsJotformLoaded(true);

      // Esperar un poco a que se monte el widget
      setTimeout(() => {
        const jotformButton = document.querySelector('button[aria-label="Open Chatbot"]');
        if (jotformButton) jotformButton.click(); // Abre automáticamente el chat
      }, 1500);
    };

    document.body.appendChild(script);
  };

   return (
    <>
      {!isJotformLoaded && (
        <button className="chatbot-toggle-button" onClick={handleClick}>
          💬
        </button>
      )}
    </>
  );
};

export default Chatbot;