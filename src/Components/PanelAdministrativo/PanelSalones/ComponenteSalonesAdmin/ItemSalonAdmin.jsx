import React, { useState, useEffect } from 'react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiStar, FiUsers, FiKey, FiEye, FiEyeOff, FiDollarSign } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Swal from 'sweetalert2';
import './ItemSalonAdmin.css';

// Función auxiliar para obtener solo departamento y provincia de la dirección
const getUbicacionSimplificada = (direccion) => {
  if (!direccion) return 'Ubicación no disponible';

  const partes = direccion.split(',').map(p => p.trim());

  if (partes.length >= 2) {
    const provincia = partes[partes.length - 1];
    const departamento = partes[partes.length - 2];
    return `${departamento}, ${provincia}`;
  }

  return direccion;
};

// Función para formato de ID
const formatId = (id) => {
  return String(id).padStart(8, '0');
};

// Función para tiempo relativo detallado
const getRelativeTimeDetailed = (dateString) => {
  if (!dateString) return 'Sin fecha';

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

const ItemSalonAdmin = ({
  salon,
  isExpanded,
  onToggleExpand,
  onEliminar,
  onBloquear,
  estadisticas
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [salonStats, setSalonStats] = useState(estadisticas || {
    rating: 0,
    totalReservas: 0,
    ultimaReserva: null,
    ultimoIngreso: 0,
    ultimaReservaFecha: null,
    totalResenias: 0,
    transaccionesCount: 0
  });

  useEffect(() => {
    if (estadisticas) {
      setSalonStats(estadisticas);
    }
  }, [estadisticas]);

  const getEstadoColor = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';

    if (estadoLower === 'aprobada' || estadoLower === 'aprobado') {
      return '#55AB52'; // Verde
    } else if (estadoLower === 'rechazada' || estadoLower === 'rechazado') {
      return '#AD1519'; // Rojo (para bloqueado)
    } else {
      return '#787878'; // Gris para 'borrador', 'oculta'
    }
  };

  const handleEliminarClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    Swal.fire({
      title: '¿Eliminar salón?',
      text: `¿Estás seguro de que deseas eliminar el salón "${salon.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AD1519',
      cancelButtonColor: '#787878',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed && onEliminar) {
        onEliminar(salon.id_salon);
      }
    });
  };

  const handleBloquearClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);

    const nuevoEstado = salon.estado_publicacion === 'rechazada' ? 'aprobada' : 'rechazada';
    const accion = salon.estado_publicacion === 'rechazada' ? 'desbloquear' : 'bloquear';

    Swal.fire({
      title: `¿${accion === 'bloquear' ? 'Bloquear' : 'Desbloquear'} salón?`,
      text: `¿Estás seguro de que deseas ${accion} el salón "${salon.nombre}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#C8AD7F',
      cancelButtonColor: '#787878',
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (onBloquear) {
          onBloquear(salon.id_salon, nuevoEstado);
        } else {
          console.error('❌ onBloquear no está definida');
        }
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const formatFecha = (fecha) => {
    if (!fecha) return 'hoy';
    try {
      return format(parseISO(fecha), 'dd/MM/yy');
    } catch {
      return 'hoy';
    }
  };

  return (
    <div className={`item-salon-admin ${isExpanded ? 'expanded' : ''}`}>
      {/* Contenedor superior con imagen y contenido */}
      <div className="salon-top-content">
        {/* Imagen - izquierda */}
        <div className="salon-imagen-wrapper">
          <img
            src={salon.fotos?.[0] || 'https://via.placeholder.com/290x158?text=Salón'}
            alt={salon.nombre}
            className="salon-imagen"
          />
        </div>

        {/* Contenido principal */}
        <div className="salon-content">
          {/* Contenedor de dos columnas */}
          <div className="salon-main-content">
            {/* Columna izquierda - Información del salón */}
            <div className="salon-info-column">
              {/* Fila 1: Nombre y estado */}
              <div className="salon-header-row">
                <h2 className="salon-nombre">{salon.nombre}</h2>
                <div
                  className="estado-ovalado"
                  style={{
                    backgroundColor: getEstadoColor(salon.estado_publicacion),
                    opacity: 0.5
                  }}
                >
                  {salon.estado_publicacion === 'rechazada' ? 'bloqueado' : salon.estado_publicacion || 'borrador'}
                </div>
              </div>

              {/* Fila 2: Dirección simplificada */}
              <div className="salon-ubicacion-row">
                <p className="salon-ubicacion">
                  {getUbicacionSimplificada(salon.direccion)}
                </p>
              </div>

              {/* Fila 3: Dueño */}
              <div className="salon-dueno-row">
                <div className="stat-item">
                  <FiKey className="stat-icon" />
                  <span className="stat-number">
                    {salon.publicador?.nombre || 'Dueño'} {salon.publicador?.apellido || ''}
                  </span>
                </div>
              </div>

              {/* Fila 4: Precio por hora */}
              <div className="salon-precio-row">
                <p className="salon-precio">
                  ${salon.precio_por_hora?.toLocaleString('es-CL') || '0'} / hora
                </p>
              </div>

              {/* Fila 5: Rating y capacidad */}
              <div className="salon-stats-row">
                <div className="stat-item">
                  <FiStar className="stat-icon" />
                  <span className="stat-number">{salonStats.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <div className="stat-item">
                  <FiUsers className="stat-icon" />
                  <span className="stat-number">{salon.capacidad || 0} pers.</span>
                </div>
              </div>
            </div>

            {/* Columna derecha - Estadísticas de reservas */}
            <div className="reservas-stats-col">
              <div className="reservas-header">
                <FiEye className="reservas-icon" size={14} />
                <span className="reservas-cantidad">
                  {salonStats.totalReservas || 0} {salonStats.totalReservas === 1 ? 'reserva' : 'reservas'}
                </span>
              </div>

              <p className="reservas-ultima">
                {salonStats.ultimaReservaFecha
                  ? `Última: ${getRelativeTimeDetailed(salonStats.ultimaReservaFecha)}`
                  : 'Sin reservas'}
              </p>

              <div className="reservas-monto-container">
                <FiDollarSign size={14} color="#2D241E" />
                <span className="reservas-monto">
                  ${Number(salonStats.ultimoIngreso || 0).toLocaleString('es-CL')}
                </span>
              </div>

              <p className="reservas-fecha">
                Ingresados {salonStats.ultimaReservaFecha
                  ? formatFecha(salonStats.ultimaReservaFecha)
                  : 'hoy'}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="acciones-wrapper">
            {/* Botón Ver/Ocultar detalles */}
            <div
              className="accion-icono"
              onClick={onToggleExpand}
              title={isExpanded ? "Ocultar detalles" : "Ver detalles"}
            >
              {isExpanded ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </div>

            {/* Menú de 3 puntos */}
            <div className="accion-icono menu-container" onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}>
              <BsThreeDotsVertical size={18} />
              {showMenu && (
                <div className="menu-desplegable" onClick={(e) => e.stopPropagation()}>
                  <div className="menu-item" onClick={handleBloquearClick}>
                    {salon.estado_publicacion === 'oculta' ? 'Desbloquear salón' : 'Bloquear salón'}
                  </div>
                  <div className="menu-item" onClick={handleEliminarClick}>
                    Eliminar Salón
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sección expandible - NUEVO FORMATO */}
      {isExpanded && (
        <div className="salon-historial">
          <h4 className="historial-titulo">Detalles del Salón</h4>

          <div className="historial-lista">
            {/* ITEM 1: Creación del salón */}
            <div className="historial-item-detalle">
              <div className="historial-texto">
                <span className="historial-destacado">{salon.nombre}</span>
                <span className="historial-normal"> fue publicado</span>
              </div>
              <div className="historial-footer">
                <span className="historial-id">Salón #{formatId(salon.id_salon)}</span>
                <span className="historial-tiempo">
                  {getRelativeTimeDetailed(salon.fecha_creacion)}
                </span>
              </div>
              <div className="historial-linea"></div>
            </div>

            {/* ITEM 2: Información del dueño */}
            <div className="historial-item-detalle">
              <div className="historial-texto">
                <span className="historial-destacado">
                  {salon.publicador?.nombre || ''} {salon.publicador?.apellido || ''}
                </span>
                <span className="historial-normal"> es el propietario</span>
              </div>
              <div className="historial-footer">
                <span className="historial-id">
                  Usuario #{formatId(salon.publicador?.id_usuario || 'N/A')}
                </span>
                <span className="historial-tiempo">
                  {salon.publicador?.email || 'Email no disponible'}
                </span>
              </div>
              <div className="historial-linea"></div>
            </div>

            {/* ITEM 3: Estadísticas de reservas del mes */}
            {salonStats.totalReservas > 0 ? (
              <div className="historial-item-detalle">
                <div className="historial-texto">
                  <span className="historial-destacado">{salonStats.totalReservas}</span>
                  <span className="historial-normal"> reservas en el mes</span>
                </div>
                <div className="historial-footer">
                  <span className="historial-id">
                    Último ingreso: ${Number(salonStats.ultimoIngreso || 0).toLocaleString('es-CL')}
                  </span>
                  <span className="historial-tiempo">
                    {salonStats.ultimaReservaFecha
                      ? getRelativeTimeDetailed(salonStats.ultimaReservaFecha)
                      : 'Sin reservas'}
                  </span>
                </div>
                <div className="historial-linea"></div>
              </div>
            ) : (
              <div className="historial-item-detalle">
                <div className="historial-texto">
                  <span className="historial-normal">Sin reservas en el mes</span>
                </div>
                <div className="historial-footer">
                  <span className="historial-id">Esperando reservas</span>
                  <span className="historial-tiempo">-</span>
                </div>
                <div className="historial-linea"></div>
              </div>
            )}

            {/* ITEM 4: Reseñas (si existen) */}
            {salonStats.totalResenias > 0 && (
              <div className="historial-item-detalle">
                <div className="historial-texto">
                  <span className="historial-destacado">{salonStats.rating?.toFixed(1)} ★</span>
                  <span className="historial-normal"> en {salonStats.totalResenias} reseñas</span>
                </div>
                <div className="historial-footer">
                  <span className="historial-id">Rating promedio</span>
                  <span className="historial-tiempo">{salonStats.totalResenias} reseñas</span>
                </div>
                <div className="historial-linea"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSalonAdmin;
