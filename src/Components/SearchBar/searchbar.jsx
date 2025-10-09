import React, { Fragment, useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from 'react-icons/fa6';
import { BsFillPersonFill } from 'react-icons/bs';
import "./searchbar.css";

function Searchbar({ ubicacionInicial = "", personasInicial = "1" }) {
  const [ubicacion, setUbicacion] = useState(ubicacionInicial);
  const [personas, setPersonas] = useState(personasInicial);
  const navigate = useNavigate();
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

useEffect(() => {
  if (!ubicacion) {
    setSugerencias([]);
    setMostrarSugerencias(false);
    return;
  }
  if (!mostrarSugerencias) return; 

  if (window.google && window.google.maps) {
    const service = new window.google.maps.places.AutocompleteService();
    service.getQueryPredictions({ input: ubicacion }, (predictions, status) => {
      if (status === "OK") setSugerencias(predictions);
      else setSugerencias([]);
    });
  }
}, [ubicacion, mostrarSugerencias]);
  const Buscar = (selectedUbicacion) => {
    const address = selectedUbicacion || ubicacion;
    setSugerencias([]);
    setMostrarSugerencias(false);
    if (!ubicacion.trim()) {
      alert("Ingrese una ubicación");
      return;
    }
    if (!personas.trim() || personas < 1) {
      alert("Ingrese una cantidad mínima de personas");
      return;
    }

    if (!window.google || !window.google.maps) {
      alert("Google Maps no está cargado");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => { 
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        navigate(
  `/resultados?ubicacion=${encodeURIComponent(
    address
  )}&personas=${personas}&lat=${lat}&lng=${lng}`
);
      } else {
        alert("No se pudo encontrar la ubicación. Escriba una dirección válida.");
      }
    });
  };

  return (
    <Fragment>
      <div className="search-bar-wrapper"> 
        <div className="barras_searchbar">
          <FaLocationDot/>
          <input
            type="text"
            placeholder="¿Dónde?"
            value={ubicacion}
             onChange={(e) => {
             setUbicacion(e.target.value);
             setMostrarSugerencias(true); // activar sugerencias
  }}
          />
          { sugerencias.length > 0 && (
  <ul className="sugerencias-lista">
    {sugerencias.map((s, i) => (
      <li key={i} onClick={() => Buscar(s.description)}>
        {s.description}
      </li>
    ))}
  </ul>
)}
        </div>
        <div className="barras_searchbar">
          <BsFillPersonFill/>
          <input
            type="number"
            placeholder="¿Cuántos son?"
            value={personas}
            onChange={(e) => setPersonas(e.target.value)}
          />
        </div>
        <div className="barra_buscar">
          <button className="boton_buscar" onClick={Buscar}>
            Buscar
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default Searchbar;