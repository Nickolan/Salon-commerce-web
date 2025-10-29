import React, { useState } from 'react';
import { FiSearch, FiSliders } from "react-icons/fi";
import './BarraBusqueda.css';

const BarraBusqueda = ({ placeholder, onSearch, totalSalones }) => {
  const [query, setQuery] = useState(""); 

  const handleInputChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };


  return (
    <div className='barra-busqueda-wrapper'>
      <div className="barra-busqueda">
        <FiSearch className="icono-busqueda" />
        <input
          type="text"
          placeholder={placeholder || "Buscar..."}
          value={query}
          onChange={handleInputChange}
          className="input-busqueda"
        />
      </div>
      {totalSalones !== undefined && (
        <span className='contador-resultados'>
          {totalSalones} {totalSalones === 1 ? 'resultado' : 'resultados'}
        </span>
      )}
    </div>
  );
};

export default BarraBusqueda;