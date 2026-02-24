import React, { useState, useRef, useEffect } from 'react';
import { FiUser, FiHome } from "react-icons/fi";
import './SearchbarReservas.css';

const SearchbarReservas = ({ 
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
    switch(activeFilter) {
      case 'usuario': return 'ID o nombre de usuario...';
      case 'salon': return 'ID o nombre del salón...';
      default: return '';
    }
  };

  return (
    <div className='searchbar-reservas-wrapper' ref={wrapperRef}>
      <div className="searchbar-reservas-container">
        {/* Filtros - ahora solo Usuario y Salón */}
        <div className="filtros-reservas-container">
          {/* Filtro Usuario - ocupa 50% */}
          <div 
            className={`filtro-item filtro-usuario ${activeFilter === 'usuario' && isOddClick ? 'clicked-odd' : ''}`}
            onClick={() => handleBarClick('usuario')}
          >
            <FiUser className="filtro-icono" />
            <span className="filtro-texto">Usuario</span>
          </div>

          <span className="filtro-divider">|</span>
          
          {/* Filtro Salón - ocupa 50% */}
          <div 
            className={`filtro-item filtro-salon ${activeFilter === 'salon' && isOddClick ? 'clicked-odd' : ''}`}
            onClick={() => handleBarClick('salon')}
          >
            <FiHome className="filtro-icono" />
            <span className="filtro-texto">Salón</span>
          </div>
        </div>

        {/* Botón Aplicar - sin cambios */}
        <div 
          className={`reservas-boton-aplicar ${(!isActive || !localFilterValue) ? 'disabled' : ''}`}
          onClick={handleApplyClick}
        >
          Aplicar
        </div>
      </div>

      {/* Input dropdown - actualizado sin opción de fecha */}
      {isActive && (
        <div className="reservas-filtro-dropdown">
          <input
            ref={inputRef}
            type="text"
            placeholder={getInputPlaceholder()}
            value={localFilterValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="reservas-filtro-input"
          />
        </div>
      )}
      
      {totalResultados !== undefined && (
        <span className='reservas-contador-resultados'>
          {totalResultados} {totalResultados === 1 ? 'reserva' : 'reservas'}
        </span>
      )}
    </div>
  );
};

export default SearchbarReservas;