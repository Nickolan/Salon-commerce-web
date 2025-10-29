import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Swal from 'sweetalert2';

// Importar acciones de Redux (actualizadas)
import { fetchSalonById } from '../store/features/salones/salonSlice';
import {
  fetchAvailableSlots,
  selectSlots,         // 👈 CAMBIO
  clearSelectedSlots,  // 👈 CAMBIO
  generarLinkDePago,
  resetReservaStatus
} from '../store/features/reservas/reservasSlice';

// Importar estilos
import '../styles/ReservarSalonScreen.css';

// Configuración del localizador (sin cambios)
const locales = { 'es': es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Mensajes del calendario (sin cambios)
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
  const { id: salonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week');
  const [metodoPago, setMetodoPago] = useState("");

  // --- 👇 CAMBIO: Leer 'selectedSlots' (plural) del estado ---
  const { selectedSalon, status: salonStatus, error: salonError } = useSelector((state) => state.salones);
  const { availableSlots, selectedSlots, slotsStatus, reservaStatus, error: reservaError, pagoStatus, pagoError } = useSelector((state) => state.reservas);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Efecto para cargar datos iniciales y proteger la ruta (sin cambios)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (salonId) {
      dispatch(fetchSalonById(salonId));
      dispatch(fetchAvailableSlots(salonId));
      dispatch(resetReservaStatus());
    } else {
      console.error("No se encontró ID de salón en la URL");
    }
  }, [salonId, dispatch, isAuthenticated, navigate]);

  // ❌ ELIMINADO: useEffect(() => { initMercadoPago(...) }, []);
  // No es necesario, ya que no usaremos el SDK de Bricks.

  // handleSelectSlotOrEvent (sin cambios)
  const handleSelectSlotOrEvent = (slotInfo) => {
    // Si se hizo clic en un evento existente, usamos su 'start' y 'end'
    // Si se arrastró, usamos el 'start' y 'end' del slotInfo
    const { start, end } = slotInfo;

    // 1. Encontrar TODOS los slots disponibles DENTRO del rango seleccionado
    const slotsEnRango = availableSlots.filter(
      slot => slot.start.getTime() >= start.getTime() && slot.end.getTime() <= end.getTime()
    );

    if (slotsEnRango.length > 0) {
      // 2. Opcional pero recomendado: Verificar si son consecutivos
      let sonConsecutivos = true;
      for (let i = 0; i < slotsEnRango.length - 1; i++) {
        // Comprobar si el fin de un slot NO es el inicio del siguiente
        if (slotsEnRango[i].end.getTime() !== slotsEnRango[i + 1].start.getTime()) {
          sonConsecutivos = false;
          break;
        }
      }

      if (sonConsecutivos) {
        // 3. Seleccionar el rango
        dispatch(selectSlots(slotsEnRango)); // Despacha el array de slots encontrados
      } else {
        Swal.fire('Selección Inválida', 'Por favor, selecciona un rango de horas continuo. No puedes dejar huecos.', 'warning');
        dispatch(clearSelectedSlots()); // Limpiar si la selección no es válida
      }
    } else {
      // El usuario hizo clic en un espacio vacío o en un evento no válido
      dispatch(clearSelectedSlots());
    }
  };

  // handleConfirmarReserva (Lógica de pago)
  const handleConfirmarReserva = async () => {
    // 1. Validar que haya slots seleccionados
    if (selectedSlots.length === 0 || !salonId || !metodoPago) {
      Swal.fire('Información Incompleta', 'Por favor, selecciona un rango horario y un método de pago.', 'warning');
      return;
    }

    // 2. Calcular total y IDs
    const totalPagar = selectedSlots.reduce((acc, slot) => acc + slot.resource.precio, 0);
    const franjaIds = selectedSlots.map(slot => slot.resource.franjaId);
    
    // 3. Obtener la primera y última franja para los datos de la reserva
    // (No es necesario re-ordenar, la lógica de selección ya garantiza el orden)
    const primerSlot = selectedSlots[0];
    const ultimoSlot = selectedSlots[selectedSlots.length - 1];

    const fecha = format(primerSlot.start, 'yyyy-MM-dd');
    const horaInicio = format(primerSlot.start, 'HH:mm');
    const horaFin = format(ultimoSlot.end, 'HH:mm'); // Usamos el 'end' del último slot

    // 4. Crear el payload para el backend
    const datosParaPago = {
      id_salon: parseInt(salonId),
      id_arrendatario: user.id_usuario,
      fecha_reserva: fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      metodoPago: metodoPago,
      total: totalPagar,
      franjaIds: franjaIds // Array de IDs
    };

    // 5. Mostrar el Swal de confirmación (actualizado para múltiples horas)
    Swal.fire({
      title: 'Confirmar Reserva',
      html: `
        Vas a reservar <b>${selectedSalon?.nombre || 'este salón'}</b> para el <br/>
        <b>${format(primerSlot.start, 'eeee dd \'de\' MMMM', { locale: es })}</b><br/>
        de <b>${horaInicio}</b> a <b>${horaFin}</b> (${selectedSlots.length} franja${selectedSlots.length > 1 ? 's' : ''}).<br/>
        Precio Total: <b>$${totalPagar}</b><br/>
        Método de pago: <b>${metodoPago === 'mercadoPago' ? 'Mercado Pago' : 'Coinbase'}</b>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7E2A8A',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirmar y Pagar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        // 6. Despachar la acción si el usuario confirma
        const resultAction = await dispatch(generarLinkDePago(datosParaPago));

        if (generarLinkDePago.fulfilled.match(resultAction)) {
          const { urlPago } = resultAction.payload;
          window.location.href = urlPago; // Redirigir al checkout
        } else {
          const errorMsg = resultAction.payload || pagoError || 'No se pudo generar el link de pago.';
          Swal.fire('Error al Pagar', errorMsg, 'error');
        }
      } else {
        console.log("Reserva cancelada por el usuario.");
      }
    });
  };

  // useEffect para el estado de la reserva (sin cambios)
  useEffect(() => {
    if (reservaStatus === 'succeeded') {
      Swal.fire('¡Reserva Creada!', 'Tu reserva ha sido registrada con éxito.', 'success');
      dispatch(fetchAvailableSlots(salonId));
      dispatch(resetReservaStatus());
    } else if (reservaStatus === 'failed') {
      Swal.fire('Error', reservaError || 'No se pudo crear la reserva.', 'error');
      dispatch(fetchAvailableSlots(salonId));
      dispatch(resetReservaStatus());
    }
  }, [reservaStatus, reservaError, dispatch, salonId]);

  // handleNavigate (sin cambios)
  const handleNavigate = (newDate) => setCurrentDate(newDate);
  const handleView = (newView) => setCurrentView(newView);

  // eventStyleGetter (sin cambios)
  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
      backgroundColor: '#8e44ad',
      borderRadius: '5px',
      opacity: 0.85,
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.8em',
      padding: '2px 5px',
    };

    // Comprobar si este evento (slot) está en el array de seleccionados
    const isSlotSelected = selectedSlots.some(
      slot => slot.resource.franjaId === event.resource.franjaId
    );

    if (isSlotSelected) {
       style.backgroundColor = '#5a1a8b'; // Más oscuro
       style.opacity = 1;
       style.boxShadow = '0 0 8px rgba(0,0,0,0.4)';
    }
    return { style };
  };

  // --- Renderizado Condicional Principal (sin cambios) ---
  if (salonStatus === 'loading' || (slotsStatus === 'loading' && slotsStatus !== 'failed')) {
    return <div className='reservar-salon-screen loading'><h1>Cargando datos del salón y disponibilidad...</h1></div>;
  }
  if (salonStatus === 'failed') {
    return <div className='reservar-salon-screen error'><h1>Error al cargar el salón</h1><p>{salonError}</p></div>;
  }
  if (!selectedSalon) {
    return <div className='reservar-salon-screen error'><h1>Salón no encontrado</h1></div>;
  }

  return (
    <div className='reservar-salon-screen'>
      <h1>Reservar Salón: {selectedSalon.nombre}</h1>
      <p className='instrucciones-calendario'>Selecciona una franja horaria disponible en el calendario:</p>

      <div className='calendar-container'>
        {slotsStatus === 'failed' && <p className="error-message">Error al cargar la disponibilidad: {reservaError}</p>}
        <Calendar
          localizer={localizer}
          events={availableSlots}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable // 👈 Esto permite hacer clic y arrastrar
          onSelectSlot={handleSelectSlotOrEvent}  // Se activa al arrastrar en vacío
          onSelectEvent={handleSelectSlotOrEvent} // Se activa al hacer clic en un evento
          view={currentView}
          date={currentDate}
          onNavigate={handleNavigate}
          onView={handleView}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 22, 0, 0)}
          step={selectedSalon.granularidad_minutos || 60}
          timeslots={1}
          messages={messages}
          culture='es'
          eventPropGetter={eventStyleGetter}
          components={{
            event: ({ event }) => (
              <span title={`Precio: $${event.resource.precio}`}>
                {event.title.split('(')[0]}
              </span>
            )
          }}
        />
      </div>

      {/* --- Sección de Métodos de Pago (sin cambios) --- */}
      <div className="payment-section-wrapper">
        <h2 className="reservar-titulo titulo-pago">2. Elegí cómo pagar</h2>
        <div className="payment-section">
          <label className={`payment-label ${metodoPago === "mercadoPago" ? "selected" : ""}`}>
            <input
              type="radio"
              name="metodoPago"
              value="mercadoPago"
              checked={metodoPago === "mercadoPago"}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <span className="payment-text">Mercado Pago</span>
          </label>
          <label className={`payment-label ${metodoPago === "coinbase" ? "selected" : ""}`}>
            <input
              type="radio"
              name="metodoPago"
              value="coinbase"
              checked={metodoPago === "coinbase"}
              onChange={(e) => setMetodoPago(e.target.value)}
            />
            <span className="payment-text">Coinbase</span>
          </label>
        </div>
      </div>

      {/* --- Panel de Confirmación (Corregido) --- */}
      {selectedSlots.length > 0 && (
        <div className='confirmacion-reserva'>
          <h2>Horario Seleccionado</h2>
          <p>
            <strong>Día:</strong> {format(selectedSlots[0].start, 'eeee dd \'de\' MMMM', { locale: es })} <br />
            <strong>Hora:</strong> {format(selectedSlots[0].start, 'HH:mm')} - {format(selectedSlots[selectedSlots.length - 1].end, 'HH:mm')} <br />
            <strong>Total:</strong> {selectedSlots.length * (selectedSalon.granularidad_minutos / 60)} hora(s)<br />
            <strong>Precio Total:</strong> ${selectedSlots.reduce((acc, slot) => acc + slot.resource.precio, 0)}
          </p>
          <div className="confirmacion-botones">
            <button
              onClick={handleConfirmarReserva}
              disabled={pagoStatus === 'loading' || !metodoPago}
              className='boton-confirmar'
              title={!metodoPago ? "Selecciona un método de pago" : ""}
            >
              {pagoStatus === 'loading' ? 'Generando...' : 'Confirmar y Pagar'}
            </button>
            <button
              onClick={() => { dispatch(clearSelectedSlots()); setMetodoPago(""); }} // 👈 CAMBIO
              disabled={pagoStatus === 'loading'}
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