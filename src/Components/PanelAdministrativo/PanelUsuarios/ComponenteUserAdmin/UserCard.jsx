import React, { useState, useEffect, useMemo } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2'; 
import axios from 'axios';
import './UserCard.css';

const API_URL = 'http://localhost:3000';

// modificar formato de ID para que siempre tenga 8 dígitos (ej:#00001234)
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

const getRelativeTimeSimple = (dateString) => {
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
      return diffMinutes === 0 ? 'Ahora mismo' : `Hace ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} h`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} d`;
    } else if (diffWeeks < 4) {
      return `Hace ${diffWeeks} sem`;
    } else {
      return `Hace ${diffMonths} meses`;
    }
  } catch (error) {
    return 'Fecha inválida';
  }
};

const formatCurrency = (amount) => {
  if (!amount || amount === 0) return '$0';
  
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Función para formatear como en StatCard (ej: $1.2K)
const formatCompactCurrency = (amount) => {
  if (!amount || amount === 0) return '$0';
  
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount}`;
};

const UserCard = ({ user, selectedMonth, onDeleteUser, onUserUpdated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userStatus, setUserStatus] = useState(user.estado || 'activo');
  const [reservasDelUsuario, setReservasDelUsuario] = useState([]);
  const [transaccionesDelUsuario, setTransaccionesDelUsuario] = useState([]);
  const [loading, setLoading] = useState(false);

  // Actualizar estado local cuando cambia el user
  useEffect(() => {
    setUserStatus(user.estado || 'activo');
  }, [user.estado]);

  // Obtener reservas y transacciones del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id_usuario) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        
        console.log(`🔍 Obteniendo datos para usuario ${user.id_usuario} - ${user.nombre}`);
        
        // Obtener todas las reservas del mes
        const reservasResponse = await axios.get(
          `${API_URL}/reservas/admin?month=${selectedMonth}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Obtener todas las transacciones del mes
        const transaccionesResponse = await axios.get(
          `${API_URL}/transacciones/admin?month=${selectedMonth}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        console.log('📊 Reservas del mes:', reservasResponse.data);
        console.log('📊 Transacciones del mes:', transaccionesResponse.data);
        
        // Filtrar reservas del usuario actual
        const reservasUsuario = reservasResponse.data.filter(
          reserva => reserva.arrendatario?.id_usuario === user.id_usuario
        );
        
        console.log('📊 Reservas del usuario:', reservasUsuario);
        
        // Obtener IDs de las reservas del usuario
        const idsReservasUsuario = reservasUsuario.map(r => r.id_reserva);
        
        // Filtrar transacciones que pertenezcan a las reservas del usuario
        // Buscar por diferentes posibles campos de relación
        const transaccionesUsuario = transaccionesResponse.data.filter(transaccion => {
          // Intentar diferentes formas de relacionar la transacción con la reserva
          const coincidePorReservaId = idsReservasUsuario.includes(transaccion.reservaIdReserva);
          const coincidePorIdReserva = idsReservasUsuario.includes(transaccion.id_reserva);
          const coincidePorReserva = transaccion.reserva && idsReservasUsuario.includes(transaccion.reserva.id_reserva);
          
          return coincidePorReservaId || coincidePorIdReserva || coincidePorReserva;
        });
        
        console.log(`👤 Usuario ${user.nombre}:`, {
          reservasEncontradas: reservasUsuario.length,
          transaccionesEncontradas: transaccionesUsuario.length,
          idsReservas: idsReservasUsuario,
          transacciones: transaccionesUsuario.map(t => ({
            id: t.id_transaccion,
            monto: t.monto_pagado || t.monto,
            reservaId: t.reservaIdReserva || t.id_reserva || t.reserva?.id_reserva
          }))
        });
        
        setReservasDelUsuario(reservasUsuario);
        setTransaccionesDelUsuario(transaccionesUsuario);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setReservasDelUsuario([]);
        setTransaccionesDelUsuario([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id_usuario, selectedMonth]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    // Total de reservas del mes
    const totalReservas = reservasDelUsuario.length;
    
    // Encontrar la última reserva (por fecha de creación)
    let ultimaReserva = null;
    let ultimoMonto = 0;
    let ultimaTransaccion = null;
    
    if (reservasDelUsuario.length > 0) {
      // Ordenar por fecha de creación (más reciente primero)
      const reservasOrdenadas = [...reservasDelUsuario].sort(
        (a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      );
      
      ultimaReserva = reservasOrdenadas[0];
      
      // Buscar transacción asociada a la última reserva (buscando de múltiples formas)
      ultimaTransaccion = transaccionesDelUsuario.find(t => {
        const coincidePorReservaId = t.reservaIdReserva === ultimaReserva.id_reserva;
        const coincidePorIdReserva = t.id_reserva === ultimaReserva.id_reserva;
        const coincidePorReserva = t.reserva && t.reserva.id_reserva === ultimaReserva.id_reserva;
        
        return coincidePorReservaId || coincidePorIdReserva || coincidePorReserva;
      });
      
      if (ultimaTransaccion) {
        ultimoMonto = ultimaTransaccion.monto_pagado || ultimaTransaccion.monto || 0;
      }
    }
    
    console.log('📊 Stats calculados:', {
      totalReservas,
      ultimaReserva: ultimaReserva?.id_reserva,
      ultimoMonto,
      ultimaTransaccion: ultimaTransaccion?.id_transaccion
    });
    
    return {
      totalReservas,
      ultimaReserva,
      ultimoMonto,
      ultimaTransaccion
    };
  }, [reservasDelUsuario, transaccionesDelUsuario]);

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

  // Obtener las últimas 2 reservas para la sección expandida
  const ultimasDosReservas = reservasDelUsuario.slice(0, 2);

  return (
    <div className={`user-card ${isExpanded ? 'expanded' : ''}`}>
      {/* CONTENIDO PRINCIPAL (siempre visible) */}
      <div className="user-card-content">
        {/* Columna 1: Avatar */}
        <div className="user-card-avatar-col">
          <div className="user-avatar">
            <img
              src={profilePicUrl}
              alt={`${user.nombre} ${user.apellido}`}
            />
          </div>
        </div>

        {/* Columna 2: Información del usuario */}
        <div className="user-card-info-col">
          <div className="user-info-header">
            <h3 className="user-name">{`${user.nombre} ${user.apellido}`}</h3>
            <div className={`user-status-badge ${userStatus}`}>
              {userStatus === 'activo' ? 'Activo' : 'Bloqueado'}
            </div>
          </div>
          <p className="user-email">{user.email}</p>
          <p className="user-phone">{user.telefono || 'Sin teléfono'}</p>
        </div>

        {/* Columna 3: Estadísticas de reservas */}
        <div className="user-card-stats-col">
          <div className="stats-header">
            <span className="stats-count">{stats.totalReservas}</span>
            <span className="stats-label">Reservas</span>
          </div>
          {stats.ultimaReserva ? (
            <div className="stats-row">
              <span className="stats-row-label">Última:</span>
              <span className="stats-row-value">{getRelativeTimeSimple(stats.ultimaReserva.fecha_creacion)}</span>
            </div>
          ) : (
            <div className="stats-row">
              <span className="stats-row-label">Última:</span>
              <span className="stats-row-value">Sin actividad</span>
            </div>
          )}
        </div>

        {/* Columna 4: Monto - CON TEXTO PENDIENTE */}
        <div className="user-card-amount-col">
          {stats.ultimoMonto > 0 ? (
            <>
              <div className="amount-header">
                <span className="amount-value">{formatCompactCurrency(stats.ultimoMonto)}</span>
              </div>
              <div className="amount-row">
                <span className="amount-row-value">
                  {getRelativeTimeSimple(stats.ultimaTransaccion?.fecha_transaccion || stats.ultimaReserva?.fecha_creacion)}
                </span>
              </div>
            </>
          ) : stats.ultimaReserva ? (
            // Caso: Hay reserva pero no tiene transacción aprobada
            <>
              <div className="amount-header">
                <span className="amount-value pending-text">Pendiente</span>
              </div>
              <div className="amount-row">
                <span className="amount-row-value pending-text">Pendiente</span>
              </div>
            </>
          ) : (
            // Caso: No hay reservas
            <>
              <div className="amount-header">
                <span className="amount-value">$0</span>
              </div>
              <div className="amount-row">
                <span className="amount-row-value">Sin actividad</span>
              </div>
            </>
          )}
        </div>

        {/* Columna 5: Acciones */}
        <div className="user-card-actions-col">
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

      {/* SECCIÓN EXPANDIBLE */}
      {isExpanded && (
        <div className="user-card-expanded">
          {loading ? (
            <div className="expanded-loading">Cargando actividad...</div>
          ) : (
            <div className="expanded-actividad-lista">
              {/* Mostrar TODAS las reservas del mes */}
              {reservasDelUsuario.length > 0 ? (
                <>
                  {reservasDelUsuario.map((reserva) => {
                    // Buscar transacción asociada a esta reserva
                    const transaccionAsociada = transaccionesDelUsuario.find(t => {
                      const coincidePorReservaId = t.reservaIdReserva === reserva.id_reserva;
                      const coincidePorIdReserva = t.id_reserva === reserva.id_reserva;
                      const coincidePorReserva = t.reserva && t.reserva.id_reserva === reserva.id_reserva;
                      
                      return coincidePorReservaId || coincidePorIdReserva || coincidePorReserva;
                    });
                    
                    return (
                      <div key={reserva.id_reserva} className="expanded-actividad-item">
                        <div className="expanded-actividad-texto">
                          <span className="expanded-actividad-destacado">{user.nombre} {user.apellido}</span>
                          <span className="expanded-actividad-normal"> hizo una reserva en el </span>
                          <span className="expanded-actividad-destacado">{reserva.salon?.nombre || 'Salón'}</span>
                        </div>
                        <div className="expanded-actividad-footer">
                          <span className="expanded-actividad-id">Reserva #{formatId(reserva.id_reserva)}</span>
                          <span className="expanded-actividad-tiempo">
                            {transaccionAsociada 
                              ? formatCompactCurrency(transaccionAsociada.monto_pagado || transaccionAsociada.monto)
                              : 'Sin pago'
                            }
                          </span>
                        </div>
                        <div className="expanded-actividad-linea"></div>
                      </div>
                    );
                  })}
                  
                  {/* Línea separadora opcional entre reservas y creación de usuario */}
                  <div style={{ margin: '8px 0' }}></div>
                </>
              ) : (
                <div className="expanded-actividad-item">
                  <div className="expanded-actividad-texto">
                    <span className="expanded-actividad-normal">No hay reservas en este mes</span>
                  </div>
                  <div className="expanded-actividad-linea"></div>
                </div>
              )}
              
              {/* Datos de creación del usuario (siempre visible) */}
              <div className="expanded-actividad-item">
                <div className="expanded-actividad-texto">
                  <span className="expanded-actividad-destacado">{user.nombre} {user.apellido}</span>
                  <span className="expanded-actividad-normal"> se unió como usuario</span>
                </div>
                <div className="expanded-actividad-footer">
                  <span className="expanded-actividad-id">Usuario #{formatId(user.id_usuario)}</span>
                  <span className="expanded-actividad-tiempo">{getRelativeTimeDetailed(user.fecha_creacion)}</span>
                </div>
                <div className="expanded-actividad-linea"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;