import React, { useState, useEffect } from 'react';
import './MapaSalon.css';
import { FaExclamationTriangle, FaRegMap } from "react-icons/fa";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "24px"
};

const defaultCenter = {
  lat: -33.45694,
  lng: -70.64827,
};

const markerIcon = {
  url: "data:image/svg+xml;base64," + btoa(`
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C12.268 0 6 6.268 6 14C6 24.5 20 40 20 40C20 40 34 24.5 34 14C34 6.268 27.732 0 20 0Z" fill="#C8AD7F"/>
      <circle cx="20" cy="14" r="6" fill="white"/>
    </svg>
  `),
  scaledSize: { width: 40, height: 40 },
  anchor: { x: 20, y: 40 }
};

const MapaSalon = ({ salon, isLoaded }) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [geocodingError, setGeocodingError] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (isLoaded && salon?.direccion) {
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
      setMapCenter({ lat: parseFloat(salon.latitud), lng: parseFloat(salon.longitud) });
      setGeocodingError(false);
      setIsGeocoding(false);
    }
  }, [isLoaded, salon]);

  const ErrorMapPlaceholder = () => (
    <div className="mapa-error-placeholder">
      <FaExclamationTriangle className="error-icon" />
      <h3>No se puede cargar el mapa</h3>
      <p>No pudimos obtener la ubicación exacta del salón</p>
      <div className="error-details">
        <FaRegMap className="map-icon" />
        <span>{salon?.direccion || 'Ubicación no disponible'}</span>
      </div>
    </div>
  );

  const LoadingMapPlaceholder = () => (
    <div className="mapa-cargando-placeholder">
      <div className="loading-spinner"></div>
      <p>Cargando mapa...</p>
    </div>
  );

  return (
    <div className="mapa-salon-container">
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
              icon={markerIcon}
              title={salon.nombre}
            />
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default MapaSalon;