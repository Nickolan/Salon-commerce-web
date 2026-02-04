import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './ChatWindow.css';
import { socketService } from '../../../services/socketService';
// Eliminamos useDispatch y enviarMensaje porque usaremos Sockets puros
// import { useDispatch } from 'react-redux'; 
// import { enviarMensaje } from '../../../store/features/chat/chatSlice';

const ChatWindow = ({ chat, currentUserId, onBack }) => {
  const [mensaje, setMensaje] = useState('');
  const messagesEndRef = useRef(null);

  // 1. DETERMINAR EL "OTRO" USUARIO
  const soyPublicante = chat.publicante_id === currentUserId;
  const otroUsuario = soyPublicante ? chat.cliente : chat.publicante;

  // Scroll automático
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.mensajes]);

  // Unirse a la sala
  useEffect(() => {
    if (chat && chat.id) {
      // console.log(`🔌 Uniéndome a la sala: conversacion_${chat.id}`);
      socketService.joinRoom(chat.id);
    }
  }, [chat]);

  const handleEnviar = () => {
  if (mensaje.trim()) {
    
    // El payload debe coincidir con el DTO del backend
    socketService.sendMessage({
      conversacion_id: chat.id, // Tu DTO espera 'conversacion_id'
      contenido: mensaje,       // Tu DTO espera 'contenido'
    });
    
    setMensaje('');
  }
};

  // Helper seguro para obtener nombres (evita error si nombre es null)
  const getFirstName = (name) => name ? name.split(' ')[0] : '';

  return (
    <div className="chat-window-container">
      
      {/* HEADER */}
      <div className="chat-window-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeftOutlined />
          </button>
          
          <Avatar 
             src={otroUsuario?.foto_perfil || "https://via.placeholder.com/40"} 
             size={40} 
             className="header-avatar" 
          />
          <span className="header-name">
            {otroUsuario ? `${otroUsuario.nombre} ${otroUsuario.apellido}` : "Usuario"}
          </span>
        </div>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div className="messages-area">
        {chat.mensajes?.map((msg) => {
          const isMyMessage = msg.remitente_id === currentUserId;
          
          return (
            <div 
              key={msg.id} 
              className={`message-row ${isMyMessage ? 'my-row' : 'other-row'}`}
            >
              <Avatar 
                // Unifiqué la propiedad a 'foto' (revisa tu BD si es foto o foto_perfil)
                src={isMyMessage ? "https://ui-avatars.com/api/?name=Yo" : otroUsuario?.foto_perfil} 
                size={35} 
                className="msg-avatar"
                // style={{backgroundColor: "red"}} // Quité esto, se veía raro en prod
              />

              <div className="message-content-wrapper">
                <span className="msg-sender-name">
                  {isMyMessage 
                    ? 'Yo' 
                    : `${getFirstName(otroUsuario?.nombre)} ${getFirstName(otroUsuario?.apellido)}`
                  }
                </span>
                
                <div className={`message-bubble ${isMyMessage ? 'my-bubble' : 'other-bubble'}`}>
                  {msg.contenido}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="input-area-wrapper">
        <div className="custom-input-container">
          <textarea
            className="chat-textarea"
            placeholder={`Escribir a ${getFirstName(otroUsuario?.nombre)}...`}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleEnviar()}
          />
          <button className="send-btn" onClick={handleEnviar}>
            Enviar
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatWindow;