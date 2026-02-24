import React, { useState, useRef, useEffect } from 'react';
import { FiHome } from "react-icons/fi";
import './SearchbarSalones.css';

const SearchbarSalones = ({
  filterValue,
  onFilterChange,
  onApplyFilter,
  totalResultados
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isOddClick, setIsOddClick] = useState(false);
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
        setIsOddClick(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBarClick = () => {
    if (!isActive) {
      setIsActive(true);
      setIsOddClick(true);
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
      setIsOddClick(false);
    }
  };

  const handleApplyClick = (e) => {
    e.stopPropagation(); // que no active handleBarClick
    if (localFilterValue) {
      onApplyFilter();
      setIsActive(false);
      setIsOddClick(false);
    }
  };

  return (
    <div className='searchbar-salones-wrapper' ref={wrapperRef}>
      <div className="searchbar-salones-container">

        {/* Zona clickeable (toda la barra menos Aplicar) */}
        <div
          className={`filtros-salones-container ${isOddClick ? 'clicked-odd' : ''}`}
          onClick={handleBarClick}
        >
          <FiHome className="salon-filtro-icono" />
          <span className="salon-filtro-texto">Nombre del Salón</span>
        </div>

        {/* Botón Aplicar */}
        <div
          className={`salon-boton-aplicar ${!isActive || !localFilterValue ? 'disabled' : ''}`}
          onClick={handleApplyClick}
        >
          Aplicar
        </div>
      </div>

      {/* Input dropdown pegado abajo de la barra */}
      {isActive && (
        <div className="salon-filtro-dropdown">
          <input
            ref={inputRef}
            type="text"
            placeholder="  Nombre del salón..."
            value={localFilterValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="salon-filtro-text-input"
          />
        </div>
      )}

      {totalResultados !== undefined && (
        <span className='salon-contador-resultados'>
          {totalResultados} {totalResultados === 1 ? 'salón' : 'salones'}
        </span>
      )}
    </div>
  );
};

export default SearchbarSalones;