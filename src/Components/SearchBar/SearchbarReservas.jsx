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

  // Auto-focus cuando se activa
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
        // Cuando se cierra sin aplicar, mantenemos el filtro actual
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsActive]);

  const handleBarClick = () => {
    if (!isActive) {
      setIsActive(true);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalFilterValue(value);
    onFilterChange(value); // Filtro en tiempo real
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onApplyFilter();
      setIsActive(false);
    }
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    onApplyFilter();
    setIsActive(false);
  };

  return (
    <div className='searchbar-reservas-wrapper' ref={wrapperRef}>
      <div className="searchbar-reservas-container">

        {/* Zona clickeable - AHORA CON INPUT INLINE */}
        <div
          className={`filtros-reservas-container ${isActive ? 'active' : ''}`}
          onClick={handleBarClick}
        >
          <FiCalendar className="reserva-filtro-icono" />
          
          {isActive ? (
            <input
              ref={inputRef}
              type="text"
              placeholder="Escribe nombre del salón..."
              value={localFilterValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="reserva-filtro-input-inline"
            />
          ) : (
            <span className="reserva-filtro-texto">
              {localFilterValue || "Buscar por nombre del salón"}
            </span>
          )}
        </div>

        {/* Botón Aplicar - SIEMPRE VISIBLE */}
        <div
          className={`reserva-boton-aplicar ${!localFilterValue ? 'disabled' : ''}`}
          onClick={handleApplyClick}
        >
          Aplicar
        </div>
      </div>

      {totalResultados !== undefined && (
        <span className='reserva-contador-resultados'>
          {totalResultados} {totalResultados === 1 ? 'reserva' : 'reservas'}
        </span>
      )}
    </div>
  );
};

export default SearchbarReservas;