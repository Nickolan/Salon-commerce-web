import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import "../styles/ReservasDetalles.css";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaMap } from "react-icons/fa";
import Salones from "../utils/Salones.json";

const ReservasDetalles = () => {
  const location = useLocation();
  const { estado, fecha, horaInicio, horaFin, idSalon, nombreSalon } = location.state || {};

  const [mostrarSalon, setMostrarSalon] = useState(false);
  const salon = Salones.find(salon => salon.id_salon === idSalon);

  return (
    <div className='detalles-reservas'>
      <div className='titulo'>
        <h1>Detalle de la Reserva</h1>
        <IoIosArrowDropdown
          className='icon'
          style={{ color: '#6a0dad' }}
          onClick={() => setMostrarSalon(!mostrarSalon)}
        />
      </div>
      {mostrarSalon && salon && (
        <>
          <div className='salon-card'>
            <div className='salon-izquierda'>
              <h3>Check and Home {salon.id_salon} - {salon.nombre}</h3>
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
              <h4>Estado</h4>
              <p>{estado}</p>
              <p>{fecha}</p>
              <div className='horas'>
                <p>{horaInicio}</p>
                <p>{horaFin}</p>
              </div>
            </div>
            <div className='card-vendedor'>
              <h4>Vendedor</h4>
              <p>Connect Business Room</p>
            </div>
            <div className='card-info'>
              <h4>Info Reserva</h4>
              <p>Borrador {fecha}</p>
              <Link to="/" className='ver-comprobante'>Ver Comprobante</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReservasDetalles;
