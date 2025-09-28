import React, { useRef } from 'react'
import InputAutocomplete from '../../InputAutocomplete/InputAutocomplete';
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: -33.45694,
  lng: -70.64827,
};
const Ubicacion = ({ isLoaded }) => {

  const mapRef = useRef();

  const onPlaceSelected = (data, details) => {
    const location = details?.geometry?.location;

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
    <div>
      <h1>Ubicacion</h1>
      <div>

      <InputAutocomplete
        placeholder="Dirección..."
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
