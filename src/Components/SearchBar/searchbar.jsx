import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchSalones } from '../../store/features/salones/salonSlice';
import Autocomplete from 'react-google-autocomplete';
import { FaSearch } from 'react-icons/fa';
import './searchbar.css';

const Searchbar = () => {
  const [capacidad, setCapacidad] = useState(1);
  const [ubicacion, setUbicacion] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePlaceSelected = (place) => {
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setUbicacion({ lat, lng });
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
      capacidad: capacidad > 0 ? capacidad : 1,
    }));

    navigate('/resultados'); // Navegamos a la página de resultados
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <Autocomplete
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} // Asegúrate de tener tu key en .env
          onPlaceSelected={handlePlaceSelected}
          options={{
            types: ["geocode"],
            componentRestrictions: { country: "ar" }, // Limita la búsqueda a Argentina
          }}
          placeholder="¿Dónde quieres estudiar?"
          className="search-input location"
        />
      </div>
      <div className="search-input-wrapper capacity">
        <input
          type="number"
          value={capacidad}
          onChange={(e) => setCapacidad(Number(e.target.value))}
          min="1"
          className="search-input"
        />
        <span>personas</span>
      </div>
      <button className="search-button" onClick={handleSearch}>
        <FaSearch />
        <span>Buscar</span>
      </button>
    </div>
  );
};

export default Searchbar;