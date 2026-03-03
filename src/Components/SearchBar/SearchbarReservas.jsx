import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar } from "react-icons/fi";
import './SearchbarReservas.css';

const SearchbarReservas = ({
  filterValue,
  onFilterChange,
  onApplyFilter,
  totalResultados,
  isActive,
  setIsActive
}) => {
  const [localFilterValue, setLocalFilterValue] = useState("");
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setLocalFilterValue(filterValue);
  }, [filterValue]);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // Cerrar el input si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsActive]);

  const handleBarClick = () => {
    if (!isActive) {
      setIsActive(true);
      setLocalFilterValue("");
      onFilterChange("");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalFilterValue(value);
    onFilterChange(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && localFilterValue) {
      onApplyFilter();
      setIsActive(false);
    }
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (localFilterValue) {
      onApplyFilter();
      setIsActive(false);
    }
  };

  return (
    <div className='searchbar-reservas-wrapper' ref={wrapperRef}>
      <div className="searchbar-reservas-container">

        {/* Zona clickeable */}
        <div
          className={`filtros-reservas-container ${isActive ? 'active' : ''}`}
          onClick={handleBarClick}
        >
          <FiCalendar className="reserva-filtro-icono" />
          <span className="reserva-filtro-texto">Buscar por nombre del salón</span>
        </div>

        {/* Botón Aplicar */}
        <div
          className={`reserva-boton-aplicar ${!isActive || !localFilterValue ? 'disabled' : ''}`}
          onClick={handleApplyClick}
        >
          Aplicar
        </div>
      </div>

      {/* Input dropdown */}
      {isActive && (
        <div className="reserva-filtro-dropdown">
          <input
            ref={inputRef}
            type="text"
            placeholder="Nombre del salón..."
            value={localFilterValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="reserva-filtro-text-input"
          />
        </div>
      )}

      {totalResultados !== undefined && (
        <span className='reserva-contador-resultados'>
          {totalResultados} {totalResultados === 1 ? 'reserva' : 'reservas'}
        </span>
      )}
    </div>
  );
};

export default SearchbarReservas;