import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import "../styles/Cancelacion.css";
// --- Imports de Redux y Lógica ---
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservaById, cancelarReserva, clearSelectedReserva, resetReservaStatus } from '../store/features/reservas/reservasSlice'; // Asegúrate de importar resetReservaStatus
import Swal from 'sweetalert2';
// --- (Eliminar imports de JSON estáticos si los tenías) ---
import { MdOutlineCancel } from "react-icons/md";
import { FaCheck, FaRegCircle, FaCircle } from "react-icons/fa";
import { format, parseISO } from 'date-fns'; // Para formatear fecha
import es from 'date-fns/locale/es'; // Para formato en español

const Cancelacion = () => {
    const { idUsuario, idReserva } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // --- Obtener datos del Store ---
    const { user } = useSelector((state) => state.auth);
    // Cambiamos el nombre de la variable de estado para evitar conflicto con el thunk
    const { selectedReserva, reservaStatus: statusCancelacion, error: errorCancelacion } = useSelector((state) => state.reservas);

    const [motivoSeleccionado, setMotivoSeleccionado] = useState(null);
    const [detallesOtro, setDetallesOtro] = useState('');

    useEffect(() => {
        // Validar que el usuario en la URL sea el usuario logueado
        if (!user || user.id_usuario !== parseInt(idUsuario)) {
            Swal.fire('Acceso Denegado', 'No tienes permisos para ver esta página.', 'error');
            navigate('/mis-reservas');
            return;
        }

        // Cargar los datos de la reserva desde la API
        if (idReserva) {
             dispatch(fetchReservaById(idReserva));
        }

        // Limpiar la reserva seleccionada y resetear estado al salir
        return () => {
            dispatch(clearSelectedReserva());
            dispatch(resetReservaStatus()); // Limpia el estado de la última operación
        }
    }, [idUsuario, idReserva, user, dispatch, navigate]);

    // --- Lógica de Cancelación (actualizada) ---
    const handleCancelarClick = async () => {
        let motivoFinal = motivoSeleccionado;
        if (motivoSeleccionado === 'otro') {
            motivoFinal = detallesOtro || 'Otro'; // Usa el detalle si existe, sino 'Otro'
        }

        // Mostramos confirmación antes de despachar
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
            // Despachamos la acción si el usuario confirma
            const resultAction = await dispatch(cancelarReserva({
                id_reserva: parseInt(idReserva),
                motivo: motivoFinal
            }));

            // Verificamos el resultado del thunk
            if (cancelarReserva.fulfilled.match(resultAction)) {
                Swal.fire(
                    '¡Cancelada!',
                    'Tu reserva ha sido cancelada exitosamente.',
                    'success'
                ).then(() => {
                    navigate('/mis-reservas'); // Redirigir a mis reservas
                });
            } else {
                // Si hubo un error (rejectWithValue), usamos el mensaje del payload
                const errorMessage = resultAction.payload || 'No se pudo cancelar la reserva.';
                Swal.fire(
                    'Error',
                    errorMessage,
                    'error'
                );
            }
          }
        });
    };

    // --- Funciones de formato ---
    const formatearHora = (horaCompleta) => {
        if (!horaCompleta || typeof horaCompleta !== 'string') return 'N/A';
        // Asume formato HH:MM:SS, devuelve HH:MM
        return horaCompleta.substring(0, 5);
    };

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return 'N/A';
        try {
            // parseISO para convertir string ISO a objeto Date
            return format(parseISO(fechaISO), "EEEE dd 'de' MMMM, yyyy", { locale: es });
        } catch (error) {
            console.error("Error formateando fecha:", error, fechaISO);
            // Intentar formatear sin parseISO si ya es un objeto Date
            try {
                return format(new Date(fechaISO), "EEEE dd 'de' MMMM, yyyy", { locale: es });
            } catch (innerError) {
                return "Fecha inválida";
            }
        }
    };

    const formatearMoneda = (monto) => {
        if (monto === null || monto === undefined) return "N/A";
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(monto);
    };

    const handleMotivoClick = (motivo) => {
        setMotivoSeleccionado(motivo);
    };

    // --- Renderizado Condicional ---
    if (statusCancelacion === 'loading' || !selectedReserva) {
        return <div className='cancelacion'><div className='cargando'>Cargando información...</div></div>;
    }

    if (statusCancelacion === 'failed' && !selectedReserva) { // Solo mostrar error si no hay datos de reserva
        return <div className='cancelacion'><div className='error'>Error al cargar la reserva: {errorCancelacion}</div></div>;
    }

    // Si la reserva ya está cancelada o completada, informar al usuario
    if (selectedReserva.estado_reserva === 'cancelada' || selectedReserva.estado_reserva === 'completada') {
        return (
            <div className='cancelacion'>
                <div className='error'>Esta reserva ya ha sido {selectedReserva.estado_reserva}.</div>
                <Link to="/mis-reservas" className='link-atras' style={{textAlign: 'center', display: 'block', marginTop: '20px'}}>Volver a Mis Reservas</Link>
            </div>
        );
    }

    // Busca la transacción aprobada (si existe)
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
                            {transaccionAprobada ? formatearMoneda(transaccionAprobada.monto_pagado) : "Pago no registrado"}
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
                    {/* Puedes añadir aquí la lógica para mostrar el reembolso estimado basado en la fecha */}
                    {/* Ejemplo simple: <p>Reembolso estimado: {formatearMoneda(montoEstimadoReembolso)}</p> */}
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
                    {/* Mensaje de error si la cancelación falla */}
                    {statusCancelacion === 'failed' && <p className="error-cancelacion">{errorCancelacion}</p>}
                    <div className='botones-confirmacion'>
                        <Link
                            to={-1} // Vuelve a la página anterior
                            className='link-atras'
                        >
                            Atrás
                        </Link>
                        {/* Botón para confirmar la cancelación */}
                        <div
                            className={`button-cancelar ${statusCancelacion === 'loading' ? 'deshabilitado' : ''}`}
                            onClick={handleCancelarClick}
                            disabled={statusCancelacion === 'loading'} // Deshabilitar mientras carga
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