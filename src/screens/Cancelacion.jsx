import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import "../styles/Cancelacion.css";
import Salones from "../utils/Salones.json";
import Usuarios from "../utils/Usuarios.json";
import Transacciones from "../utils/Transacciones.json";
import Reservas from "../utils/Reservas.json";
import { MdOutlineCancel } from "react-icons/md";
import { FaCheck, FaRegCircle, FaCircle } from "react-icons/fa";

const Cancelacion = () => {
    const { idUsuario, idReserva } = useParams(); 
    const navigate = useNavigate();
    const [reservaData, setReservaData] = useState(null);
    const [salonData, setSalonData] = useState(null);
    const [vendedorData, setVendedorData] = useState(null);
    const [transaccionData, setTransaccionData] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [motivoSeleccionado, setMotivoSeleccionado] = useState(null);
    const [detallesOtro, setDetallesOtro] = useState('');

    const validarUsuarioReserva = (id_usuario, id_reserva) => {
    const reserva = Reservas.find(r => r.id_reserva === parseInt(id_reserva));
    if (!reserva) return false;
    // Verificar si el id_arrendatario de la reserva coincide con el id_usuario
    return reserva.id_arrendatario === parseInt(id_usuario);
    };

    useEffect(() => {
        if (!idUsuario || !idReserva) {
            console.error("Faltan parámetros en la URL");
            navigate('/mis-reservas');
            return;
        }

        const reserva = Reservas.find(r => r.id_reserva === parseInt(idReserva));
        if (!reserva) {
            console.error("Reserva no encontrada");
            navigate('/mis-reservas');
            return;
        }

        const usuarioTienePermisos = validarUsuarioReserva(parseInt(idUsuario), parseInt(idReserva));
        if (!usuarioTienePermisos) {
            console.error("Usuario no autorizado para esta reserva");
            navigate('/mis-reservas');
            return;
        }

        if (!usuarioTienePermisos) {
        alert("No tienes permisos para cancelar esta reserva.");
        navigate('/mis-reservas');
        return;
        }

        setReservaData(reserva);

        const salon = Salones.find(s => {
            if (s.reservas) {
                return s.reservas.some(r => r.id_reserva === parseInt(idReserva));
            }
            return false;
        });

        if (salon) {
            setSalonData(salon);
            const vendedor = Usuarios.find(u => u.id_usuario === salon.id_publicador);
            setVendedorData(vendedor);
        }
        const transaccion = Transacciones.find(t => 
            t.reserva && t.reserva.id_reserva === parseInt(idReserva)
        );
        
        setTransaccionData(transaccion);
        setCargando(false);
    }, [idUsuario, idReserva, navigate]);

    const validarPermisosUsuario = (usuarioId, reserva) => {
        return reserva.arrendatario?.id_usuario === usuarioId;
    };

    const formatearHora = (horaCompleta) => {
        if (!horaCompleta) return '';
        return horaCompleta.split(':').slice(0, 2).join(':');
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const fechaObj = new Date(fecha);
        const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
        return fechaObj.toLocaleDateString('es-ES', opciones);
    };

    const handleMotivoClick = (motivo) => {
        setMotivoSeleccionado(motivo);
        if (motivo !== 'otro') {
            setDetallesOtro('');
        }
    };
      const handleCancelarClick = () => {
      
        console.log('Cancelando reserva:', {
            usuarioId: idUsuario,
            reservaId: idReserva,
            motivo: motivoSeleccionado,
            detalles: detallesOtro
        });
        
        navigate('/mis-reservas');
    }

    if (cargando) {
        return (
            <div className='cancelacion'>
                <div className='cargando'>Cargando información de cancelación...</div>
            </div>
        );
    }

    if (!reservaData) {
        return (
            <div className='cancelacion'>
                <div className='error'>No se pudo encontrar la información de la reserva</div>
            </div>
        );
    }

    return (
        <div className='cancelacion'>
            <div className='info-cancelacion'>
                <h1 className='subtitulo'>Información de la reserva</h1>
                <div className='contenido-seccion'>
                    <h3 className='info-datos'>
                        <span className='info-label'>Salón:</span>
                        <span className='info-valor'>{salonData?.nombre || "No disponible"}</span>
                    </h3>
                    <h3 className='info-datos'>
                        <span className='info-label'>Fecha:</span>
                        <span className='info-valor'>
                            {formatearFecha(reservaData.fecha_reserva)} 
                            {reservaData.hora_inicio && ` - ${formatearHora(reservaData.hora_inicio)} a ${formatearHora(reservaData.hora_fin)}`}
                        </span>
                    </h3>
                    <h3 className='info-datos'>
                        <span className='info-label'>Vendedor:</span>
                        <span className='info-valor'>
                            {vendedorData ? `${vendedorData.nombre} ${vendedorData.apellido}` : "No disponible"}
                        </span>
                    </h3>
                    <h3 className='info-datos'>
                        <span className='info-label'>Método de Pago:</span>
                        <span className='info-valor'>
                            {transaccionData ? 
                                `${transaccionData.metodo_pago}` 
                                : "No disponible"
                            }
                        </span>
                    </h3>
                    <h3 className='info-datos'>
                        <span className='info-label'>Monto Pagado:</span>
                        <span className='info-valor'>
                            {transaccionData ? `$${transaccionData.monto_pagado?.toLocaleString()}` : "No disponible"}
                        </span>
                    </h3>
                </div>
            </div>

            <div className='linea-divisoria'></div>

            <div className='politica-cancelacion'>
                <h1 className='subtitulo'>Política de cancelación</h1>
                <div className='contenido-seccion'>
                    <div className='politica-contenido'>
                        <div className='politica-item'>
                            <FaCheck className='politica-icono check' />
                            <div className='politica-texto'>
                                <span className='politica-porcentaje'>100%</span>
                                <span className='politica-descripcion'>si cancela con más de 24 horas de anticipación</span>
                            </div>
                        </div>
                        <div className='politica-item'>
                            <MdOutlineCancel className='politica-icono cancel' />
                            <div className='politica-texto'>
                                <span className='politica-porcentaje'>0%</span>
                                <span className='politica-descripcion'>Sin rembolso al cancelar en las últimas 24 horas antes de la hora establecida</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='linea-divisoria'></div>

            <div className='motivo-cancelacion'>
                <h1 className='subtitulo'>Motivo de cancelación (Opcional)</h1>
                <div className='contenido-seccion'>
                    <div className='opciones-motivo'>
                        <div 
                            className={`opcion-motivo ${motivoSeleccionado === 'cambio-planes' ? 'seleccionado' : ''}`}
                            onClick={() => handleMotivoClick('cambio-planes')}
                        >
                            {motivoSeleccionado === 'cambio-planes' ? 
                                <FaCircle className='icono-motivo' /> : 
                                <FaRegCircle className='icono-motivo' />
                            }
                            <span className='texto-motivo'>Cambio de planes</span>
                        </div>
                        <div 
                            className={`opcion-motivo ${motivoSeleccionado === 'otro-salon' ? 'seleccionado' : ''}`}
                            onClick={() => handleMotivoClick('otro-salon')}
                        >
                            {motivoSeleccionado === 'otro-salon' ? 
                                <FaCircle className='icono-motivo' /> : 
                                <FaRegCircle className='icono-motivo' />
                            }
                            <span className='texto-motivo'>Encontré otro salón</span>
                        </div>
                        <div 
                            className={`opcion-motivo ${motivoSeleccionado === 'problemas-pago' ? 'seleccionado' : ''}`}
                            onClick={() => handleMotivoClick('problemas-pago')}
                        >
                            {motivoSeleccionado === 'problemas-pago' ? 
                                <FaCircle className='icono-motivo' /> : 
                                <FaRegCircle className='icono-motivo' />
                            }
                            <span className='texto-motivo'>Problemas con el pago</span>
                        </div>
                        <div 
                            className={`opcion-motivo ${motivoSeleccionado === 'otro' ? 'seleccionado' : ''}`}
                            onClick={() => handleMotivoClick('otro')}
                        >
                            {motivoSeleccionado === 'otro' ? 
                                <FaCircle className='icono-motivo' /> : 
                                <FaRegCircle className='icono-motivo' />
                            }
                            <span className='texto-motivo'>Otro</span>
                        </div>
                    </div>
                    
                    {motivoSeleccionado === 'otro' && (
                        <div className='detalles-otro-container'>
                            <input 
                                type="text"
                                className='detalles-otro-input'
                                placeholder='Más detalles (Opcional)'
                                value={detallesOtro}
                                onChange={(e) => setDetallesOtro(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className='linea-divisoria'></div>

            <div className='confirmacion-cancelacion'>
                <h1 className='subtitulo'>Confirmación</h1>
                <div className='contenido-seccion'>
                    <h3>¿Estás seguro de cancelar tu reserva?</h3>
                    <div className='botones-confirmacion'>
                        <Link 
                            to={`/reservas_detalles/${idReserva}`} 
                            className='link-atras'
                        >
                            Atrás
                        </Link>
                        <div className='button-cancelar' onClick={handleCancelarClick}>
                            <span className="cancelar-texto">Sí, Cancelar Reserva</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cancelacion;