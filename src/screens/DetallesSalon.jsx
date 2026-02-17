// src/screens/DetallesSalon.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalonById, fetchReseniasBySalonId } from '../store/features/salones/salonSlice';

import '../styles/DetallesSalon.css';
import DatosSalonCompleto from '../Components/DatosSalonCompleto/DatosSalonCompleto';
import MapaSalon from '../Components/DatosSalonCompleto/MapaSalon';
import ListasResenias from '../Components/ListasResenias/ListasResenias';
import PreguntasComponent from '../Components/Q&A/Questions/PreguntasComponent.jsx';

const DetallesSalon = ({ isLoaded }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedSalon, resenias, status, error } = useSelector((state) => state.salones);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const soyElPublicante = user && selectedSalon?.publicador?.id_usuario === user.id_usuario;

  useEffect(() => {
    if (id) {
      dispatch(fetchSalonById(id));
      dispatch(fetchReseniasBySalonId(id));
    }
  }, [id, dispatch]);

  const handleReservarClick = () => {
    navigate(`/reservar/${id}`);
  };

  const handleEditarSalonClick = () => {
    navigate(`/editar-salon/${id}`);
  };

  // Calcular promedio para el rating
  const calcularPromedio = () => {
    if (!resenias || resenias.length === 0) return 0;
    const suma = resenias.reduce((total, opinion) => total + opinion.calificacion, 0);
    const promedio = suma / resenias.length;
    return Math.round(promedio * 10) / 10;
  };

  // Añadir el promedio al objeto del salón
  const salonConPromedio = selectedSalon ? {
    ...selectedSalon,
    promedioCalificacion: calcularPromedio()
  } : null;

  if (status === 'loading') {
    return (
      <div className='detalles-Salon'>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando información del salón...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed' || !selectedSalon) {
    return (
      <div className='detalles-Salon'>
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Salón no encontrado'}</p>
          <div className="error-action" onClick={() => navigate('/')}>
            Volver al inicio
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='detalles-Salon'>
      <div className="detalles-salon-container">
        {/* Componente principal con toda la información del salón */}
        <DatosSalonCompleto 
          salon={salonConPromedio}
          isLoaded={isLoaded}
          esDueno={soyElPublicante}
          onReservar={handleReservarClick}
          onEditar={handleEditarSalonClick}
        />

        {/* Sección de descripción */}
        <div className="detalles-descripcion-section">
          <h2>SOBRE ESTE ESPACIO</h2>
          <p>{selectedSalon.descripcion || 'No hay descripción disponible'}</p>
        </div>

        {/* Sección del mapa */}
        <div className="detalles-mapa-section">
          <h2>DÓNDE ESTUDIARÁS</h2>
          <div className="detalles-mapa-contenedor">
            <MapaSalon 
              salon={selectedSalon} 
              isLoaded={isLoaded}
            />
          </div>
        </div>

        {/* Sección de preguntas */}
        <PreguntasComponent
          salonId={id}
          usuarioAutenticado={isAuthenticated}
          usuarioId={user?.id_usuario}
          esDuenoSalon={soyElPublicante}
        />

        {/* Sección de reseñas */}
        <ListasResenias resenias={resenias} />
      </div>
    </div>
  );
};

export default DetallesSalon;