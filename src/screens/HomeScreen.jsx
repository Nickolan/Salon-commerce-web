import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDestacados, fetchVisitados, fetchCercanos, fetchSalones
} from '../store/features/salones/salonSlice';
import { fetchFavoritos } from '../store/features/favoritos/favoritosSlice';
import { updateUser } from '../store/features/auth/authSlice';

import '../styles/HomeScreen.css';
import Carrusel from '../Components/Carrusel/Carrusel.jsx';
import ItemSalonSimple from '../Components/ItemSalonSimple/ItemSalonSimple.jsx';
import GpsService from '../store/features/salones/GpsService';
import SearchBar from '../Components/SearchBar/searchbar.jsx';

// Iconos para las nuevas secciones
import { FaRegClock } from "react-icons/fa";
import { IoWifi } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { ChevronRight, ChevronLeft } from 'lucide-react';

const HomeScreen = ({ isLoaded }) => {
  const dispatch = useDispatch();
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState(null);
  const [salonesCercanosCalculados, setSalonesCercanosCalculados] = useState([]);
  const [ubicacionTemporal, setUbicacionTemporal] = useState(null);
  
  const { 
    destacados, 
    visitados, 
    cercanos, 
    status: salonStatus,
    salones 
  } = useSelector((state) => state.salones);
  
  const { 
    favoritos, 
    status: favStatus 
  } = useSelector((state) => state.favoritos);
  
  const { 
    isAuthenticated, 
    user 
  } = useSelector((state) => state.auth);

  const salonesFavoritos = favoritos?.map(fav => fav.salon) || [];
  
  const tieneUbicacionUsuario = user?.latitud && user?.longitud;

    useEffect(() => {
    dispatch(fetchDestacados());
    dispatch(fetchSalones()); 
    
    if (isAuthenticated) {
      dispatch(fetchVisitados());
      dispatch(fetchFavoritos()); 
      
      if (tieneUbicacionUsuario) {
        dispatch(fetchCercanos());
      }
    }
  }, [dispatch, isAuthenticated, tieneUbicacionUsuario]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavoritos()); 
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const ubicacionGuardada = localStorage.getItem('ubicacion_temporal');
    if (ubicacionGuardada && !isAuthenticated) {
      try {
        const ubicacion = JSON.parse(ubicacionGuardada);
        setUbicacionTemporal(ubicacion);
      } catch (e) {
        console.error('Error al parsear ubicación temporal:', e);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user?.latitud && user?.longitud && salones?.length > 0) {
      console.log('Calculando cercanos para usuario autenticado');
      const salonesConDistancia = GpsService.ordenarSalonesPorDistancia(salones, {
        latitud: user.latitud,
        longitud: user.longitud
      });
      const salonesValidos = salonesConDistancia.filter(salon => salon.distancia !== undefined);
      setSalonesCercanosCalculados(salonesValidos.slice(0, 10));
    }
    
    if (!isAuthenticated && ubicacionTemporal?.latitud && ubicacionTemporal?.longitud && salones?.length > 0) {
      console.log('Calculando cercanos para usuario NO autenticado', ubicacionTemporal);
      console.log('Total salones disponibles:', salones.length);
      
      const salonesCercanos = GpsService.filtrarSalonesPorRadio(salones, {
        latitud: ubicacionTemporal.latitud,
        longitud: ubicacionTemporal.longitud
      }, 10); 
      
      console.log('Salones cercanos encontrados:', salonesCercanos.length);
      console.log('Primer salón cercano:', salonesCercanos[0]);
      
      setSalonesCercanosCalculados(salonesCercanos.slice(0, 10));
    }
  }, [user, ubicacionTemporal, salones, isAuthenticated]);

  const handleObtenerUbicacion = async () => {
    setObteniendoUbicacion(true);
    setErrorUbicacion(null);

    try {
      const ubicacion = await GpsService.getCurrentPosition();
      
      if (isAuthenticated && user) {
        await dispatch(updateUser({
          id: user.id_usuario,
          userData: {
            latitud: ubicacion.latitud,
            longitud: ubicacion.longitud
          }
        })).unwrap();
        
        setErrorUbicacion({
          tipo: 'exito',
          mensaje: '✓ Ubicación actualizada correctamente. Mostrando salones cercanos...'
        });
        
        dispatch(fetchCercanos());
        setTimeout(() => setErrorUbicacion(null), 3000);
        
      } else {
        const ubicacionData = {
          latitud: ubicacion.latitud,
          longitud: ubicacion.longitud,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('ubicacion_temporal', JSON.stringify(ubicacionData));
        setUbicacionTemporal(ubicacionData);
        
        setErrorUbicacion({
          tipo: 'exito',
          mensaje: '✓ ¡Ubicación obtenida! Mostrando salones cercanos a ti.'
        });
        
        setTimeout(() => setErrorUbicacion(null), 4000);
      }
    } catch (error) {
      setErrorUbicacion({
        tipo: 'error',
        mensaje: error.message
      });
    } finally {
      setObteniendoUbicacion(false);
    }
  };

  const handleLimpiarUbicacionTemporal = () => {
    localStorage.removeItem('ubicacion_temporal');
    setUbicacionTemporal(null);
    setSalonesCercanosCalculados([]);
  };

  const [expandedFeature, setExpandedFeature] = useState(null);

  const toggleFeature = (index) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  const renderCarruselCercanos = () => {
    if (!isAuthenticated && ubicacionTemporal?.latitud && ubicacionTemporal?.longitud) {
        if (salonesCercanosCalculados.length > 0) {
        return (
            <>
            {renderizarCarrusel("Salones Cercanos a Ti", salonesCercanosCalculados, 'succeeded')}
            <div className="ubicacion-temporal-info">
                <div 
                className="btn-limpiar-ubicacion"
                onClick={handleLimpiarUbicacionTemporal}
                role="button"
                tabIndex={0}
                >
                Dejar de compartir ubicación
                </div>
            </div>
            </>
        );
        } else {
        return (
            <section className='carousel-section'>
            <h3>Salones Cercanos</h3>
            <div className="status-message">
                <p>No hay salones cercanos a tu ubicación</p>
            </div>
            </section>
        );
        }
    }

    if (!isAuthenticated) {
      return (
        <section className='carousel-section'>
          <h3>Salones Cercanos</h3>
          <div className="ubicacion-prompt no-auth">
            <p className="ubicacion-prompt-texto">
              Encuentra salones cerca de ti
            </p>
            <div className="ubicacion-prompt-botones vertical">
              <div 
                className="btn-ubicacion btn-primario"
                onClick={() => window.location.href = '/login'}
                role="button"
                tabIndex={0}
              >
                Iniciar sesión
              </div>
              <div 
                className="btn-ubicacion btn-secundario"
                onClick={handleObtenerUbicacion}
                role="button"
                tabIndex={0}
              >
                {obteniendoUbicacion ? (
                  <>
                    <span className="spinner-small"></span>
                    Obteniendo ubicación...
                  </>
                ) : 'Usar mi ubicación actual'}
              </div>
            </div>
            {errorUbicacion && (
              <div className={`ubicacion-mensaje ${errorUbicacion.tipo || 'error'}`}>
                <p>{errorUbicacion.mensaje}</p>
              </div>
            )}
          </div>
        </section>
      );
    }

    if (isAuthenticated && !tieneUbicacionUsuario) {
      return (
        <section className='carousel-section'>
          <h3>Salones Cercanos</h3>
          <div className="ubicacion-prompt">
            <p className="ubicacion-prompt-texto">
              Añade tu ubicación para ver salones cercanos
            </p>
            <div className="ubicacion-prompt-botones vertical">
              <div 
                className="btn-ubicacion btn-primario"
                onClick={() => window.location.href = '/editar-perfil'}
                role="button"
                tabIndex={0}
              >
                Establecer ubicación en /editar-perfil
              </div>
              <div 
                className="btn-ubicacion btn-secundario"
                onClick={handleObtenerUbicacion}
                role="button"
                tabIndex={0}
              >
                {obteniendoUbicacion ? 'Obteniendo ubicación...' : 'Habilitar ubicación'}
              </div>
            </div>
            {errorUbicacion && (
              <div className={`ubicacion-mensaje ${errorUbicacion.tipo || 'error'}`}>
                <p>{errorUbicacion.mensaje}</p>
              </div>
            )}
          </div>
        </section>
      );
    }

    if (isAuthenticated && tieneUbicacionUsuario) {
      if (cercanos?.length > 0) {
        return renderizarCarrusel("Cercanos a ti", cercanos, salonStatus);
      }
      
      if (salonesCercanosCalculados.length > 0) {
        return renderizarCarrusel("Cercanos a ti", salonesCercanosCalculados, 'succeeded');
      }
      
      return (
        <section className='carousel-section'>
          <h3>Cercanos a ti</h3>
          <p className="status-message">No hay salones cercanos para mostrar</p>
        </section>
      );
    }

    return null;
  };

  const renderizarCarrusel = (titulo, listaSalones, status) => {
    if (status === 'loading' && !listaSalones?.length) {
      return (
        <section className='carousel-section'>
          <h3>{titulo}</h3>
          <p className="status-message">Cargando...</p>
        </section>
      );
    }

    if (!listaSalones?.length) {
      return (
        <section className='carousel-section'>
          <h3>{titulo}</h3>
          <p className="status-message">No hay salones para mostrar.</p>
        </section>
      );
    }

    return (
      <section className='carousel-section'>
        <h3>{titulo}</h3>
        <Carrusel
          items={listaSalones}
          renderItem={(salon) => (
            <ItemSalonSimple
              key={salon.id_salon}
              id_salon={salon.id_salon}
              nombre={salon.nombre}
              precio={salon.precio_por_hora}
              distancia={salon.distancia}
              direccion={salon.direccion} 
              imagen={salon.fotos?.[0] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqEx41lmw6yMNksFVU2dPXYqdciHh9CaGlw&s"}
              promedioResenias={salon.promedio_calificacion || 0}
            />
          )}
        />
      </section>
    );
  };

  const handleSearchClick = () => {
    console.log('Búsqueda iniciada');
  };

  return (
    <div className='homescreen-wrapper'>
      <section className='hero-section'>
        <div 
          className='hero-image' 
          style={{ backgroundImage: 'url(/images/imagen_generada.png)' }}
        >
          <h1 className='hero-title'>TU ESPACIO DE ESTUDIO IDEAL ESTÁ AQUÍ</h1>
        </div>

        <div className='hero-searchbar-wrapper'>
          <SearchBar/>
        </div>

      </section>

      {/* --- SECCIÓN DE CARACTERÍSTICAS (3 CONTAINERS) --- */}
      <section className='features-section'>
        {/* Container Izquierdo - Reserva por horas */}
        <div 
          className={`feature-container left-container ${expandedFeature === 1 ? 'expanded' : ''}`}
          onClick={() => toggleFeature(1)}
          role="button"
          tabIndex={0}
        >
          <div className="feature-content">
            <div className="feature-icon-bg">
              <FaRegClock className="feature-icon" />
            </div>
            <h3 className="feature-title">RESERVA POR HORAS</h3>
          </div>
          <div className={`feature-description-wrapper ${expandedFeature === 1 ? 'show' : ''}`}>
            <p className="feature-description">
              Reserva tu espacio solo el tiempo que necesitas para estudiar, 
              desde 1 hora en adelante. Flexibilidad total para tu bolsillo y tu agenda.
            </p>
          </div>
        </div>

        {/* Container Medio - Conectividad */}
        <div 
          className={`feature-container middle-container ${expandedFeature === 2 ? 'expanded' : ''}`}
          onClick={() => toggleFeature(2)}
          role="button"
          tabIndex={0}
        >
          <div className="feature-content">
            <div className="feature-icon-bg">
              <IoWifi className="feature-icon" />
            </div>
            <h3 className="feature-title">CONECTIVIDAD GARANTIZADA</h3>
          </div>
          <div className={`feature-description-wrapper ${expandedFeature === 2 ? 'show' : ''}`}>
            <p className="feature-description">
              Todos nuestros espacios cuentan con fibra óptica dedicada y 
              enchufes en cada mesa para que nunca te desconectes.
            </p>
          </div>
        </div>

        {/* Container Derecho - Cerca de ti */}
        <div 
          className={`feature-container right-container ${expandedFeature === 3 ? 'expanded' : ''}`}
          onClick={() => toggleFeature(3)}
          role="button"
          tabIndex={0}
        >
          <div className="feature-content">
            <div className="feature-icon-bg">
              <LuMapPin className="feature-icon" />
            </div>
            <h3 className="feature-title">CERCA DE DONDE ESTÉS</h3>
          </div>
          <div className={`feature-description-wrapper ${expandedFeature === 3 ? 'show' : ''}`}>
            <p className="feature-description">
              Encuentra salones de estudio en puntos estratégicos de la ciudad, 
              cerca de tu ubicación o universidad.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN ¿CÓMO PUEDES RESERVAR? (RECTÁNGULO PRINCIPAL) --- */}
      <section className="how-to-reserve-section">
        <div className="reserve-container">
          <h2 className="reserve-main-title">¿Cómo puedes reservar?</h2>
          
          {/* Paso 1 - EXPLORA */}
          <div className="reserve-step step-1">
            <div className="step-number">1</div>
            <div className="step-content">
              <span className="step-action">EXPLORA</span>
              <ChevronRight className="step-icon" size={48} />
              <p className="step-description">
                Filtra por ubicación, precio o capacidad. Mira las fotos y 
                elige el ambiente perfecto para ti.
              </p>
            </div>
          </div>

          {/* Paso 2 - RESERVA */}
          <div className="reserve-step step-2">
            <div className="step-content">
              <p className="step-description">
                Elige el horario y asegura tu lugar pagando de forma 100% segura 
                a través de Mercado Pago.
              </p>
              <ChevronLeft className="step-icon" size={48} />
              <span className="step-action">RESERVA</span>
            </div>
            <div className="step-number">2</div>
          </div>

          {/* Paso 3 - DISFRUTA (Contenedor más pequeño) */}
          <div className="reserve-step step-3">
            <div className="step-number">3</div>
            <div className="step-content">
              <span className="step-action">DISFRUTA</span>
              <ChevronRight className="step-icon" size={48} />
              <p className="step-description">
                Llega al salón, comienza tu sesión de estudio y aprovecha al máximo 
                el espacio reservado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN MEJORES PUNTUADOS --- */}
      <section className="top-rated-section">
        <h2 className="top-rated-title">Mejores Puntuados</h2>
        
        {/* Contenedor de carruseles (la lógica ya existente) */}
        <main className='homescreen-content'>
          {renderizarCarrusel("", destacados, salonStatus)}
          {isAuthenticated && renderizarCarrusel("Mis Favoritos", salonesFavoritos, favStatus)}
          {isAuthenticated && renderizarCarrusel("Visitados Recientemente", visitados, salonStatus)}
          {renderCarruselCercanos()}
        </main>
      </section>
    </div>
  );
};

export default HomeScreen;