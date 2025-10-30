// src/screens/Cancelacion.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import "../styles/Cancelacion.css";
// --- Imports de Redux y Lógica ---
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservaById, cancelarReserva, clearSelectedReserva, resetReservaStatus } from '../store/features/reservas/reservasSlice';
import Swal from 'sweetalert2';
// --- Imports de utilidades ---
import { MdOutlineCancel } from "react-icons/md";
import { FaCheck, FaRegCircle, FaCircle } from "react-icons/fa";
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';

// --- Coinbase API Config ---
const COINBASE_API_URL = `https://api.coinbase.com/v2/exchange-rates?currency=USD`; // Usamos USD como base
const FIAT_CODE = 'ARS'; // Código fijo para Pesos Argentinos
const SUPPORTED_CRYPTOS = ['BTC', 'ETH', 'USDC', 'DOGE']; // Cryptos soportadas

const Cancelacion = () => {
    const { idUsuario, idReserva } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // --- Redux State ---
    const { user } = useSelector((state) => state.auth);
    const { selectedReserva, reservaStatus: statusCancelacion, error: errorCancelacion } = useSelector((state) => state.reservas);

    // --- Local State ---
    const [motivoSeleccionado, setMotivoSeleccionado] = useState(null);
    const [detallesOtro, setDetallesOtro] = useState('');
    // --- State for Coinbase Rates ---
    const [exchangeRates, setExchangeRates] = useState(null);
    const [coinbaseLoading, setCoinbaseLoading] = useState(true);
    const [coinbaseError, setCoinbaseError] = useState(null);

    // --- Effect for User Validation and Initial Data Load ---
    useEffect(() => {
        if (!user || user.id_usuario !== parseInt(idUsuario)) {
            Swal.fire('Acceso Denegado', 'No tienes permisos para ver esta página.', 'error');
            navigate('/mis-reservas');
            return;
        }
        if (idReserva) {
            dispatch(fetchReservaById(idReserva));
        }
        return () => {
            dispatch(clearSelectedReserva());
            dispatch(resetReservaStatus());
        };
    }, [idUsuario, idReserva, user, dispatch, navigate]);

    // --- Effect for Fetching Coinbase Rates ---
    useEffect(() => {
        async function fetchExchangeRates() {
            try {
                setCoinbaseLoading(true);
                const response = await fetch(COINBASE_API_URL);
                if (!response.ok) {
                    throw new Error(`Error en la API de Coinbase: ${response.status}`);
                }
                const data = await response.json();
                if (!data.data || !data.data.rates) {
                    throw new Error('Formato de datos de Coinbase inesperado.');
                }
                setExchangeRates(data.data.rates);
                setCoinbaseError(null);
            } catch (err) {
                console.error("Error al obtener las tasas de cambio de Coinbase:", err);
                setCoinbaseError("No se pudo obtener la tasa de cambio.");
            } finally {
                setCoinbaseLoading(false);
            }
        }

        fetchExchangeRates();
        // Opcional: Actualizar periódicamente
        // const intervalId = setInterval(fetchExchangeRates, 60000); // Cada minuto
        // return () => clearInterval(intervalId);
    }, []); // Se ejecuta solo una vez al montar

    // --- Cancel Logic ---
    const handleCancelarClick = async () => {
        // ... (lógica de confirmación y dispatch sin cambios) ...
        let motivoFinal = motivoSeleccionado;
        if (motivoSeleccionado === 'otro') {
            motivoFinal = detallesOtro || 'Otro';
        }

        Swal.fire({
          title: '¿Confirmar cancelación?',
          text: `Se cancelará tu reserva para "${selectedReserva?.salon?.nombre}".`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#dc3545',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Sí, cancelar',
          cancelButtonText: 'No, volver'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const resultAction = await dispatch(cancelarReserva({
                id_reserva: parseInt(idReserva),
                motivo: motivoFinal
            }));

            if (cancelarReserva.fulfilled.match(resultAction)) {
                navigate('/mis-reservas');
                Swal.fire('¡Cancelada!', 'Tu reserva ha sido cancelada exitosamente.', 'success');
            } else {
                const errorMessage = resultAction.payload || 'No se pudo cancelar la reserva.';
                Swal.fire('Error', errorMessage, 'error');
            }
          }
        });
    };

    // --- Formatting Functions ---
    const formatearHora = (horaCompleta) => {
        if (!horaCompleta || typeof horaCompleta !== 'string') return 'N/A';
        return horaCompleta.substring(0, 5);
    };

    const formatearFecha = (fechaISO) => {
        // ... (función sin cambios) ...
         if (!fechaISO) return 'N/A';
        try {
            return format(parseISO(fechaISO), "EEEE dd 'de' MMMM, yyyy", { locale: es });
        } catch (error) {
            console.error("Error formateando fecha:", error, fechaISO);
            try {
                return format(new Date(fechaISO), "EEEE dd 'de' MMMM, yyyy", { locale: es });
            } catch (innerError) {
                return "Fecha inválida";
            }
        }
    };

    // --- 👇 MODIFIED Currency Formatting Function 👇 ---
    const formatearMoneda = (monto, transaccion) => {
        if (monto === null || monto === undefined || !transaccion) return "N/A";

        const metodo = transaccion.metodo_pago?.toLowerCase(); // Convertir a minúsculas para comparar
        const monedaCodigoOriginal = transaccion.metodo_pago; // Asume que el backend envía esto (ej: 'BTC', 'ETH', 'ARS')

        // Caso 1: Mercado Pago o moneda ARS
        if (metodo === 'mercadopago' || monedaCodigoOriginal === FIAT_CODE) {
            return new Intl.NumberFormat('es-AR', { style: 'currency', currency: FIAT_CODE }).format(monto);
        }

        // Caso 2: Criptomoneda (BTC, ETH, USDC, DOGE)
        if (monedaCodigoOriginal && SUPPORTED_CRYPTOS.includes(monedaCodigoOriginal.toUpperCase())) {
            const cryptoCode = monedaCodigoOriginal.toUpperCase();

            // Si aún están cargando las tasas
            if (coinbaseLoading) {
                return `${monto} ${cryptoCode} (Calculando ARS...)`;
            }
            // Si hubo error al cargar tasas
            if (coinbaseError || !exchangeRates) {
                return `${monto} ${cryptoCode} (Error al convertir a ARS)`;
            }

            try {
                // Calcular tasa Crypto -> ARS
                const ARS_per_USD = parseFloat(exchangeRates[FIAT_CODE]);
                const USD_per_CRYPTO = parseFloat(exchangeRates[cryptoCode]);

                if (isNaN(ARS_per_USD) || isNaN(USD_per_CRYPTO) || USD_per_CRYPTO === 0) {
                     throw new Error('Tasa inválida o no encontrada.');
                }

                const ARS_per_CRYPTO = (1 / USD_per_CRYPTO) * ARS_per_USD;
                const montoEquivalenteARS = monto * ARS_per_CRYPTO;

                // Formatear el equivalente en ARS
                const montoARSFormateado = new Intl.NumberFormat('es-AR', { style: 'currency', currency: FIAT_CODE }).format(montoEquivalenteARS);

                // Devolver ambos valores
                return `${monto} ${cryptoCode} (${montoARSFormateado} aprox.)`;

            } catch (calcError) {
                console.error("Error calculando conversión:", calcError);
                return `${monto} ${cryptoCode} (Error al convertir a ARS)`;
            }
        }

        // Caso 3: Otro método o moneda no reconocida (mostrar original)
        return `${monto} ${monedaCodigoOriginal || ''}`;
    };
    // --- 👆 END MODIFIED Function 👆 ---

    const handleMotivoClick = (motivo) => {
        setMotivoSeleccionado(motivo);
    };

    // --- Conditional Rendering ---
    if (statusCancelacion === 'loading' || !selectedReserva) {
        return <div className='cancelacion'><div className='cargando'>Cargando información...</div></div>;
    }
    if (statusCancelacion === 'failed' && !selectedReserva) {
        return <div className='cancelacion'><div className='error'>Error al cargar la reserva: {errorCancelacion}</div></div>;
    }
    if (selectedReserva.estado_reserva === 'cancelada' || selectedReserva.estado_reserva === 'completada') {
        return (
            <div className='cancelacion'>
                <div className='error'>Esta reserva ya ha sido {selectedReserva.estado_reserva}.</div>
                <Link to="/mis-reservas" className='link-atras' style={{textAlign: 'center', display: 'block', marginTop: '20px'}}>Volver a Mis Reservas</Link>
            </div>
        );
    }

    const transaccionAprobada = selectedReserva.transacciones?.find(t => t.estado_transaccion === 'aprobado');

    return (
        <div className='cancelacion'>
            {/* Sección Información de la Reserva */}
            <div className='info-cancelacion'>
                <h1 className='subtitulo'>Información de la reserva</h1>
                <div className='contenido-seccion'>
                    <h3 className='info-datos'>
                        <span className='info-label'>Salón:</span>
                        <span className='info-valor'>{selectedReserva.salon?.nombre || "No disponible"}</span>
                    </h3>
                    <h3 className='info-datos'>
                        <span className='info-label'>Fecha:</span>
                        <span className='info-valor'>
                            {formatearFecha(selectedReserva.fecha_reserva)}
                            {selectedReserva.hora_inicio && ` - ${formatearHora(selectedReserva.hora_inicio)} a ${formatearHora(selectedReserva.hora_fin)} hs`}
                        </span>
                    </h3>
                    <h3 className='info-datos'>
                        <span className='info-label'>Vendedor:</span>
                        <span className='info-valor'>
                            {selectedReserva.salon?.publicador ? `${selectedReserva.salon.publicador.nombre} ${selectedReserva.salon.publicador.apellido}` : "No disponible"}
                        </span>
                    </h3>
                    <h3 className='info-datos'>
                        <span className='info-label'>Método de Pago:</span>
                        <span className='info-valor'>
                            {transaccionAprobada ? transaccionAprobada.metodo_pago : "Pago no registrado"}
                        </span>
                    </h3>
                    <h3 className='info-datos'>
                        <span className='info-label'>Monto Pagado:</span>
                        <span className='info-valor'>
                            {/* --- 👇 Llamada a formatearMoneda actualizada 👇 --- */}
                            {transaccionAprobada ? formatearMoneda(transaccionAprobada.monto_pagado, transaccionAprobada) : "Pago no registrado"}
                            {/* --- 👆 --- */}
                        </span>
                    </h3>
                </div>
            </div>

            <div className='linea-divisoria'></div>

            {/* Sección Política de Cancelación */}
            <div className='politica-cancelacion'>
                <h1 className='subtitulo'>Política de cancelación</h1>
                <div className='contenido-seccion'>
                    <ul className='lista-politicas'>
                        <li><MdOutlineCancel className="icono-cancelacion cancelada" /> Cancelación <strong>gratuita</strong> hasta 48hs antes.</li>
                        <li><FaCheck className="icono-cancelacion confirmada" /> Reembolso del 50% si cancelas dentro de las 48hs previas.</li>
                        <li><FaCheck className="icono-cancelacion confirmada" /> Sin reembolso si cancelas dentro de las 24hs previas.</li>
                    </ul>
                    {/* <p>Reembolso estimado: {formatearMoneda(montoEstimadoReembolso)}</p> */}
                </div>
            </div>

            <div className='linea-divisoria'></div>

            {/* Sección Motivo de Cancelación */}
            <div className='motivo-cancelacion'>
                <h1 className='subtitulo'>Motivo de cancelación (opcional)</h1>
                <div className='contenido-seccion'>
                    <div className='opciones-motivo'>
                        {['cambio_planes', 'encontre_otro', 'precio', 'otro'].map((motivo) => (
                            <div
                                key={motivo}
                                className={`opcion-motivo ${motivoSeleccionado === motivo ? 'seleccionado' : ''}`}
                                onClick={() => handleMotivoClick(motivo)}
                            >
                                {motivoSeleccionado === motivo ? <FaCircle className='icono-seleccion' /> : <FaRegCircle className='icono-seleccion' />}
                                <span className='texto-motivo'>
                                    {motivo === 'cambio_planes' && 'Cambié de planes'}
                                    {motivo === 'encontre_otro' && 'Encontré otro salón'}
                                    {motivo === 'precio' && 'El precio es muy alto'}
                                    {motivo === 'otro' && 'Otro motivo'}
                                </span>
                            </div>
                        ))}
                    </div>
                    {motivoSeleccionado === 'otro' && (
                        <textarea
                            className='textarea-otro'
                            placeholder='Escribe aquí el motivo...'
                            value={detallesOtro}
                            onChange={(e) => setDetallesOtro(e.target.value)}
                        />
                    )}
                </div>
            </div>

            <div className='linea-divisoria'></div>

            {/* Sección Confirmación */}
            <div className='confirmacion-cancelacion'>
                <h1 className='subtitulo'>Confirmación</h1>
                <div className='contenido-seccion'>
                    <h3>¿Estás seguro de cancelar tu reserva?</h3>
                    {statusCancelacion === 'failed' && <p className="error-cancelacion">{errorCancelacion}</p>}
                    <div className='botones-confirmacion'>
                        <Link to={-1} className='link-atras'>Atrás</Link>
                        <div
                            className={`button-cancelar ${statusCancelacion === 'loading' ? 'deshabilitado' : ''}`}
                            onClick={handleCancelarClick}
                            disabled={statusCancelacion === 'loading'}
                        >
                            <span className="cancelar-texto">
                                {statusCancelacion === 'loading' ? 'Cancelando...' : 'Sí, Cancelar Reserva'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cancelacion;