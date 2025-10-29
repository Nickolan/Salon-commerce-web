import React, { useRef, useState } from "react";
import { GoogleMap, Marker, StandaloneSearchBox } from "@react-google-maps/api";
import "./Ubicacion.css";

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
  const inputRef = useRef();
  const [coords, setCoords] = useState({
    lat: salon.latitud || defaultCenter.lat,
    lng: salon.longitud || defaultCenter.lng,
  });
  const [direccionInput, setDireccionInput] = useState(salon.direccion || "");

  const handlePlaceChanged = async () => {
    const [place] = inputRef.current.getPlaces();

    if (place && place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const direccionFormateada = place.formatted_address;

      setDireccionInput(direccionFormateada);
      setCoords({ lat, lng });
      mapRef.current?.panTo({ lat, lng });

      // ✅ Ahora sí: actualizamos el formData del padre
      handleChange({
        target: { name: "direccion", value: direccionFormateada, type: "text" },
      });
      handleChange({
        target: { name: "latitud", value: lat, type: "number" },
      });
      handleChange({
        target: { name: "longitud", value: lng, type: "number" },
      });


    }
  };

  return (
    <div className="form-zone">
      <div className="section-zone">
        <h3>Ubicación</h3>
      </div>

      <div className="input-container">
        <StandaloneSearchBox
          onLoad={(ref) => (inputRef.current = ref)}
          onPlacesChanged={handlePlaceChanged}
          options={{
            componentRestrictions: { country: "cl" }, // 🇨🇱 Chile (puedes cambiarlo a "ar" o quitarlo)
            fields: ["formatted_address", "geometry", "name", "place_id"],
            types: ["geocode"], // calles y direcciones
          }}
        >
          <input
            type="text"
            className="autocomplete-input"
            required
            placeholder="Ingresa una calle, ciudad o lugar"
            value={direccionInput}
            onChange={(e) => setDireccionInput(e.target.value)}
          />
        </StandaloneSearchBox>
      </div>

      <div className="map-container">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={coords}
            zoom={14}
            onLoad={(map) => (mapRef.current = map)}
          >
            <Marker position={coords} />
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default Ubicacion;
