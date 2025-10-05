import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from 'react-icons/fa6';
import { BsFillPersonFill } from 'react-icons/bs';
import "./searchbar.css";

function Searchbar({ ubicacionInicial = "", personasInicial = "1" }) {
  const [ubicacion, setUbicacion] = useState(ubicacionInicial);
  const [personas, setPersonas] = useState(personasInicial);
  const navigate = useNavigate();

  const Buscar = () => {
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
    geocoder.geocode({ address: ubicacion }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        navigate(
          `/resultados?ubicacion=${encodeURIComponent(
            ubicacion
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
            onChange={(e) => setUbicacion(e.target.value)}
          />
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