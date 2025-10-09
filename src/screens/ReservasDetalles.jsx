import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams, useNavigate } from 'react-router-dom';
import "../styles/ReservasDetalles.css";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaMap, FaExclamationTriangle } from "react-icons/fa";
import Salones from "../utils/Salones.json";
import Reservas from "../utils/Reservas.json";
import Usuarios from "../utils/Usuarios.json";
import DatosDelPago from '../components/ItemReserva/DatosDelPago/DatosDelPago';

const ReservasDetalles = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [mostrarSalon, setMostrarSalon] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nombreVendedor, setNombreVendedor] = useState("");
  const [mostrarDatosPago, setMostrarDatosPago] = useState(false);

  const formatearFechaCompleta = (fecha) => {
    const fechaObj = new Date(fecha);
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  };

  const toggleDatosPago = () => {
    setMostrarDatosPago(!mostrarDatosPago);
  };

  useEffect(() => {
    if (!id) {
      setError("No se proporcionó un ID de reserva");
      setTimeout(() => navigate('/mis-reservas'), 2000);
      return;
    }
    const reservaExistente = Reservas.find(reserva => reserva.id_reserva === parseInt(id));

    if (!reservaExistente) {
      setError(`No se encontró la reserva #${id}`);
      setTimeout(() => navigate('/mis-reservas'), 3000);
      return;
    }
    const salon = Salones.find(s => s.id_salon === reservaExistente.id_salon);

    if (salon) {
      const vendedor = Usuarios.find(u => u.id_usuario === salon.id_publicador);
      if (vendedor) {
        setNombreVendedor(vendedor.nombre_usuario);
      } else {
        setNombreVendedor("Vendedor no encontrado");
      }
    }
    setCargando(false);
  }, [id, navigate]);

  if (cargando && !error) {
    return (
      <div className='detalles-reservas'>
        <div className='cargando'>Cargando detalles de la reserva...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='detalles-reservas'>
        <div className='error'>
          <FaExclamationTriangle className='error-icon' />
          <p className='error-message'>{error}</p>
          <p className='error-submessage'>Redirigiendo a Mis Reservas...</p>
        </div>
      </div>
    );
  }

  const reserva = Reservas.find(r => r.id_reserva === parseInt(id));

  if (!reserva) {
    return (
      <div className='detalles-reservas'>
        <div className='error'>
          <FaExclamationTriangle className='error-icon' />
          <p className='error-message'>Reserva no encontrada</p>
          <p className='error-submessage'>Redirigiendo a Mis Reservas...</p>
        </div>
      </div>
    );
  }

  const salon = Salones.find(salon => salon.id_salon === reserva.id_salon);

  // Determinar el estado de la reserva
  const hoy = new Date();
  const fechaReserva = new Date(reserva.fecha_reserva);
  const estado = fechaReserva > hoy ? "Por realizarse" : "Completado";

  return (
    <div className={`pagina-contenedor ${mostrarDatosPago ? 'con-sidebar' : ''}`}>
      <div className='detalles-reservas'>
        <div className='titulo'>
          <h1>Detalle de la Reserva #{id}</h1>
          <IoIosArrowDropdown
            className='icon'
            onClick={() => setMostrarSalon(!mostrarSalon)}
          />
        </div>

        {mostrarSalon && salon && (
          <>
            <div className='salon-card'>
              <div className='salon-izquierda'>
                <h3>{salon.nombre}</h3>
                <div className='salon-ubicacion'>
                  <FaMap className='map-icon' />
                  <p>{salon.ubicacion}</p>
                </div>
              </div>
              <div className='salon-derecha'>
                <img src={salon.fotos[0]} alt={salon.nombre} className='salon-imagen' />
              </div>
            </div>
            <div className='cards-container'>
              <div className='card-estado'>
                <h4>{estado}</h4>
                <p>{formatearFechaCompleta(reserva.fecha_reserva)}</p>
                <div className='horas'>
                  <p>{reserva.hora_inicio}</p>
                  <p>{reserva.hora_fin}</p>
                </div>
              </div>
              <div className='card-vendedor'>
                <h4>Vendedor</h4>
                <p>{nombreVendedor}</p>
              </div>
              <div className='card-info'>
                <h4>Info Reserva</h4>
                <p>{formatearFechaCompleta(reserva.fecha_creacion)}</p>
                <button
                  onClick={toggleDatosPago}
                  className='ver-comprobante'
                >
                  {mostrarDatosPago ? 'Ocultar Comprobante' : 'Ver Comprobante'}
                </button>
              </div>
            </div>
          </>
        )}

        {estado === "Por realizarse" && (
          <div className='cancelar-button-container'>
            <Link to="/" className='cancelar-button'>
              CANCELAR
            </Link>
          </div>
        )}
      </div>
      {mostrarDatosPago && (
        <DatosDelPago
          reservaId={parseInt(id)}
          onClose={toggleDatosPago}
        />
      )}
    </div>
  );
};

export default ReservasDetalles;
