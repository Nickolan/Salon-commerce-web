import React, { useState, useEffect } from 'react';
import './DatosSalonCompleto.css';
import { FaRegMap, FaExclamationTriangle } from "react-icons/fa";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "10px"
};

const defaultCenter = {
  lat: -33.45694,
  lng: -70.64827,
};

const redMarkerIcon = {
  url: "data:image/svg+xml;base64," + btoa(`
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C12.268 0 6 6.268 6 14C6 24.5 20 40 20 40C20 40 34 24.5 34 14C34 6.268 27.732 0 20 0Z" fill="#FF0000"/>
      <circle cx="20" cy="14" r="6" fill="white"/>
    </svg>
  `),
  scaledSize: { width: 40, height: 40 },
  anchor: { x: 20, y: 40 }
};

const DatosSalonCompleto = ({ salon, isLoaded }) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [geocodingError, setGeocodingError] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState('');

  useEffect(() => {
    // Inicializar imagen seleccionada si hay fotos
    if (salon?.fotos && salon.fotos.length > 0 && !imagenSeleccionada) {
      setImagenSeleccionada(salon.fotos[0]);
    } else if (!salon?.fotos || salon.fotos.length === 0) {
      setImagenSeleccionada(''); // Resetear si no hay fotos
    }

    // Lógica de Geocoding (sin cambios)
    if (isLoaded && salon?.direccion) { // Usar direccion en lugar de ubicacion si aplica
      setIsGeocoding(true);
      setGeocodingError(false);
      try {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: salon.direccion }, (results, status) => {
          setIsGeocoding(false);
          if (status === 'OK' && results?.[0]) {
            const location = results[0].geometry.location;
            setMapCenter({ lat: location.lat(), lng: location.lng() });
          } else {
            console.error('Error en geocoding:', status);
            setGeocodingError(true);
            // Usar coordenadas del salón si existen
            if (salon.latitud && salon.longitud) {
              setMapCenter({ lat: parseFloat(salon.latitud), lng: parseFloat(salon.longitud) });
            }
          }
        });
      } catch (error) {
        console.error('Error en geocoding:', error);
        setIsGeocoding(false);
        setGeocodingError(true);
      }
    } else if (salon?.latitud && salon?.longitud) {
        // Si no hay dirección pero sí lat/lng, usar esas coordenadas directamente
        setMapCenter({ lat: parseFloat(salon.latitud), lng: parseFloat(salon.longitud) });
        setGeocodingError(false); // No es un error de geocoding si tenemos coords
        setIsGeocoding(false);
    } else if (!salon?.direccion) {
        // Si no hay ni dirección ni coordenadas
        setGeocodingError(true);
        setIsGeocoding(false);
    }

  }, [isLoaded, salon, imagenSeleccionada]);

  const handleThumbnailClick = (urlImagen) => {
    setImagenSeleccionada(urlImagen);
  };

  // Manejar error de imagen
  const handleImageError = (e) => {
    // Intenta mostrar la siguiente imagen si la actual falla, o un placeholder
    const currentIndex = salon.fotos.indexOf(imagenSeleccionada);
    if (currentIndex !== -1 && currentIndex < salon.fotos.length - 1) {
      setImagenSeleccionada(salon.fotos[currentIndex + 1]);
    } else {
      // Si era la última o no se encontró, muestra el placeholder
      setImagenSeleccionada(''); // Indica que no hay imagen válida
    }
  };

  

  // Componente para mostrar cuando hay error de carga
  const ErrorMapPlaceholder = () => (
    <div className="mapa-error-placeholder">
      <FaExclamationTriangle className="error-icon" />
      <h3>No se puede cargar el mapa</h3>
      <p>No pudimos obtener la ubicación exacta del salón</p>
      <div className="error-details">
        <FaRegMap className="map-icon" />
        <span>{salon?.ubicacion || 'Ubicación no disponible'}</span>
      </div>
    </div>
  );

  // Componente para mostrar mientras se carga
  const LoadingMapPlaceholder = () => (
    <div className="mapa-cargando-placeholder">
      <div className="loading-spinner"></div>
      <p>Cargando mapa...</p>
    </div>
  );

  // Determinar si mostrar placeholder de imagen
  const shouldShowImagePlaceholder = !imagenSeleccionada;

  console.log(salon.equipamientos);

  
  

  if (!salon) {
    return <div>No se encontró información del salón</div>;
  }

  return (
    <div className='datosSalonCompleto'>
      <div className="contenedor-principal">
        <div className="columna-izquierda">
          <div className="mapa-ubicacion">
            {!isLoaded ? (
              <LoadingMapPlaceholder />
            ) : isGeocoding ? (
              <LoadingMapPlaceholder />
            ) : geocodingError ? (
              <ErrorMapPlaceholder />
            ) : (
              <div className="mapa-contenedor">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{lat: salon.latitud, lng: salon.longitud}}
                  zoom={15}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                    zoomControl: true,
                  }}
                >
                  <Marker 
                    position={{lat: salon.latitud, lng: salon.longitud}}
                    icon={redMarkerIcon}
                    title={salon.nombre}
                  />
                </GoogleMap>
              </div>
            )}
          </div>
          
          <div className="precio-salon">
            <span className="precio-texto">
              ${salon.precio_por_hora ? salon.precio_por_hora.toLocaleString() : '0'}
            </span>
            <span className="precio-label">por hora</span>
          </div>
        </div>

        <div className="columna-derecha">
          <div className="galeria-imagenes">
            <div className="imagen-principal-salon">
              {imagenSeleccionada ? (
                <img
                  src={imagenSeleccionada}
                  alt={`Imagen principal de ${salon.nombre}`}
                  onError={handleImageError} // Manejo de error para la imagen principal
                />
              ) : (
                <div className="imagen-placeholder">
                  No hay imagen disponible
                </div>
              )}
            </div>

            {/* Contenedor de Thumbnails (solo si hay más de una foto) */}
            {salon.fotos && salon.fotos.length > 1 && (
              <div className="galeria-thumbnails">
                {salon.fotos.map((fotoUrl, index) => (
                  <img
                    key={index}
                    src={fotoUrl}
                    alt={`Thumbnail ${index + 1} de ${salon.nombre}`}
                    className={`thumbnail ${fotoUrl === imagenSeleccionada ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(fotoUrl)}
                    onError={(e) => e.target.style.display = 'none'} // Oculta thumbnails rotos
                  />
                ))}
              </div>
            )}
          </div>

          <div className="detalles-secundarios">
            <div className='equipamiento'>
              {salon.equipamientos && salon.equipamientos.length > 0 ? (
                salon.equipamientos.map((e, index) => <h3 key={index}>{e}</h3>)
              ) : (
                <h3>No hay equipamiento listado</h3>
              )}
            </div>
            <div className='reglas'>
              {salon.reglas && salon.reglas.length > 0 ? (
                salon.reglas.map((regla, index) => <h3 key={index}>{regla}</h3>)
              ) : (
                <h3>No hay reglas especificadas</h3>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='descripcion'>
        <p>{salon.descripcion || 'No hay descripción disponible'}</p>
      </div>
    </div>
  );
};

export default DatosSalonCompleto;