// src/screens/HomeScreen.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Importar Link
import { 
  fetchDestacados, 
  fetchVisitados, 
  fetchCercanos 
} from '../store/features/salones/salonSlice';
// Ya no traemos fetchSalones, a menos que quieras un carrusel de "Todos"
// fetchFavoritos se maneja en App.jsx, así que ya deberían estar en el store.

import '../styles/HomeScreen.css';
import Carrusel from '../Components/Carrusel/Carrusel.jsx';
import ItemSalonSimple from '../Components/ItemSalonSimple/ItemSalonSimple.jsx';
import Searchbar from '../Components/SearchBar/searchbar';

const HomeScreen = ({ isLoaded }) => {
  const dispatch = useDispatch();
  
  // --- 1. Obtener TODOS los datos necesarios de Redux ---
  const { 
    destacados, 
    visitados, 
    cercanos, 
    status: salonStatus 
  } = useSelector((state) => state.salones);
  
  const { 
    favoritos, 
    status: favStatus 
  } = useSelector((state) => state.favoritos);
  
  const { 
    isAuthenticated, 
    user 
  } = useSelector((state) => state.auth);

  // Mapeamos los favoritos para obtener solo la lista de salones
  const salonesFavoritos = favoritos.map(fav => fav.salon);
  
  // Condición para "Cercanos"
  const tieneUbicacionUsuario = user && user.latitud && user.longitud;

  // --- 2. Disparar acciones al cargar ---
  useEffect(() => {
    // Estos se cargan siempre
    dispatch(fetchDestacados());

    // Estos solo si el usuario está logueado
    if (isAuthenticated) {
      dispatch(fetchVisitados());
      dispatch(fetchCercanos());
    }
  }, [dispatch, isAuthenticated]);

  // --- 3. Función de renderizado mejorada ---
  // Un renderizador genérico para los carruseles
  const renderizarCarrusel = (titulo, listaSalones, status, error, prompt = null) => {
    // Mostrar prompt si existe (ej. "Añade tu ubicación")
    if (prompt) {
      return (
        <section className='carousel-section'>
          <h3>{titulo}</h3>
          <div className="status-message prompt">
            <p>{prompt.texto}</p>
            {prompt.link && <Link to={prompt.link} className="btn-prompt">{prompt.linkTexto}</Link>}
          </div>
        </section>
      );
    }
    
    // Mostrar mensajes de carga, error o vacío
    if (status === 'loading') {
      return <section className='carousel-section'><h3>{titulo}</h3><p className="status-message">Cargando...</p></section>;
    }
    if (status === 'failed') {
      return <section className='carousel-section'><h3>{titulo}</h3><p className="status-message error">Error al cargar.</p></section>;
    }
    if (listaSalones.length === 0) {
      return <section className='carousel-section'><h3>{titulo}</h3><p className="status-message">No hay salones para mostrar.</p></section>;
    }

    // Renderizar el carrusel
    return (
      <section className='carousel-section'>
        <h3>{titulo}</h3>
        <Carrusel
          items={listaSalones}
          renderItem={(salon) => (
            <ItemSalonSimple
              key={salon.id_salon} // Añadir key aquí
              id_salon={salon.id_salon}
              nombre={salon.nombre}
              precio={salon.precio_por_hora}
              imagen={salon.fotos && salon.fotos.length > 0 ? salon.fotos[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqEx41lmw6yMNksFVU2dPXYqdciHh9CaGlw&s"}
              promedioResenias={salon.promedio_calificacion || 0} // Usamos el promedio del backend
            />
          )}
        />
      </section>
    );
  };
  
  // --- 4. Renderizado principal de la pantalla ---
  return (
    <div className='homescreen-wrapper'>
      <section className='homescreen-header'>
        <h1>¿Quieres reservar un salón para ti?</h1>
        <h2>¡Encuentra los mejores salones para reservar aquí!</h2>
      </section>

      <section className='homescreen-searchbar'>
        {isLoaded && <Searchbar />}
      </section>
      
      {/* Sección del Contenido Principal (ACTUALIZADA) */}
      <main className='homescreen-content'>
        
        {/* Carrusel 1: Destacados (Público) */}
        {renderizarCarrusel("Salones Destacados", destacados, salonStatus)}

        {/* Carrusel 2: Favoritos (Privado) */}
        {isAuthenticated && renderizarCarrusel("Mis Favoritos", salonesFavoritos, favStatus)}

        {/* Carrusel 3: Visitados (Privado) */}
        {isAuthenticated && renderizarCarrusel("Visitados Recientemente", visitados, salonStatus)}

        {/* Carrusel 4: Cercanos (Privado y Condicional) */}
        {isAuthenticated && !tieneUbicacionUsuario && renderizarCarrusel(
          "Salones Cercanos", 
          [], 
          'succeeded', 
          null, 
          { 
            texto: "Añade tu ubicación en tu perfil para ver salones cercanos.", 
            link: "/editar-perfil", 
            linkTexto: "Ir a mi Perfil" 
          }
        )}
        {isAuthenticated && tieneUbicacionUsuario && renderizarCarrusel("Cercanos a ti", cercanos, salonStatus)}

      </main>
    </div>
  );
};

export default HomeScreen;