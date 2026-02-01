import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Button } from 'antd';
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import './ChatWindow.css';

import { useDispatch } from 'react-redux';
import { enviarMensaje } from '../../../store/features/chat/chatSlice';

const ChatWindow = ({ chat, currentUserId, onBack }) => {
  const dispatch = useDispatch();
  const [mensaje, setMensaje] = useState('');
  const messagesEndRef = useRef(null);

  // 1. DETERMINAR CON QUIÉN HABLO (El "Otro")
  // Si mi ID es igual al del publicante, entonces hablo con el cliente. Si no, con el publicante.
  const soyPublicante = chat.publicante_id === currentUserId;
  const otroUsuario = soyPublicante ? chat.cliente : chat.publicante;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.mensajes]);

  const handleEnviar = () => {
    if (mensaje.trim()) {
      dispatch(enviarMensaje({
        conversacionId: chat.id,
        contenido: mensaje
      }));
      setMensaje('');
    }
  };

  return (
    <div className="chat-window-container">
      
      {/* --- HEADER CON DATOS DEL OTRO USUARIO --- */}
      <div className="chat-window-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeftOutlined />
          </button>
          
          {/* Avatar y Nombre dinámicos */}
          <Avatar 
             src={otroUsuario?.foto || "https://via.placeholder.com/40"} 
             size={40} 
             className="header-avatar" 
          />
          <span className="header-name">{otroUsuario?.nombre +" " + otroUsuario?.apellido || "Usuario"}</span>
        </div>
      </div>

      <div className="messages-area">
        {chat.mensajes?.map((msg) => {
          // Chequeo simple de propiedad
          const isMyMessage = msg.remitente_id === currentUserId;
          
          return (
            <div 
              key={msg.id} 
              className={`message-row ${isMyMessage ? 'my-row' : 'other-row'}`}
            >
              {/* LÓGICA DEL AVATAR EN EL MENSAJE */}
              <Avatar 
                // Si es mi mensaje -> Muestro MI avatar (puedes sacarlo del localStorage o poner uno genérico)
                // Si es mensaje del otro -> Muestro el avatar de "otroUsuario"
                src={isMyMessage ? "https://ui-avatars.com/api/?name=Yo" : otroUsuario?.foto_perfil} 
                size={35} 
                className="msg-avatar"
              />

              <div className="message-content-wrapper">
                {/* Nombre encima de la burbuja */}
                <span className="msg-sender-name">
                  {isMyMessage ? 'Yo' : otroUsuario?.nombre.split(' ')[0] + " " + otroUsuario?.apellido.split(' ')[0]}
                </span>
                
                {/* La burbuja mantiene los colores que definimos antes */}
                <div className={`message-bubble ${isMyMessage ? 'my-bubble' : 'other-bubble'}`}>
                  {msg.contenido}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area-wrapper">
        <div className="custom-input-container">
          <textarea
            className="chat-textarea"
            placeholder={`Escribir a ${otroUsuario?.nombre.split(' ')[0]}...`}
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