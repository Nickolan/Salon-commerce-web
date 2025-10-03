import React, { useState } from 'react'; // Agrega useState aquí
import '../styles/DetallesSalon.css'
import Salones from '../utils/Salones.json';
import { CiShoppingCart } from "react-icons/ci"
import { FaRegMap } from "react-icons/fa";
import { IoMdStarOutline } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";
import { IoMdStar } from "react-icons/io";
import Resenias from '../utils/Resenias.json';
import { FaRegHeart, FaHeart } from "react-icons/fa"

const DetallesSalon = () => {
  const salon = Salones.find(salon => salon.precio_por_hora === 5000.0) || {};
  const opDestacados = Resenias
    .filter(resenia => resenia.id_usuario && resenia.nombre_usuario)
    .slice(-4);

  // Función para calcular el promedio
  const calcularPromedio = () => {
    if (opDestacados.length === 0) return 0;
    
    const suma = opDestacados.reduce((total, opinion) => total + opinion.calificacion, 0);
    const promedio = suma / opDestacados.length;
    
    return Math.round(promedio * 10) / 10;
  };

  const promedioCalificacion = calcularPromedio();

  // Función para renderizar estrellas dinámicas
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
                    <div className="reservar-button">
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
                <div className="imagen">
                    {salon.fotos && salon.fotos.length > 0 && <img src={salon.fotos[0]} alt="Salón" />}
                </div>

            <div className="detalles-secundarios">
            <div className='equipamiento'>
                {salon.equipamientos_json && (
                        <>
                            {salon.equipamientos_json.wifi && <h3>Wi-Fi</h3>}
                            {salon.equipamientos_json.proyector && <h3>Proyector</h3>}
                            {salon.equipamientos_json.pizarra && <h3>Pizarra</h3>}
                            {salon.equipamientos_json.aire_acondicionado && <h3>Aire Acondicionado</h3>}
                        </>
                    )}
            </div>
            <div className='reglas'>
                {salon.reglas && salon.reglas.map((regla, index) => <h3 key={index}>{regla}</h3>)}
            </div>
            </div>
            <div className='descripcion'>
                <p> {salon.descripcion} </p>
            </div>
            <div className='opiniones-destacadas'>
                <h2>Opiniones Destacadas</h2>
                <div className="opiniones-grid">
                  {opDestacados.map((opinion, index) => (
                    <div key={opinion.id_resenia} className="opinion-card">
                      <div className="opinion-header">
                        <span className="usuario-nombre">{opinion.nombre_usuario}</span>
                        <span className="opinion-numero">{index + 1}</span>
                      </div>
                      <p className="opinion-comentario">{opinion.comentario}</p>
                    </div>
                  ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default DetallesSalon;