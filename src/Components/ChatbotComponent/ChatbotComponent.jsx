import React from 'react';
import ChatBot from 'react-simple-chatbot';

const ChatbotComponent = () => {
  // Estilos personalizados usando clases de Bootstrap
  const customStyle = {
    botMessageBox: {
      backgroundColor: '#e9ecef', // Color de Bootstrap: secondary
    },
    botFontColor: '#212529', // Color de Bootstrap: dark
    userMessageBox: {
      backgroundColor: '#0d6efd', // Color de Bootstrap: primary
    },
    userFontColor: '#ffffff', // Texto blanco para contraste
  };

  // Pasos del chatbot (flujos de conversación)
  const steps = [
    {
      id: '1',
      message: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      trigger: '2',
    },
    {
      id: '2',
      user: true,
      trigger: '3',
    },
    {
      id: '3',
      message: 'Selecciona una opción:',
      trigger: '4',
    },
    {
      id: '4',
      options: [
        { value: 'horario', label: 'Horario de atención', trigger: '5' },
        { value: 'contacto', label: 'Contacto', trigger: '6' },
        { value: 'ayuda', label: 'Necesito ayuda', trigger: '7' },
      ],
    },
    {
      id: '5',
      message: 'Nuestro horario de atención es de 9:00 a 18:00, de lunes a viernes.',
      end: true,
    },
    {
      id: '6',
      message: 'Puedes contactarnos al correo contacto@example.com o al teléfono +54 11 1234-5678.',
      end: true,
    },
    {
      id: '7',
      message: 'Por favor, describe tu problema y te ayudaremos lo antes posible.',
      trigger: '8',
    },
    {
      id: '8',
      user: true,
      end: true,
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
            <ChatBot
              steps={steps}
              headerTitle="Asistente Virtual"
              botDelay={600}
              userDelay={1000}
              customStyle={customStyle}
              bubbleOptionStyle={{ backgroundColor: '#6c757d' }} // Bootstrap: secondary
              contentStyle={{ fontFamily: "'Arial', sans-serif" }}
            />
        </div>
      </div>
    </div>
  );
};

export default ChatbotComponent;
