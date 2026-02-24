import React, { useState, useEffect } from 'react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiStar, FiUsers, FiKey, FiEye, FiEyeOff } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Swal from 'sweetalert2';
import './ItemSalonAdmin.css';

const ItemSalonAdmin = ({ 
  salon, 
  isExpanded, 
  onToggleExpand, 
  onEliminar,
  estadisticas // Objeto con rating, totalReservas, ultimaReserva, ultimoIngreso
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [salonStats, setSalonStats] = useState(estadisticas || {
    rating: 0,
    totalReservas: 0,
    ultimaReserva: null,
    ultimoIngreso: 0,
    ultimaReservaFecha: null
  });

  // Actualizar estadísticas cuando cambien
  useEffect(() => {
    if (estadisticas) {
      setSalonStats(estadisticas);
    }
  }, [estadisticas]);

  // Función para obtener tiempo relativo
  const getRelativeTime = (fecha) => {
    if (!fecha) return 'Sin reservas';
    try {
      return formatDistanceToNow(parseISO(fecha), { addSuffix: true, locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Formatear ubicación (departamento, provincia)
  const getUbicacion = (direccion) => {
    if (!direccion) return 'Ubicación no disponible';
    const partes = direccion.split(',');
    if (partes.length > 1) {
      // Tomar las últimas dos partes (departamento, provincia)
      const ubicacion = partes.slice(-2).join(',').trim();
      return ubicacion;
    }
    return direccion;
  };

  // Manejar eliminación con SweetAlert2
  const handleEliminarClick = () => {
    setShowMenu(false);
    Swal.fire({
      title: '¿Eliminar salón?',
      text: `¿Estás seguro de que deseas eliminar el salón "${salon.nombre}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AD1519',
      cancelButtonColor: '#787878',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#FFFFFF',
      customClass: {
        title: 'swal-title',
        htmlContainer: 'swal-text',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onEliminar(salon.id_salon);
      }
    });
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={`item-salon-admin ${isExpanded ? 'expanded' : ''}`}>
      {/* Imagen */}
      <div className="salon-imagen-wrapper">
        <img 
          src={salon.fotos?.[0] || 'https://via.placeholder.com/323x176?text=Salón'} 
          alt={salon.nombre}
          className="salon-imagen"
        />
      </div>

      {/* Contenido principal */}
      <div className="salon-content">
        {/* Fila 1: Nombre */}
        <div className="salon-nombre-row">
          <h2 className="salon-nombre">{salon.nombre}</h2>
        </div>

        {/* Fila 2: Ubicación */}
        <div className="salon-ubicacion-row">
          <p className="salon-ubicacion">{getUbicacion(salon.direccion)}</p>
        </div>

        {/* Fila 3: Rating, Capacidad, Dueño */}
        <div className="salon-stats-row">
          <div className="stat-item">
            <FiStar className="stat-icon" />
            <span className="stat-number">{salonStats.rating.toFixed(1)}</span>
          </div>
          <div className="stat-item">
            <FiUsers className="stat-icon" />
            <span className="stat-number">{salon.capacidad}</span>
          </div>
          <div className="stat-item">
            <FiKey className="stat-icon" />
            <span className="stat-number">{salon.publicador?.nombre || 'Dueño'}</span>
          </div>
        </div>

        {/* Fila 4: Precio por hora */}
        <div className="salon-precio-row">
          <p className="salon-precio">${salon.precio_por_hora?.toLocaleString('es-CL')} / hora</p>
        </div>

        {/* Columna derecha: Estadísticas de reservas */}
        <div className="reservas-stats-col">
          <p className="reservas-cantidad">
            {salonStats.totalReservas} {salonStats.totalReservas === 1 ? 'Reserva' : 'Reservas'}
          </p>
          <p className="reservas-ultima">
            {salonStats.ultimaReservaFecha ? `Última: ${getRelativeTime(salonStats.ultimaReservaFecha)}` : 'Sin reservas'}
          </p>
          <p className="reservas-monto">
            ${salonStats.ultimoIngreso?.toLocaleString('es-CL')}
          </p>
          <p className="reservas-fecha">
            Ingresados {salonStats.ultimaReservaFecha ? format(parseISO(salonStats.ultimaReservaFecha), 'dd/MM/yy') : 'hoy'}
          </p>
        </div>

        {/* Acciones */}
        <div className="acciones-wrapper">
          {/* Botón Ver/Ocultar detalles */}
          <div className="accion-icono" onClick={onToggleExpand} title={isExpanded ? "Ocultar detalles" : "Ver detalles"}>
            {isExpanded ? <FiEyeOff size={20} color="#2D241E" /> : <FiEye size={20} color="#2D241E" />}
          </div>
          
          {/* Menú de 3 puntos */}
          <div className="accion-icono menu-container" onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}>
            <BsThreeDotsVertical size={20} color="#2D241E" />
            {showMenu && (
              <div className="menu-desplegable" onClick={(e) => e.stopPropagation()}>
                <div className="menu-item" onClick={handleEliminarClick}>
                  Eliminar Salón
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección expandible */}
      {isExpanded && (
        <div className="salon-historial">
          <h4 className="historial-titulo">Detalles del Salón</h4>
          
          <div className="historial-grid">
            {/* Información básica */}
            <div className="historial-seccion">
              <h5 className="historial-seccion-titulo">Información General</h5>
              <div className="historial-item">
                <span className="historial-label">ID Salón:</span>
                <span className="historial-valor">#{salon.id_salon}</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Capacidad:</span>
                <span className="historial-valor">{salon.capacidad} personas</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Precio por hora:</span>
                <span className="historial-valor">${salon.precio_por_hora?.toLocaleString('es-CL')}</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Dirección completa:</span>
                <span className="historial-valor">{salon.direccion}</span>
              </div>
            </div>

            {/* Información del dueño */}
            <div className="historial-seccion">
              <h5 className="historial-seccion-titulo">Dueño/Publicador</h5>
              <div className="historial-item">
                <span className="historial-label">Nombre:</span>
                <span className="historial-valor">
                  {salon.publicador?.nombre} {salon.publicador?.apellido}
                </span>
              </div>
              <div className="historial-item">
                <span className="historial-label">ID Usuario:</span>
                <span className="historial-valor">#{salon.publicador?.id_usuario}</span>
              </div>
            </div>

            {/* Estadísticas detalladas */}
            <div className="historial-seccion">
              <h5 className="historial-seccion-titulo">Estadísticas</h5>
              <div className="historial-item">
                <span className="historial-label">Rating promedio:</span>
                <span className="historial-valor">{salonStats.rating.toFixed(1)} ★</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Total reservas:</span>
                <span className="historial-valor">{salonStats.totalReservas}</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Última reserva:</span>
                <span className="historial-valor">
                  {salonStats.ultimaReservaFecha 
                    ? format(parseISO(salonStats.ultimaReservaFecha), 'dd/MM/yyyy HH:mm')
                    : 'Sin reservas'}
                </span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Último ingreso:</span>
                <span className="historial-valor">${salonStats.ultimoIngreso?.toLocaleString('es-CL')}</span>
              </div>
            </div>

            {/* Equipamiento (si existe) */}
            {salon.equipamientos && salon.equipamientos.length > 0 && (
              <div className="historial-seccion">
                <h5 className="historial-seccion-titulo">Equipamiento</h5>
                <div className="historial-equipamientos">
                  {salon.equipamientos.map((equipo, index) => (
                    <span key={index} className="equipamiento-tag">{equipo}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reglas (si existen) */}
            {salon.reglas && salon.reglas.length > 0 && (
              <div className="historial-seccion">
                <h5 className="historial-seccion-titulo">Reglas</h5>
                <ul className="historial-reglas">
                  {salon.reglas.map((regla, index) => (
                    <li key={index}>{regla}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSalonAdmin;