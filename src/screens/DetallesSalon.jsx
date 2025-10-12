import React, { useState } from 'react';
import '../styles/DetallesSalon.css';
import Salones from '../utils/Salones.json';
import { CiShoppingCart } from "react-icons/ci";
import { FaRegMap } from "react-icons/fa";
import { IoMdStarOutline, IoMdStarHalf, IoMdStar } from "react-icons/io";
import Resenias from '../utils/Resenias.json';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import ListasResenias from '../components/ListasResenias/ListasResenias';
import DatosSalonCompleto from '../components/DatosSalonCompleto/DatosSalonCompleto';

const DetallesSalon = ({ isLoaded }) => {
  const salon = Salones.find(salon => salon.precio_por_hora === 5000.0) || {};
  const opDestacados = Resenias
    .filter(resenia => resenia.id_usuario && resenia.nombre_usuario)
    .slice(-4);

  const navigate = useNavigate();

  const calcularPromedio = () => {
    if (opDestacados.length === 0) return 0;
    const suma = opDestacados.reduce((total, opinion) => total + opinion.calificacion, 0);
    const promedio = suma / opDestacados.length;
    return Math.round(promedio * 10) / 10;
  };

  const promedioCalificacion = calcularPromedio();

  const handleReservarClick = () => {
    navigate('/');
  };

  const renderizarEstrellas = (calificacion) => {
    const estrellas = [];
    const estrellasLlenas = Math.floor(calificacion);
    const tieneMediaEstrella = calificacion - estrellasLlenas >= 0.5;
    for (let i = 0; i < estrellasLlenas; i++) {
      estrellas.push(<IoMdStar key={`full-${i}`} className="logo" />);
    }
    if (tieneMediaEstrella) {
      estrellas.push(<IoMdStarHalf key="half" className="logo" />);
    }
    const estrellasVacias = 5 - estrellas.length;
    for (let i = 0; i < estrellasVacias; i++) {
      estrellas.push(<IoMdStarOutline key={`empty-${i}`} className="logo" />);
    }
    return estrellas;
  };

  const [esFavorito, setEsFavorito] = useState(false);
  const toggleFavorito = () => {
    setEsFavorito(!esFavorito);
  };

  return (
    <div className='detalles-Salon'>
      <div className='titulo'>
        <div className="titulo-izquierda">
          <h1>{salon.nombre}</h1>
          <div className="direccion">
            <FaRegMap className="logo"/>
            <h2>{salon.ubicacion}</h2>
            <CiShoppingCart className="logo"/>
            <h2>Connect Business Rooms</h2>
          </div>
        </div>
        <div className="titulo-derecha">
          <div className="derecha-superior">
            {esFavorito ? (
              <FaHeart className="logo favorito-lleno" onClick={toggleFavorito}/>
            ) : (
              <FaRegHeart className="logo favorito-vacio" onClick={toggleFavorito} />
            )}
            <div className="reservar-button" onClick={handleReservarClick}>
              <span className="reservar-texto">Reservar</span>
            </div>
          </div>
          <div className="estrellas">
            {renderizarEstrellas(promedioCalificacion)}
            <span className="promedio-texto">({promedioCalificacion})</span>
          </div>
        </div>
      </div>

      <div className='detalles'>
        <DatosSalonCompleto salon={salon} isLoaded={isLoaded} />
        <ListasResenias opDestacados={opDestacados} />
      </div>
    </div>
  );
};

export default DetallesSalon;