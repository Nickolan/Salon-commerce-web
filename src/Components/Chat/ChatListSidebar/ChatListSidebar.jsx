import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Avatar, List } from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { toggleSidebar, abrirChatEspecifico, obtenerConversaciones, agregarMensajeEnVivo } from '../../../store/features/chat/chatSlice';
import { socketService } from '../../../services/socketService';
import ChatWindow from '../ChatWindow/ChatWindow';
import './ChatListSidebar.css';

// Función helper segura
const getMyId = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload).id; 
    } catch (e) { return null; }
};

const ChatListSidebar = () => {
  const dispatch = useDispatch();
  const { isOpen, activeChat, conversaciones } = useSelector(state => state.chat);
  const [busqueda, setBusqueda] = useState('');
  
  const currentUserId = getMyId(); 

  useEffect(() => {
    if (isOpen) dispatch(obtenerConversaciones());
  }, [dispatch, isOpen]);

  useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    socketService.connect(token);

    // CORRECCIÓN 3: 'nuevo_mensaje' -> 'new_message'
    socketService.on('new_message', (mensaje) => {
      console.log('📩 Mensaje recibido:', mensaje);
      dispatch(agregarMensajeEnVivo(mensaje)); 
    });
  }

  return () => {
    // CORRECCIÓN 3: Desuscribirse del nombre correcto
    socketService.off('new_message');
  };
}, [dispatch]);

  const chatsFiltrados = conversaciones.filter(chat => {
    const esPublicante = chat.publicante_id === currentUserId;
    const otroUsuario = esPublicante ? chat.cliente : chat.publicante;
    
    // Safety check por si otroUsuario viene null
    const nombreCompleto = `${otroUsuario?.nombre || ''} ${otroUsuario?.apellido || ''}`.toLowerCase();
    
    return nombreCompleto.includes(busqueda.toLowerCase());
  });

  // Helper para renderizar nombre seguro
  const getDisplayName = (usuario) => {
    if (!usuario) return "Usuario Desconocido";
    return `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || "Usuario";
  };

  return (
    <>
      <button 
        className={`chat-opener-btn ${isOpen ? 'hide-btn' : ''}`} 
        onClick={() => dispatch(toggleSidebar(true))}
      >
        <LeftOutlined style={{ fontSize: '24px' }} />
      </button>

      <div className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
        
        {activeChat ? (
          <ChatWindow 
            chat={activeChat}
            currentUserId={currentUserId}
            onBack={() => dispatch(abrirChatEspecifico(null))} 
          />
        ) : (
          <>
            <div className="chat-header">
              <span className="header-title">Mensajes</span>
              <button className="close-panel-btn" onClick={() => dispatch(toggleSidebar(false))}>
                 <RightOutlined />
              </button>
            </div>

            <div className="search-container">
              <Input
                placeholder="buscar usuario..."
                prefix={<SearchOutlined style={{ color: 'white', fontSize: '18px' }} />}
                className="chat-searchbar"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="chat-list-scroll">
              <List
                itemLayout="horizontal"
                dataSource={chatsFiltrados}
                renderItem={(chat) => {
                  const esPublicante = chat.publicante_id === currentUserId;
                  const otroUsuario = esPublicante ? chat.cliente : chat.publicante;
                  
                  const ultimoMensaje = chat.mensajes && chat.mensajes.length > 0 
                      ? chat.mensajes[chat.mensajes.length - 1] 
                      : null;

                  // Lógica para cortar mensaje largo en la vista previa
                  const previewMsg = ultimoMensaje 
                    ? (ultimoMensaje.contenido.length > 30 
                        ? ultimoMensaje.contenido.substring(0, 30) + '...' 
                        : ultimoMensaje.contenido)
                    : 'Sin mensajes';

                  return (
                    <List.Item 
                      className="chat-item"
                      onClick={() => dispatch(abrirChatEspecifico(chat))}
                    >
                      <List.Item.Meta
                        // OJO: Unifiqué a .foto (revisa tu BD si es foto o foto_perfil)
                        avatar={<Avatar size={50} src={otroUsuario?.foto || otroUsuario?.foto_perfil || "https://via.placeholder.com/50"} />}
                        title={<span className="chat-item-name">{getDisplayName(otroUsuario)}</span>}
                        description={
                          <div className="chat-item-last-msg">
                             {previewMsg}
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatListSidebar;