import React, { useRef } from 'react'
import InputAutocomplete from '../../InputAutocomplete/InputAutocomplete';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import './Ubicacion.css'
const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: -33.45694,
  lng: -70.64827,
};
const Ubicacion = ({ isLoaded, salon, handleChange }) => {

  const mapRef = useRef();

  const onPlaceSelected = (data, details) => {
    const location = details?.geometry?.location;
    const e = {
      target: {
        name: "direccion",
        value: location,
        type: "text"
      }
    }
    handleChange(e)

    const lat =
      typeof location?.lat === "function"
        ? location.lat()
        : Number(location?.lat);

    const lng =
      typeof location?.lng === "function"
        ? location.lng()
        : Number(location?.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      console.error("❌ Coordenadas inválidas:", { lat, lng, location });
      return;
    }

    mapRef.current?.panTo({ lat, lng });
  }


  return (
    <div className='form-zone'>
      <div className='section-zone'>

      <h3>Ubicación</h3>
      </div>
      <div className='input-container'>

        <InputAutocomplete
          placeholder="Ingresa tu dirección"
          onPlaceSelected={(data, details) =>
            onPlaceSelected(data, details)
          }
          />
        </div>

      <div>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
          </GoogleMap>
        )}
      </div>
    </div>
  )
}

export default Ubicacion
