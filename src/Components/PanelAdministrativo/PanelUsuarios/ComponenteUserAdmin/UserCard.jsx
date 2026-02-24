import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2'; 
import axios from 'axios';
import './UserCard.css';

const API_URL = 'http://localhost:3000';

//modificar formato de ID para que siempre tenga 8 dígitos (ej:#00001234)
const formatId = (id) => {
  return String(id).padStart(8, '0');
};

const getRelativeTimeDetailed = (dateString) => {
  if (!dateString) return 'Sin actividad';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else if (diffWeeks < 4) {
      return `Hace ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`;
    } else {
      return `Hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
    }
  } catch (error) {
    return 'Fecha inválida';
  }
};

const UserCard = ({ user, selectedMonth, onDeleteUser, onUserUpdated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState(user.estado || 'activo');

  // Actualizar estado local cuando cambia el user
  useEffect(() => {
    setUserStatus(user.estado || 'activo');
  }, [user.estado]);

  // Obtener reservas del usuario - SOLO cuando se expande
  useEffect(() => {
    const fetchReservas = async () => {
      if (!user?.id_usuario || !isExpanded) return; 
      
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        
        const response = await axios.get(
          `${API_URL}/reservas/admin?month=${selectedMonth}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const reservasDelUsuario = response.data.filter(
          reserva => reserva.arrendatario?.id_usuario === user.id_usuario
        );
        
        // Ordenar por fecha (más recientes primero)
        const reservasOrdenadas = reservasDelUsuario.sort(
          (a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        );
        
        setReservas(reservasOrdenadas);
      } catch (error) {
        console.error('Error fetching reservas:', error);
        setReservas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user?.id_usuario, selectedMonth, isExpanded]);

  // URL de la foto de perfil
  const profilePicUrl = user.foto_perfil || 'https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp';

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleToggleBlockUser = async () => {
    setShowMenu(false);
    
    const nuevaAccion = userStatus === 'activo' ? 'bloquear' : 'desbloquear';
    const nuevoEstado = userStatus === 'activo' ? 'bloqueado' : 'activo';
    
    const result = await Swal.fire({
      title: `${nuevaAccion === 'bloquear' ? 'Bloquear' : 'Desbloquear'} usuario?`,
      text: `¿Estás seguro de ${nuevaAccion} a ${user.nombre} ${user.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: nuevaAccion === 'bloquear' ? '#AD1519' : '#55AB52',
      cancelButtonColor: '#787878',
      confirmButtonText: `Sí, ${nuevaAccion}`,
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.patch(`${API_URL}/usuarios/${user.id_usuario}/estado`, {
          estado: nuevoEstado
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserStatus(nuevoEstado);

        await Swal.fire({
          title: '¡Actualizado!',
          text: `El usuario ha sido ${nuevaAccion} correctamente.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        if (onUserUpdated) {
          onUserUpdated();
        }
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || `No se pudo ${nuevaAccion} el usuario.`,
          icon: 'error',
          confirmButtonColor: '#C8AD7F'
        });
      }
    }
  };

  // Obtener las últimas 2 reservas
  const ultimasDosReservas = reservas.slice(0, 2);

  return (
    <div className={`user-card ${isExpanded ? 'expanded' : ''}`}>
      {/* CONTENIDO PRINCIPAL (siempre visible) */}
      <div className="user-card-content">
        {/* Avatar */}
        <div className="user-avatar">
          <img
            src={profilePicUrl}
            alt={`${user.nombre} ${user.apellido}`}
          />
        </div>

        {/* Información del usuario */}
        <div className="user-info">
          <h3 className="user-name">{`${user.nombre} ${user.apellido}`}</h3>
          <p className="user-email">{user.email}</p>
          <p className="user-phone">{user.telefono || 'Sin teléfono'}</p>
        </div>

        {/* Estado del usuario (activo/bloqueado) */}
        <div className={`user-status ${userStatus}`}>
          {userStatus === 'activo' ? 'Activo' : 'Bloqueado'}
        </div>

        {/* Acciones */}
        <div className="user-actions">
          <div 
            className="action-icon" 
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Ocultar detalles" : "Ver detalles"}
          >
            {isExpanded ? <FiEyeOff /> : <FiEye />}
          </div>
          
          <div className="action-icon menu-container" onClick={handleMenuClick}>
            <BsThreeDotsVertical />
            {showMenu && (
              <div className="menu-desplegable" onClick={e => e.stopPropagation()}>
                <div className="menu-item" onClick={handleToggleBlockUser}>
                  {userStatus === 'activo' ? 'Bloquear Usuario' : 'Desbloquear Usuario'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN EXPANDIBLE - Se muestra al hacer click en el ojo */}
      {isExpanded && (
        <div className="user-expanded-content">
          {loading ? (
            <div className="actividad-loading">Cargando actividad...</div>
          ) : (
            <div className="actividad-lista">
              {/* PRIMERO: Mostrar las últimas 2 reservas (si existen) */}
              {ultimasDosReservas.length > 0 && (
                <>
                  {ultimasDosReservas.map((reserva) => (
                    <div key={reserva.id_reserva} className="actividad-item">
                      <div className="actividad-texto">
                        <span className="actividad-destacado">{user.nombre} {user.apellido}</span>
                        <span className="actividad-normal"> hizo una reserva en el </span>
                        <span className="actividad-destacado">{reserva.salon?.nombre || 'Salón'}</span>
                      </div>
                      <div className="actividad-footer">
                        <span className="actividad-id">Reserva #{formatId(reserva.id_reserva)}</span>
                        <span className="actividad-tiempo">{getRelativeTimeDetailed(reserva.fecha_creacion)}</span>
                      </div>
                      <div className="actividad-linea"></div>
                    </div>
                  ))}
                </>
              )}
              
              {/* SEGUNDO: Siempre mostrar los datos de creación del usuario */}
              <div className="actividad-item">
                <div className="actividad-texto">
                  <span className="actividad-destacado">{user.nombre} {user.apellido}</span>
                  <span className="actividad-normal"> se unió como usuario</span>
                </div>
                <div className="actividad-footer">
                  <span className="actividad-id">Usuario #{formatId(user.id_usuario)}</span>
                  <span className="actividad-tiempo">{getRelativeTimeDetailed(user.fecha_creacion)}</span>
                </div>
                <div className="actividad-linea"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;