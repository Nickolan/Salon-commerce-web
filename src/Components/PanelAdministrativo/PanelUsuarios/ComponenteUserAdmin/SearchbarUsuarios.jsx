import React, { useState, useRef, useEffect } from 'react';
import { GoLock } from "react-icons/go";
import '../PanelUsuarios.css';
import './SearchbarUsuarios.css';

const SearchbarUsuarios = ({
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
    <div className='searchbar-usuarios-wrapper' ref={wrapperRef}>
      <div className="searchbar-usuarios-container">

        {/* Zona clickeable (toda la barra menos Aplicar) */}
        <div
          className={`filtros-usuarios-container ${isOddClick ? 'clicked-odd' : ''}`}
          onClick={handleBarClick}
        >
          <GoLock className="usuario-filtro-icono" />
          <span className="usuario-filtro-texto">Nombre del Usuario</span>
        </div>

        {/* Botón Aplicar */}
        <div
          className={`usuario-boton-aplicar ${!isActive || !localFilterValue ? 'disabled' : ''}`}
          onClick={handleApplyClick}
        >
          Aplicar
        </div>
      </div>

      {/* Input dropdown pegado abajo de la barra */}
      {isActive && (
        <div className="usuario-filtro-dropdown">
          <input
            ref={inputRef}
            type="text"
            placeholder="  ID o nombre de usuario..."
            value={localFilterValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="usuario-filtro-text-input"
          />
        </div>
      )}

      {totalResultados !== undefined && (
        <span className='usuario-contador-resultados'>
          {totalResultados} {totalResultados === 1 ? 'usuario' : 'usuarios'}
        </span>
      )}
    </div>
  );
};

export default SearchbarUsuarios;