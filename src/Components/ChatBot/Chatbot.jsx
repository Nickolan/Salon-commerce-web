import React, { useEffect } from 'react';
// Importa tus estilos si son necesarios para el posicionamiento general,
// pero el botón inicial ya no existirá.
// import './Chatbot.css';

const Chatbot = () => {
  useEffect(() => {
    // Verificar si el script ya existe para evitar cargarlo múltiples veces
    // (útil si el componente pudiera re-montarse por alguna razón)
    if (document.querySelector('script[src*="jotfor.ms/agent/embedjs"]')) {
      console.log('Script de Jotform ya cargado.');
      // Opcional: podrías intentar re-abrir el chat aquí si es necesario
      return;
    }

    // Crea el elemento script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/agent/embedjs/0199ee8a76e9771aa184f621e1f7aa20b530/embed.js';
    script.async = true;

    // Cuando se cargue el script de Jotform, el widget se inicializará solo.
    script.onload = () => {
      console.log('Script de Jotform cargado.');
      // Opcional: Si quieres que el chat se abra AUTOMÁTICAMENTE al cargar la página
      // Esperar un poco a que se monte el widget de Jotform
      // setTimeout(() => {
      //   const jotformButton = document.querySelector('button[aria-label="Open Chatbot"]');
      //   if (jotformButton) {
      //     console.log('Intentando abrir Jotform automáticamente.');
      //     jotformButton.click(); // Abre automáticamente el chat
      //   } else {
      //     console.warn('Botón de Jotform no encontrado para apertura automática.');
      //   }
      // }, 1500); // Ajusta este tiempo si es necesario
    };

    script.onerror = () => {
        console.error('Error al cargar el script de Jotform.');
    };

    // Añade el script al cuerpo del documento
    document.body.appendChild(script);

    // Función de limpieza: Opcional, pero buena práctica si el componente se desmonta.
    // Remueve el script si el componente Chatbot se desmonta.
    return () => {
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
        console.log('Script de Jotform removido al desmontar componente.');
        // También podrías necesitar remover elementos visuales que Jotform haya añadido.
        const jotformContainer = document.getElementById('jotform-chat-embed'); // O el ID/clase que use Jotform
        if (jotformContainer) {
            jotformContainer.remove();
        }

      }
    };
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar

  // Este componente ahora no renderiza nada visible por sí mismo.
  // El widget de Jotform se añadirá al DOM a través del script.
  return null;
};

export default Chatbot;