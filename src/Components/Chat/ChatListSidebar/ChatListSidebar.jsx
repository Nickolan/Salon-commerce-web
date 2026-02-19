import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Avatar, List, Badge } from 'antd';
import { SearchOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { 
  toggleSidebar, 
  abrirChatEspecifico, 
  obtenerConversaciones, 
  agregarMensajeEnVivo 
} from '../../../store/features/chat/chatSlice';
import { socketService } from '../../../services/socketService';
import ChatWindow from '../ChatWindow/ChatWindow';
import './ChatListSidebar.css';

// Función helper segura para obtener mi ID desde el Token
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

  // 2. EFECTO: CARGAR CONVERSACIONES AL ABRIR
  useEffect(() => {
    if (isOpen) {
        dispatch(obtenerConversaciones());
    }
  }, [dispatch, isOpen]);

  // 3. EFECTO GLOBAL: CONEXIÓN SOCKET Y ESCUCHA DE MENSAJES
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Conectamos el socket (si no estaba conectado)
      socketService.connect(token);

      // Escuchamos mensajes nuevos de CUALQUIER chat
      socketService.on('new_message', (mensaje) => {
        console.log('📩 Mensaje recibido en Sidebar:', mensaje);
        // Esto actualizará la lista y subirá el contador si el chat está cerrado
        dispatch(agregarMensajeEnVivo(mensaje)); 
      });
    }

    // Limpieza al desmontar
    return () => {
      socketService.off('new_message');
    };
  }, [dispatch]);

  // 4. FILTRADO DE CHATS (BUSCADOR)
  const chatsFiltrados = conversaciones.filter(chat => {
    // Definir quién es el "otro"
    const esPublicante = chat.publicante_id === currentUserId;
    const otroUsuario = esPublicante ? chat.cliente : chat.publicante;
    
    // Búsqueda segura (evita error si nombre es null)
    const nombreCompleto = `${otroUsuario?.nombre || ''} ${otroUsuario?.apellido || ''}`.toLowerCase();
    
    return nombreCompleto.includes(busqueda.toLowerCase());
  });

  // Helper para mostrar nombre
  const getDisplayName = (usuario) => {
    if (!usuario) return "Usuario Desconocido";
    return `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || "Usuario";
  };

  return (
    <>
      {/* BOTÓN FLOTANTE PARA ABRIR SIDEBAR */}
      <button 
        className={`chat-opener-btn ${isOpen ? 'hide-btn' : ''}`} 
        onClick={() => dispatch(toggleSidebar(true))}
      >
        <LeftOutlined style={{ fontSize: '24px' }} />
      </button>

      {/* CONTENEDOR SIDEBAR */}
      <div className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
        
        {/* VISTA 1: VENTANA DE CHAT ACTIVA */}
        {activeChat ? (
          <ChatWindow 
            chat={activeChat}
            currentUserId={currentUserId}
            onBack={() => dispatch(abrirChatEspecifico(null))} // null cierra chat, vuelve a lista
          />
        ) : (
          /* VISTA 2: LISTADO DE CONVERSACIONES */
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
                  // Determinar datos del otro usuario
                  const esPublicante = chat.publicante_id === currentUserId;
                  const otroUsuario = esPublicante ? chat.cliente : chat.publicante;
                  
                  // Último mensaje para preview
                  const ultimoMensaje = chat.mensajes && chat.mensajes.length > 0 
                      ? chat.mensajes[chat.mensajes.length - 1] 
                      : null;

                  // Recortar texto largo
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
                        avatar={
                          // BADGE: Muestra contador si es > 0
                          <Badge count={chat.unread_count} overflowCount={99} offset={[-5, 5]}>
                             <Avatar 
                               size={50} 
                               src={otroUsuario?.foto || otroUsuario?.foto_perfil || "https://via.placeholder.com/50"} 
                             />
                          </Badge>
                        }
                        title={
                            <span className="chat-item-name">
                                {getDisplayName(otroUsuario)}
                            </span>
                        }
                        description={
                          // Si hay mensajes no leídos, ponemos el texto en negrita (clase unread-bold)
                          <div className={`chat-item-last-msg ${chat.unread_count > 0 ? 'unread-bold' : ''}`}>
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