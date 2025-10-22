import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalones } from '../store/features/salones/salonSlice';

import '../styles/HomeScreen.css'; // Importa los nuevos estilos

import Carrusel from '../Components/Carrusel/Carrusel.jsx';
import ItemSalonSimple from '../Components/ItemSalonSimple/ItemSalonSimple.jsx';
import Searchbar from '../Components/SearchBar/searchbar';

const HomeScreen = ({isLoaded}) => {
  const dispatch = useDispatch();
  
  // 1. Obtenemos los datos y el estado de carga desde el store de Redux
  const { salones, status, error } = useSelector((state) => state.salones);

  // 2. Disparamos la acción para buscar salones cuando el componente se carga
  useEffect(() => {
    // Solo hacemos la petición si no se han cargado antes o si hubo un error
    if (status === 'idle' || status === 'failed') {
      dispatch(fetchSalones());
    }
  }, [status, dispatch]);

  // 3. Función limpia para renderizar el contenido del carrusel
  const renderizarSalones = () => {
    // Manejo de estados de carga y error
    if (status === 'loading') {
      return <p className="status-message">Cargando salones...</p>;
    }
    if (status === 'failed') {
      return <p className="status-message error">Error al cargar salones: {error}</p>;
    }
    if (status === 'succeeded' && salones.length === 0) {
      return <p className="status-message">No hay salones disponibles en este momento.</p>;
    }

    // Si todo está bien, renderizamos el Carrusel
    return (
      <Carrusel
        items={salones}
        renderItem={(salon) => (
          <ItemSalonSimple
            id_salon={salon.id_salon}
            nombre={salon.nombre}
            precio={salon.precio_por_hora}
            imagen={salon.fotos && salon.fotos.length > 0 ? salon.fotos[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqEx41lmw6yMNksFVU2dPXYqdciHh9CaGlw&s"} // Imagen por defecto
          />
        )}
      />
    );
  };

  return (
    <div className='homescreen-wrapper'>
      {/* Sección del Título */}
      <section className='homescreen-header'>
        <h1>¿Quieres reservar un salón para ti?</h1>
        <h2>¡Encuentra los mejores salones para reservar aquí!</h2>
      </section>

      {/* Sección de la Barra de Búsqueda */}
      <section className='homescreen-searchbar'>
        {
          isLoaded &&  <Searchbar />
        }
        
      </section>
      
      {/* Sección del Contenido Principal (Carruseles) */}
      <main className='homescreen-content'>
        <section className='carousel-section'>
          <h3>Salones Destacados</h3>
          {renderizarSalones()}
        </section>

        <section className='carousel-section'>
          <h3>Vistos Recientemente</h3>
          {renderizarSalones()}
        </section>

        <section className='carousel-section'>
          <h3>Mis Favoritos</h3>
          {renderizarSalones()}
        </section>
        
        {/* Aquí podrías agregar más carruseles en el futuro */}
        {/* <section className='carousel-section'>
          <h3>Cerca de tu ubicación</h3>
          {renderizarSalones()}
        </section> 
        */}
      </main>
    </div>
  );
};

export default HomeScreen;