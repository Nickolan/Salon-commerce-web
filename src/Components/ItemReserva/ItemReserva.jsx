import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { useSelector } from 'react-redux';
// Importamos más iconos para detalles
import { FiMapPin, FiClock, FiCalendar, FiCheckCircle, FiAlertCircle, FiXCircle, FiInfo, FiTag, FiUser } from "react-icons/fi";
import './ItemReserva.css'; // Usaremos este archivo CSS actualizado

const ItemReserva = ({ reserva }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Navegar al detalle del salón al hacer clic en el nombre
  const handleVerDetalleSalon = (e) => {
    e.stopPropagation(); // Evita que se active el clic del contenedor
    if (reserva.salon?.id_salon) {
      navigate(`/salon/${reserva.salon.id_salon}`);
    }
  };

  // Función para obtener icono, clase y texto según el estado (sin cambios)
  const getEstadoInfo = (estado) => {
    switch (estado) {
      case 'confirmada':
        return { icon: <FiCheckCircle />, className: 'estado-confirmada', texto: 'Confirmada' };
      case 'cancelada':
        return { icon: <FiXCircle />, className: 'estado-cancelada', texto: 'Cancelada' };
      case 'completada':
        return { icon: <FiCheckCircle />, className: 'estado-completada', texto: 'Completada' };
      case 'creada':
      default:
        return { icon: <FiAlertCircle />, className: 'estado-pendiente', texto: 'Pendiente' };
    }
  };

  const handleReseniarClick = (e) => {
    e.stopPropagation();
    // Navegamos a la pantalla de reseñar
    navigate(`/reseniar/${reserva.salon.id_salon}`, {
      // Pasamos el ID de la reserva en el 'state' de la navegación
      state: {
        id_reserva: reserva.id_reserva,
        // Opcional: pasamos el estado 'desdeMisReservas' que ya usabas
        desdeMisReservas: true
      }
    });
  };

  const handleCancelarClick = (e) => {
    e.stopPropagation();
    if (!user) return; // Seguridad
    // 3. Navegar a la pantalla de cancelación con los IDs correctos
    navigate(`/cancelar_salon/${user.id_usuario}/${reserva.id_reserva}`);
  };

  const estadoInfo = getEstadoInfo(reserva.estado_reserva);

  // Formatear fechas y horas (sin cambios)
  const fechaFormateada = reserva.fecha_reserva ? format(parseISO(reserva.fecha_reserva), 'PPP', { locale: es }) : 'Fecha no disponible'; // PPP -> 19 oct 2025
  const horaInicioFormateada = reserva.hora_inicio;
  const horaFinFormateada = reserva.hora_fin;

  return (
    // Usamos clases similares a ItemMiSalon para reutilizar/adaptar estilos
    <div className={`card-reserva item-reserva estado-${reserva.estado_reserva}`}>
      <div className='card-imagen-wrapper reserva-imagen-wrapper'>
        <img
          src={reserva.salon?.fotos?.[0] || 'https://via.placeholder.com/150'}
          alt={reserva.salon?.nombre || 'Salón'}
          className='card-imagen reserva-imagen'
        />
        {/* Etiqueta de estado sobre la imagen */}
        <span className={`reserva-estado-tag ${estadoInfo.className}`}>
          {estadoInfo.icon} {estadoInfo.texto}
        </span>
      </div>
      <div className='card-contenido reserva-contenido'>
        <div className='card-izquierda reserva-info'>
          <p
            className='salon-nombre reserva-salon-nombre'
            onClick={handleVerDetalleSalon}
            role="button"
            title="Ver detalles del salón"
          >
            {reserva.salon?.nombre || 'Salón no disponible'}
          </p>
          <p className='salon-caracteristica'>
            <FiCalendar className='icono' />
            {fechaFormateada}
          </p>
          <p className='salon-caracteristica'>
            <FiClock className='icono' />
            {horaInicioFormateada} - {horaFinFormateada}
          </p>
          {/* Opcional: Mostrar el publicador si lo tienes en los datos */}
          {reserva.salon?.publicador && (
            <p className='salon-caracteristica secondary'>
              <FiUser className='icono' />
              Anfitrión: {reserva.salon.publicador.nombre} {reserva.salon.publicador.apellido}
            </p>
          )}
          <p className='salon-caracteristica secondary direccion' title={reserva.salon?.direccion}>
            <FiMapPin className='icono' />
            {reserva.salon?.direccion || 'Dirección no disponible'}
          </p>
        </div>
        <div className='card-derecha reserva-acciones'>
          {/* Aquí podrías añadir botones de acción */}
          {reserva.estado_reserva === 'confirmada' && (
            <button className="btn-accion cancelar" onClick={handleCancelarClick}>
              Cancelar
            </button>
          )}
          {reserva.estado_reserva === 'completada' && !reserva.resenia && (
            <button className="btn-accion resenia" onClick={handleReseniarClick}>
              Dejar Reseña
            </button>
          )}
          <button className="btn-accion detalle" onClick={() => navigate(`/reservas_detalles/${reserva.id_reserva}`)}>Ver Detalle</button>
        </div>
      </div>
    </div>
  );
};

export default ItemReserva;