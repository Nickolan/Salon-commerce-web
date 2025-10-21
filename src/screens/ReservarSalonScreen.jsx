import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es'; // Importar localización en español
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';

// Importar acciones de Redux
import { fetchSalonById } from '../store/features/salones/salonSlice';
import {
  fetchAvailableSlots,
  selectSlot,
  clearSelectedSlot,
  createReserva,
  resetReservaStatus
} from '../store/features/reservas/reservasSlice';

// Importar estilos
import '../styles/ReservarSalonScreen.css'; // Crearemos este archivo

// Configurar el localizador para date-fns en español
const locales = {
  'es': es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Lunes como inicio de semana
  getDay,
  locales,
});

// Mensajes del calendario en español
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay horarios disponibles en este rango.',
  showMore: total => `+ Ver más (${total})`
};

const ReservarSalonScreen = () => {
  const { id: salonId } = useParams(); // ID del salón desde la URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estados locales para el calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week'); // Vista inicial: semana
  const [metodoPago, setMetodoPago] = useState("");

  // Obtener datos del estado global de Redux
  const { selectedSalon, status: salonStatus, error: salonError } = useSelector((state) => state.salones);
  const { availableSlots, selectedSlot, slotsStatus, reservaStatus, error: reservaError } = useSelector((state) => state.reservas);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  console.log(selectedSalon);
  

  // Efecto para cargar datos iniciales y proteger la ruta
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Usuario no autenticado, redirigiendo a login...");
      navigate('/login');
      return; // Detener ejecución si no está autenticado
    }
    if (salonId) {
      console.log("Cargando datos para salón ID:", salonId);
      dispatch(fetchSalonById(salonId));
      dispatch(fetchAvailableSlots(salonId));
      dispatch(resetReservaStatus()); // Limpiar estado de reserva anterior
    } else {
        console.error("No se encontró ID de salón en la URL");
        // Opcional: redirigir a una página de error o a la home
    }
  }, [salonId, dispatch, isAuthenticated, navigate]);

  // Manejar la selección de un slot en el calendario
  const handleSelectSlotOrEvent = (slotInfo) => {
    // slotInfo puede ser un evento (si se hace clic en un bloque) o un slot (si se hace clic en espacio vacío)
    const start = slotInfo.start;
    const end = slotInfo.end;

    // Verificar si el slot seleccionado coincide con uno de los disponibles
    const slotEncontrado = availableSlots.find(
      slot => slot.start.getTime() === start.getTime() && slot.end.getTime() === end.getTime()
    );

    if (slotEncontrado) {
      console.log("Slot disponible seleccionado:", slotEncontrado);
      dispatch(selectSlot(slotEncontrado));
    } else {
      console.log("Slot no disponible seleccionado o espacio vacío.");
      dispatch(clearSelectedSlot());
    }
  };

  // Manejar la confirmación de la reserva
  const handleConfirmarReserva = () => {
    if (!selectedSlot || !salonId || !metodoPago) {
      Swal.fire('Información Incompleta', 'Por favor, selecciona un horario y un método de pago.', 'warning');
      return;
    }

    // Formatear datos para la API
    const fecha = format(selectedSlot.start, 'yyyy-MM-dd'); // Formato YYYY-MM-DD
    const horaInicio = format(selectedSlot.start, 'HH:mm'); // Formato HH:mm
    const horaFin = format(selectedSlot.end, 'HH:mm');     // Formato HH:mm

    Swal.fire({
      title: 'Confirmar Reserva',
     html: `
        Vas a reservar <b>${selectedSalon?.nombre || 'este salón'}</b> para el <br/>
        <b>${format(selectedSlot.start, 'eeee dd \'de\' MMMM', { locale: es })}</b><br/>
        de <b>${horaInicio}</b> a <b>${horaFin}</b>.<br/>
        Precio estimado: <b>$${selectedSlot.resource.precio}</b><br/>
        Método de pago: <b>${metodoPago === 'mercadoPago' ? 'Mercado Pago' : 'Coinbase'}</b>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7E2A8A',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false // Evita cerrar al hacer clic fuera
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Confirmando reserva con datos:", { salonId, fecha, horaInicio, horaFin, metodoPago });
        dispatch(createReserva({
          id_salon: parseInt(salonId),
          fecha_reserva: fecha,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          id_arrendatario: user.id_usuario
        }));
      } else {
        console.log("Reserva cancelada por el usuario.");
      }
    });
  };

  // Efecto para mostrar mensajes de éxito/error de la reserva y recargar slots
  useEffect(() => {
    if (reservaStatus === 'succeeded') {
      Swal.fire('¡Reserva Creada!', 'Tu reserva ha sido registrada con éxito.', 'success');
      dispatch(fetchAvailableSlots(salonId)); // Recargar slots para quitar el reservado
      dispatch(resetReservaStatus()); // Limpiar el estado
    } else if (reservaStatus === 'failed') {
        console.log(reservaError);
        
      Swal.fire('Error', reservaError || 'No se pudo crear la reserva. La franja podría no estar disponible.', 'error');
      dispatch(fetchAvailableSlots(salonId)); // Recargar slots por si otro la reservó justo antes
      dispatch(resetReservaStatus()); // Limpiar el estado
    }
  }, [reservaStatus, reservaError, dispatch, salonId]);

  // Manejar cambio de fecha en el calendario
  const handleNavigate = (newDate) => {
    console.log("Navegando a fecha:", newDate);
    setCurrentDate(newDate);
  };

  // Manejar cambio de vista (mes/semana/día)
  const handleView = (newView) => {
    console.log("Cambiando a vista:", newView);
    setCurrentView(newView);
  };

  // Estilo personalizado para los eventos (slots disponibles)
  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#8e44ad'; // Púrpura base
    let style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.85,
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.8em',
      padding: '2px 5px',
    };
    // Si el slot está actualmente seleccionado por el usuario
    if (selectedSlot && selectedSlot.resource.franjaId === event.resource.franjaId) {
       style.backgroundColor = '#5a1a8b'; // Más oscuro
       style.opacity = 1;
       style.boxShadow = '0 0 8px rgba(0,0,0,0.4)';
    }
    return { style };
  };

  // --- Renderizado Condicional Principal ---
  if (salonStatus === 'loading' || slotsStatus === 'loading' && slotsStatus !== 'failed') {
      return <div className='reservar-salon-screen loading'><h1>Cargando datos del salón y disponibilidad...</h1></div>;
  }

  if (salonStatus === 'failed') {
      return <div className='reservar-salon-screen error'><h1>Error al cargar el salón</h1><p>{salonError}</p></div>;
  }

  if (!selectedSalon) {
      // Esto podría pasar si el ID no es válido o la carga falló silenciosamente
      return <div className='reservar-salon-screen error'><h1>Salón no encontrado</h1></div>;
  }
  // -----------------------------------------

  return (
    <div className='reservar-salon-screen'>
      <h1>Reservar Salón: {selectedSalon.nombre}</h1>
      <p className='instrucciones-calendario'>Selecciona una franja horaria disponible en el calendario:</p>

      <div className='calendar-container'>
        {slotsStatus === 'failed' && <p className="error-message">Error al cargar la disponibilidad: {reservaError}</p>}
        <Calendar
          localizer={localizer}
          events={availableSlots} // Los slots disponibles son los eventos
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleSelectSlotOrEvent} // Para clics en espacios vacíos
          onSelectEvent={handleSelectSlotOrEvent} // Para clics sobre eventos
          view={currentView}
          date={currentDate}
          onNavigate={handleNavigate}
          onView={handleView}
          min={new Date(0, 0, 0, 8, 0, 0)} // Hora mínima visible: 8 AM
          max={new Date(0, 0, 0, 22, 0, 0)} // Hora máxima visible: 10 PM
          step={selectedSalon.granularidad_minutos || 60} // El "paso" en minutos
          timeslots={1} // Cuántos slots mostrar por "step" (1 para ver cada hora/media hora)
          messages={messages}
          culture='es'
          eventPropGetter={eventStyleGetter}
          components={{
            // Opcional: Personalizar cómo se ve el título del evento
            event: ({ event }) => (
              <span title={`Precio: $${event.resource.precio}`}>
                 {event.title.split('(')[0]} {/* Mostrar solo "Disponible" */}
              </span>
            )
          }}
        />
      </div>

      {/* --- 👇 SECCIÓN DE MÉTODOS DE PAGO (AÑADIDA) --- */}
      <div className="payment-section-wrapper">
        <h2 className="reservar-titulo titulo-pago">2. Elegí cómo pagar</h2>
        <div className="payment-section">
          {/* Opción Mercado Pago */}
          <label className={`payment-label ${metodoPago === "mercadoPago" ? "selected" : ""}`}>
            <input
              type="radio"
              name="metodoPago"
              value="mercadoPago"
              checked={metodoPago === "mercadoPago"}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <span className="payment-text">Mercado Pago</span>
            {/* Puedes añadir un logo si quieres */}
          </label>

          {/* Opción Coinbase */}
          <label className={`payment-label ${metodoPago === "coinbase" ? "selected" : ""}`}>
            <input
              type="radio"
              name="metodoPago"
              value="coinbase"
              checked={metodoPago === "coinbase"}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <span className="payment-text">Coinbase</span>
            {/* Puedes añadir un logo si quieres */}
          </label>
        </div>
      </div>
      {/* ----------------------------------------------- */}

      {/* Panel de Confirmación */}
      {/* Panel de Confirmación (Modificado para incluir validación de pago) */}
      {selectedSlot && (
        <div className='confirmacion-reserva'>
          <h2>Horario Seleccionado</h2>
          <p>
            <strong>Día:</strong> {format(selectedSlot.start, 'eeee dd \'de\' MMMM', { locale: es })} <br />
            <strong>Hora:</strong> {format(selectedSlot.start, 'HH:mm')} - {format(selectedSlot.end, 'HH:mm')} <br />
            <strong>Precio:</strong> ${selectedSlot.resource.precio}
          </p>
          <div className="confirmacion-botones">
            <button
              onClick={handleConfirmarReserva}
              // El botón ahora se deshabilita si no hay método de pago
              disabled={reservaStatus === 'loading' || !metodoPago} 
              className='boton-confirmar'
              title={!metodoPago ? "Selecciona un método de pago" : ""} // Tooltip
            >
              {reservaStatus === 'loading' ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
            <button
              onClick={() => { dispatch(clearSelectedSlot()); setMetodoPago(""); }} // Limpiar también método de pago
              disabled={reservaStatus === 'loading'}
              className='boton-cancelar-seleccion'
            >
              Cancelar Selección
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservarSalonScreen;