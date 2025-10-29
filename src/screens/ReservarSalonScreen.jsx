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

// Importar acciones de Redux
import { fetchSalonById } from '../store/features/salones/salonSlice';
import {
  fetchAvailableSlots,
  selectSlots,
  clearSelectedSlots,
  generarLinkDePago,
  resetReservaStatus
} from '../store/features/reservas/reservasSlice';

// Importar estilos
import '../styles/ReservarSalonScreen.css';

// --- CONFIGURACIÓN DE CRIPTOMONEDA ---
// FIAT_CODE se mantiene fijo para ARS
const FIAT_CODE = 'ARS'; 
// Usaremos la API base para obtener todas las tasas de cambio
const COINBASE_API_URL = `https://api.coinbase.com/v2/exchange-rates?currency=USD`; // Usamos USD como base para obtener una lista de tasas
const SUPPORTED_CRYPTOS = ['BTC', 'ETH', 'USDC', 'DOGE']; // Criptomonedas que quieres mostrar al usuario
// ------------------------------------

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
  
  // --- 👇 ESTADOS ACTUALIZADOS PARA LA TASA DE CAMBIO 👇 ---
  // Guardaremos todas las tasas de cambio disponibles (e.g., USD -> ARS, USD -> BTC, USD -> ETH)
  const [exchangeRates, setExchangeRates] = useState(null); 
  // Estado para la criptomoneda seleccionada por el usuario
  const [selectedCryptoCode, setSelectedCryptoCode] = useState(SUPPORTED_CRYPTOS[0]);
  const [coinbaseLoading, setCoinbaseLoading] = useState(true);
  const [coinbaseError, setCoinbaseError] = useState(null);
  // ---------------------------------------------------------

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

  // --- 👇 EFECTO PARA OBTENER TODAS LAS TASAS DE CAMBIO 👇 ---
  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        setCoinbaseLoading(true);
        const response = await fetch(COINBASE_API_URL);
        
        if (!response.ok) {
          throw new Error(`Error en la API: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.data || !data.data.rates) {
            throw new Error('Formato de datos de Coinbase inesperado.');
        }

        setExchangeRates(data.data.rates);
        setCoinbaseError(null);
      } catch (err) {
        console.error("Error al obtener las tasas de cambio de Coinbase:", err);
        setCoinbaseError("No se pudo obtener la tasa de cambio de Coinbase.");
      } finally {
        setCoinbaseLoading(false);
      }
    }

    fetchExchangeRates();
    // Opcional: Actualizar la tasa cada 30 segundos
    const intervalId = setInterval(fetchExchangeRates, 30000); 

    // Limpieza al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);
  // -----------------------------------------------------------------

  // --- 👇 LÓGICA DE TASAS DE CAMBIO DINÁMICAS 👇 ---
  // Calcula la tasa de cambio de 1 Crypto a ARS (ej: 1 ETH = X ARS)
  const getCryptoToARS_Rate = () => {
    if (!exchangeRates) return null;
    
    // Tasa: 1 USD = X ARS
    const ARS_per_USD = parseFloat(exchangeRates[FIAT_CODE]);
    // Tasa: 1 USD = Y CRYPTO (ej: 1 USD = 0.00025 ETH)
    // Para obtener la tasa: 1 CRYPTO = Z USD, hacemos 1 / (USD_per_CRYPTO)
    const USD_per_CRYPTO = parseFloat(exchangeRates[selectedCryptoCode]);
    
    // Tasa final: 1 CRYPTO = (1 / (USD_per_CRYPTO)) * ARS_per_USD
    const ARS_per_CRYPTO = (1 / USD_per_CRYPTO) * ARS_per_USD;

    return isNaN(ARS_per_CRYPTO) ? null : ARS_per_CRYPTO;
  };

  const currentRate = getCryptoToARS_Rate();

  // --- FUNCIÓN 1: ARS a Crypto (Solución de tu líder) ---
  const convertARSToCrypto = (amountARS) => {
    if (!currentRate || typeof amountARS !== 'number' || amountARS <= 0) {
      return 0; 
    }
    // Conversión: Cantidad_ARS / Tasa_ARS_por_1_CRYPTO
    return amountARS / currentRate;
  };
  // -------------------------------------------------------------

  // --- FUNCIÓN 2: Crypto a ARS (Solución de tu líder) ---
  const convertCryptoToARS = (amountCrypto) => {
    if (!currentRate || typeof amountCrypto !== 'number' || amountCrypto <= 0) {
      return 0; 
    }
    // Conversión: Cantidad_CRYPTO * Tasa_ARS_por_1_CRYPTO
    return amountCrypto * currentRate;
  };
  // -------------------------------------------------------------

  // handleSelectSlotOrEvent (sin cambios)
  const handleSelectSlotOrEvent = (slotInfo) => {
    const { start, end } = slotInfo;

    // 1. Encontrar TODOS los slots disponibles DENTRO del rango seleccionado
    const slotsEnRango = availableSlots.filter(
      slot => slot.start.getTime() >= start.getTime() && slot.end.getTime() <= end.getTime()
    );

    if (slotsEnRango.length > 0) {
      // 2. Verificar si son consecutivos
      let sonConsecutivos = true;
      for (let i = 0; i < slotsEnRango.length - 1; i++) {
        if (slotsEnRango[i].end.getTime() !== slotsEnRango[i + 1].start.getTime()) {
          sonConsecutivos = false;
          break;
        }
      }

      if (sonConsecutivos) {
        // 3. Seleccionar el rango
        dispatch(selectSlots(slotsEnRango)); 
      } else {
        Swal.fire('Selección Inválida', 'Por favor, selecciona un rango de horas continuo. No puedes dejar huecos.', 'warning');
        dispatch(clearSelectedSlots()); 
      }
    } else {
      dispatch(clearSelectedSlots());
    }
  };

  // Cálculo del total a pagar en ARS (sin cambios)
  const totalPagarARS = selectedSlots.reduce((acc, slot) => acc + slot.resource.precio, 0);

  // Cálculo del total a pagar en Crypto (dinámico)
  const totalPagarCrypto = convertARSToCrypto(totalPagarARS);

  // handleConfirmarReserva (Lógica de pago y SIMULACIÓN)
  const handleConfirmarReserva = async () => {
    // 1. Validar
    if (selectedSlots.length === 0 || !salonId || !metodoPago) {
      Swal.fire('Información Incompleta', 'Por favor, selecciona un rango horario y un método de pago.', 'warning');
      return;
    }
    if (metodoPago === 'coinbase' && (!currentRate || coinbaseLoading)) {
        Swal.fire('Error', 'Esperando la tasa de cambio de Coinbase. Por favor, inténtalo de nuevo.', 'warning');
        return;
    }

    // 2. Preparar datos de la reserva
    const franjaIds = selectedSlots.map(slot => slot.resource.franjaId);
    const primerSlot = selectedSlots[0];
    const ultimoSlot = selectedSlots[selectedSlots.length - 1];

    const fecha = format(primerSlot.start, 'yyyy-MM-dd');
    const horaInicio = format(primerSlot.start, 'HH:mm');
    const horaFin = format(ultimoSlot.end, 'HH:mm');

    const totalMoneda = metodoPago === 'coinbase' ? totalPagarCrypto : totalPagarARS;
    const monedaCodigo = metodoPago === 'coinbase' ? selectedCryptoCode : FIAT_CODE;

    const datosParaPago = {
      id_salon: parseInt(salonId),
      id_arrendatario: user.id_usuario,
      fecha_reserva: fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      metodoPago: metodoPago,
      // Usamos el total en la moneda correspondiente
      total: totalMoneda, 
      franjaIds: franjaIds 
    };

    // 3. Crear el HTML para el Swal de confirmación
    const htmlMessage = `
      Vas a reservar <b>${selectedSalon?.nombre || 'este salón'}</b> para el <br/>
      <b>${format(primerSlot.start, 'eeee dd \'de\' MMMM', { locale: es })}</b><br/>
      de <b>${horaInicio}</b> a <b>${horaFin}</b> (${selectedSlots.length} franja${selectedSlots.length > 1 ? 's' : ''}).<br/>
      Precio Total: <b>${metodoPago === 'coinbase' ? `${totalPagarCrypto.toFixed(8)} ${selectedCryptoCode}` : `$${totalPagarARS.toFixed(2)} ${FIAT_CODE}`}</b><br/>
      Método de pago: <b>${metodoPago === 'mercadoPago' ? 'Mercado Pago' : `Coinbase (${selectedCryptoCode})`}</b>
    `;

    // 4. Mostrar el Swal de confirmación
    Swal.fire({
      title: 'Confirmar Reserva',
      html: htmlMessage,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7E2A8A',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirmar y Pagar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        if (metodoPago === 'coinbase') {
          // 5. SIMULACIÓN DE PAGO DE COINBASE
          Swal.fire({
            title: 'Simulación Exitosa',
            text: `Se ha simulado el envío de ${totalPagarCrypto.toFixed(8)} ${selectedCryptoCode}. ¡Reserva completada!`,
            icon: 'success',
            confirmButtonColor: '#7E2A8A',
          });
          // Después de la simulación, podemos limpiar la selección y recargar slots
          dispatch(clearSelectedSlots());
          dispatch(fetchAvailableSlots(salonId));
          setMetodoPago("");

        } else if (metodoPago === 'mercadoPago') {
          // 5. FLUJO DE PAGO REAL (MERCADO PAGO)
          const resultAction = await dispatch(generarLinkDePago(datosParaPago));

          if (generarLinkDePago.fulfilled.match(resultAction)) {
            const { urlPago } = resultAction.payload;
            window.location.href = urlPago; // Redirigir al checkout real
          } else {
            const errorMsg = resultAction.payload || pagoError || 'No se pudo generar el link de pago.';
            Swal.fire('Error al Pagar', errorMsg, 'error');
          }
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

  // handleNavigate y handleView (sin cambios)
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
          selectable
          onSelectSlot={handleSelectSlotOrEvent}
          onSelectEvent={handleSelectSlotOrEvent}
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

      {/* --- Sección de Métodos de Pago (Actualizada) --- */}
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

            {/* 👇 Selector de Criptomoneda y Display de la tasa de cambio 👇 */}
            {metodoPago === "coinbase" && (
                <div className='coinbase-options'>
                    <select
                        value={selectedCryptoCode}
                        onChange={(e) => setSelectedCryptoCode(e.target.value)}
                        disabled={coinbaseLoading}
                    >
                        {SUPPORTED_CRYPTOS.map(code => (
                            <option key={code} value={code}>{code}</option>
                        ))}
                    </select>
                    <small className='coinbase-rate-display'>
                        {coinbaseLoading ? 'Cargando tasa...' : coinbaseError ? 'Error de tasa' : `1 ${selectedCryptoCode} ≈ $${currentRate?.toFixed(2) || '...'} ${FIAT_CODE}`}
                    </small>
                </div>
            )}
            {/* ------------------------------------------------------------- */}

          </label>
        </div>
      </div>

      {/* --- Panel de Confirmación (Actualizado) --- */}
      {selectedSlots.length > 0 && (
        <div className='confirmacion-reserva'>
          <h2>Horario Seleccionado</h2>
          <p>
            <strong>Día:</strong> {format(selectedSlots[0].start, 'eeee dd \'de\' MMMM', { locale: es })} <br />
            <strong>Hora:</strong> {format(selectedSlots[0].start, 'HH:mm')} - {format(selectedSlots[selectedSlots.length - 1].end, 'HH:mm')} <br />
            <strong>Total Horas:</strong> {selectedSlots.length * (selectedSalon.granularidad_minutos / 60)} hora(s)<br />
            
            <hr/>

            <strong>Precio Total ({FIAT_CODE}):</strong> **${totalPagarARS.toFixed(2)}** <br/>

            {metodoPago === "coinbase" && currentRate && (
                <p className='precio-crypto'>
                    <strong>Pagar en {selectedCryptoCode}:</strong> 
                    **{totalPagarCrypto.toFixed(8)} {selectedCryptoCode}** </p>
            )}
          </p>
          <div className="confirmacion-botones">
            <button
              onClick={handleConfirmarReserva}
              // Deshabilitar si está cargando o no ha seleccionado método de pago, o si está en Coinbase y no tiene tasa
              disabled={pagoStatus === 'loading' || !metodoPago || (metodoPago === 'coinbase' && (!currentRate || coinbaseLoading))}
              className='boton-confirmar'
              title={!metodoPago ? "Selecciona un método de pago" : (metodoPago === 'coinbase' && !currentRate ? 'Esperando tasas de cambio' : '')}
            >
              {pagoStatus === 'loading' ? 'Generando...' : 'Confirmar y Pagar'}
            </button>
            <button
              onClick={() => { dispatch(clearSelectedSlots()); setMetodoPago(""); }}
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