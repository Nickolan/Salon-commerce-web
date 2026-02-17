import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchSalones } from '../../store/features/salones/salonSlice';
import Autocomplete from 'react-google-autocomplete';
import { LuMapPin } from "react-icons/lu";
import './searchbar.css';

const Searchbar = () => {
  const [ubicacion, setUbicacion] = useState(null);
  const [ubicacionTexto, setUbicacionTexto] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePlaceSelected = (place) => {
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setUbicacion({ lat, lng });
      setUbicacionTexto(place.formatted_address || place.name);
    }
  };

  const handleSearch = () => {
    if (!ubicacion) {
      alert('Por favor, selecciona una ubicación de la lista.');
      return;
    }
    
    dispatch(searchSalones({
      lat: ubicacion.lat,
      lng: ubicacion.lng,
      // Capacidad ya no se envía
    }));

    navigate('/resultados');
  };

  return (
    <div className="searchbar-figma">
      <div className="searchbar-field location-field">
        <LuMapPin className="searchbar-icon" />
        <Autocomplete
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          onPlaceSelected={handlePlaceSelected}
          options={{
            types: ["geocode"],
            componentRestrictions: { country: "ar" },
          }}
          placeholder="¿Dónde?"
          className="searchbar-input"
          value={ubicacionTexto}
          onChange={(e) => setUbicacionTexto(e.target.value)}
        />
      </div>

      <button className="search-button-figma" onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
};

export default Searchbar;