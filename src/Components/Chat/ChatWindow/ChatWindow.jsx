import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { socketService } from '../../../services/socketService';
import { obtenerMensajesDelChat } from '../../../store/features/chat/chatSlice';
import './ChatWindow.css';

const ChatWindow = ({ chat, currentUserId, onBack }) => {
  const dispatch = useDispatch();
  const [mensaje, setMensaje] = useState('');
  const messagesEndRef = useRef(null);

  // 1. DETERMINAR CON QUIÉN HABLO (El "Otro")
  // Si mi ID es igual al del publicante, entonces hablo con el cliente. Si no, con el publicante.
  const soyPublicante = chat.publicante_id === currentUserId;
  const otroUsuario = soyPublicante ? chat.cliente : chat.publicante;

  // 2. SCROLL AUTOMÁTICO AL FONDO
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.mensajes]);

  // 3. EFECTO DE MONTAJE (AL ABRIR EL CHAT)
  useEffect(() => {
    if (chat && chat.id) {
      // A. Unirse a la sala de Socket para recibir en vivo
      socketService.joinRoom(chat.id);

      // B. Traer historial completo y MARCAR COMO LEÍDO en el backend
      dispatch(obtenerMensajesDelChat(chat.id));
    }
  }, [chat.id, dispatch]); // Dependencias: solo si cambia el ID del chat

  // 4. MANEJO DE ENVÍO (SOLO SOCKET)
  const handleEnviar = () => {
    if (mensaje.trim()) {
      
      // Enviamos el evento al servidor via Socket.io
      // El servidor lo guardará en BD y emitirá 'new_message' de vuelta
      socketService.sendMessage({
        conversacion_id: chat.id,
        contenido: mensaje,
      });

      setMensaje(''); // Limpiar input
    }
  };

  // Helper seguro para obtener el primer nombre
  const getFirstName = (name) => name ? name.split(' ')[0] : '';

  // Helper para nombre completo
  const getDisplayName = (user) => user ? `${user.nombre} ${user.apellido}` : "Usuario";

  return (
    <div className="chat-window-container">
      
      {/* --- HEADER --- */}
      <div className="chat-window-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeftOutlined />
          </button>
          
          {/* Avatar y Nombre dinámicos */}
          <Avatar 
             src={otroUsuario?.foto || otroUsuario?.foto_perfil || "https://via.placeholder.com/40"} 
             size={40} 
             className="header-avatar" 
          />
          <span className="header-name">
            {getDisplayName(otroUsuario)}
          </span>
        </div>
      </div>

      {/* --- ÁREA DE MENSAJES --- */}
      <div className="messages-area">
        {chat.mensajes?.map((msg) => {
          const isMyMessage = msg.remitente_id === currentUserId;
          
          return (
            <div 
              key={msg.id} 
              className={`message-row ${isMyMessage ? 'my-row' : 'other-row'}`}
            >
              <Avatar 
                // Avatar: Mío o del otro
                src={isMyMessage ? "https://ui-avatars.com/api/?name=Yo" : (otroUsuario?.foto || otroUsuario?.foto_perfil)} 
                size={35} 
                className="msg-avatar"
              />

              <div className="message-content-wrapper">
                {/* Nombre encima de la burbuja */}
                <span className="msg-sender-name">
                  {isMyMessage 
                    ? 'Yo' 
                    : getFirstName(otroUsuario?.nombre)
                  }
                </span>
                
                {/* Burbuja del mensaje */}
                <div className={`message-bubble ${isMyMessage ? 'my-bubble' : 'other-bubble'}`}>
                  {msg.contenido}
                </div>
              </div>
            </div>
          );
        })}
        {/* Elemento invisible para scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="input-area-wrapper">
        <div className="custom-input-container">
          <textarea
            className="chat-textarea"
            placeholder={`Escribir a ${getFirstName(otroUsuario?.nombre)}...`}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            // Enviar con Enter (sin Shift)
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