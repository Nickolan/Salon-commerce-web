// src/screens/DetallesSalon.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalonById, fetchReseniasBySalonId } from '../store/features/salones/salonSlice';

import '../styles/DetallesSalon.css';
import { CiShoppingCart } from "react-icons/ci";
import { FaRegMap } from "react-icons/fa";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import ListasResenias from '../components/ListasResenias/ListasResenias';
import DatosSalonCompleto from '../components/DatosSalonCompleto/DatosSalonCompleto';
import BotonFavoritos from '../Components/BotonFavoritos/BotonFavoritos';
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from 'react-icons/io';

const DetallesSalon = ({ isLoaded }) => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Obtenemos los datos del estado global de Redux
  const { selectedSalon, resenias, status, error } = useSelector((state) => state.salones);

  const [esFavorito, setEsFavorito] = useState(false); // La lógica de favoritos se mantiene local por ahora

  const calcularPromedio = () => {
    if (resenias.length === 0) return 0;
    const suma = resenias.reduce((total, opinion) => total + opinion.calificacion, 0);
    const promedio = suma / opDestacados.length;
    return Math.round(promedio * 10) / 10;
  };

  const promedioCalificacion = calcularPromedio();

  // Usamos useEffect para cargar los datos cuando el componente se monta o el ID cambia
  useEffect(() => {
    if (id) {
      dispatch(fetchSalonById(id));
      dispatch(fetchReseniasBySalonId(id));
    }
  }, [id, dispatch]);

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

  const handleReservarClick = () => {
    navigate(`/reservar/${id}`);
  };

  const toggleFavorito = () => {
    setEsFavorito(!esFavorito);
  };

  // Renderizado condicional mientras cargan los datos
  if (status === 'loading') {
    return <div className='detalles-Salon' style={{ paddingTop: '100px' }}><h1>Cargando...</h1></div>;
  }

  if (status === 'failed' || !selectedSalon) {
    return <div className='detalles-Salon' style={{ paddingTop: '100px' }}><h1>Error: Salón no encontrado</h1><p>{error}</p></div>;
  }

  // Una vez que los datos están listos, renderizamos el componente
  return (
    <div className='detalles-Salon'>
      <div className='titulo'>
        <div className="titulo-izquierda">
          <h1>{selectedSalon.nombre}</h1>
          <div className="direccion">
            <FaRegMap className="logo" />
            <h2>{selectedSalon.direccion}</h2>
          </div>
        </div>
        <div className="titulo-derecha">
          <div className="derecha-superior">
            <BotonFavoritos
              id_salon={selectedSalon.id_salon}
              showText={true}
            />
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
        <DatosSalonCompleto salon={selectedSalon} isLoaded={isLoaded} />
        {/* Pasamos las reseñas obtenidas de la API al componente */}
        <ListasResenias opDestacados={resenias} />
      </div>
    </div>
  );
};

export default DetallesSalon;