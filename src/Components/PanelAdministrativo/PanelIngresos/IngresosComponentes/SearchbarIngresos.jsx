// SearchbarIngresos.jsx MODIFICADO
import React, { useState, useRef, useEffect } from 'react';
import { FiLock } from "react-icons/fi"; // Eliminamos FiCalendar
import './SearchbarIngresos.css';

const SearchbarIngresos = ({ 
  activeFilter, 
  filterValue, 
  onFilterClick, 
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
        if (activeFilter) {
          onFilterClick(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeFilter, onFilterClick]);

  const handleBarClick = (filter) => {
    if (!isActive) {
      setIsActive(true);
      setIsOddClick(true);
      onFilterClick(filter);
      setLocalFilterValue("");
      onFilterChange("");
    } else if (activeFilter !== filter) {
      onFilterClick(filter);
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
    e.stopPropagation();
    if (localFilterValue) {
      onApplyFilter();
      setIsActive(false);
      setIsOddClick(false);
    }
  };

  const getInputPlaceholder = () => {
    return 'mercado pago / cripto...'; // Solo un placeholder
  };

  return (
    <div className='searchbar-ingresos-wrapper' ref={wrapperRef}>
      <div className="searchbar-ingresos-container">
        {/* Filtros - SOLO MÉTODO DE PAGO */}
        <div className="filtros-ingresos-container">
          {/* Filtro Método de pago */}
          <div 
            className={`filtro-item filtro-metodo ${activeFilter === 'metodo' && isOddClick ? 'clicked-odd' : ''}`}
            onClick={() => handleBarClick('metodo')}
            style={{ width: '100%', justifyContent: 'center' }} // Ocupa todo el espacio
          >
            <FiLock className="filtro-icono" />
            <span className="filtro-texto">Método de pago</span>
          </div>
        </div>

        {/* Botón Aplicar */}
        <div 
          className={`ingresos-boton-aplicar ${(!isActive || !localFilterValue) ? 'disabled' : ''}`}
          onClick={handleApplyClick}
        >
          Aplicar
        </div>
      </div>

      {/* Input dropdown */}
      {isActive && (
        <div className="ingresos-filtro-dropdown">
          <input
            ref={inputRef}
            type="text"
            placeholder={getInputPlaceholder()}
            value={localFilterValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="ingresos-filtro-input"
          />
        </div>
      )}
      
      {totalResultados !== undefined && (
        <span className='ingresos-contador-resultados'>
          {totalResultados} {totalResultados === 1 ? 'transacción' : 'transacciones'}
        </span>
      )}
    </div>
  );
};

export default SearchbarIngresos;