import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Avatar, List } from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { toggleSidebar, abrirChatEspecifico, obtenerConversaciones } from '../../../store/features/chat/chatSlice';
import ChatWindow from '../ChatWindow/ChatWindow';
import './ChatListSidebar.css';

// Función helper para decodificar ID (puedes moverla a utils)
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
  
  // 1. OBTENEMOS MI ID REAL
  const currentUserId = getMyId(); 

  useEffect(() => {
    if (isOpen) dispatch(obtenerConversaciones());
  }, [dispatch, isOpen]);

  // 2. LÓGICA DE FILTRADO DINÁMICA
  const chatsFiltrados = conversaciones.filter(chat => {
    // Definir quién es el "otro"
    const esPublicante = chat.publicante_id === currentUserId;
    const otroUsuario = esPublicante ? chat.cliente : chat.publicante;

    // Filtrar por el nombre del OTRO (sea cliente o publicante)
    return otroUsuario?.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

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
            onBack={() => dispatch(abrirChatEspecifico(null))} // null cierra la ventana, vuelve a lista
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
                  // 3. DETERMINAR VISUALMENTE QUIÉN ES EL OTRO EN CADA ITEM
                  const esPublicante = chat.publicante_id === currentUserId;
                  const otroUsuario = esPublicante ? chat.cliente : chat.publicante;
                  
                  const ultimoMensaje = chat.mensajes && chat.mensajes.length > 0 
                      ? chat.mensajes[chat.mensajes.length - 1] 
                      : null;

                  return (
                    <List.Item 
                      className="chat-item"
                      onClick={() => dispatch(abrirChatEspecifico(chat))}
                    >
                      <List.Item.Meta
                        // Usamos los datos de "otroUsuario"
                        avatar={<Avatar size={50} src={otroUsuario?.foto_perfil || "https://via.placeholder.com/50"} />}
                        title={<span className="chat-item-name">{otroUsuario?.nombre + " " + otroUsuario?.apellido || "Usuario"}</span>}
                        description={
                          <div className="chat-item-last-msg">
                             {ultimoMensaje ? ultimoMensaje.contenido : 'Sin mensajes'}
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