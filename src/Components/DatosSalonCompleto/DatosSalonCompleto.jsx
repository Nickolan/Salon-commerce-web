import React, { useState, useEffect } from 'react';
import './DatosSalonCompleto.css';
import { LuMapPin } from "react-icons/lu";
import { FiShoppingCart, FiUsers } from "react-icons/fi";
import BotonFavoritos from '../BotonFavoritos/BotonFavoritos.jsx';

const DatosSalonCompleto = ({ salon, isLoaded, esDueno = false, onReservar, onEditar }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (salon?.fotos?.length > 0) {
      setSelectedImage(0);
    }
  }, [salon]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (salon?.fotos?.length) {
      setSelectedImage((prev) => (prev === 0 ? salon.fotos.length - 1 : prev - 1));
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (salon?.fotos?.length) {
      setSelectedImage((prev) => (prev === salon.fotos.length - 1 ? 0 : prev + 1));
    }
  };

  if (!salon) {
    return <div className="datos-salon-error">No se encontró información del salón</div>;
  }

  return (
    <div className="datos-completo-card">
      {/* Columna izquierda - Galería */}
      <div className="datos-completo-gallery">
        <div className="datos-completo-main">
          <img 
            src={salon.fotos?.[selectedImage] || 'placeholder.jpg'} 
            alt={salon.nombre}
          />
          {salon.fotos?.length > 1 && (
            <div className="datos-completo-nav">
              <div onClick={handlePrevImage} className="datos-completo-nav-btn">&lt;</div>
              <div onClick={handleNextImage} className="datos-completo-nav-btn">&gt;</div>
            </div>
          )}
        </div>
        
        {salon.fotos?.length > 1 && (
          <div className="datos-completo-thumbnails">
            {salon.fotos.slice(0, 3).map((foto, index) => (
              <img
                key={index}
                src={foto}
                alt={`${salon.nombre} ${index + 1}`}
                className={selectedImage === index ? 'datos-completo-thumb-active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Columna derecha - Información */}
      <div className="datos-completo-info">
        <div className="datos-completo-header">
          <h1 className="datos-completo-titulo">{salon.nombre}</h1>
          <div className="datos-completo-rating">
            {salon.promedioCalificacion || '0'}
          </div>
        </div>

        <div className="datos-completo-location">
          <LuMapPin />
          <span>{salon.direccion}</span>
        </div>

        <div className="datos-completo-capacity">
          <FiUsers />
          <span>Para {salon.capacidad || 'N/A'} Personas</span>
        </div>

        <div className="datos-completo-connect">
          <FiShoppingCart />
          <span>Connect Business Rooms</span>
        </div>

        <div className="datos-completo-divider"></div>

        {/* Equipamientos */}
        {salon.equipamientos?.length > 0 && (
          <div className="datos-completo-equipamientos">
            <div className="datos-completo-equipamientos-list">
              {salon.equipamientos.map((eq, index) => (
                <span key={index} className="datos-completo-equipamiento-item">{eq}</span>
              ))}
            </div>
          </div>
        )}

        {/* Reglas */}
        {salon.reglas?.length > 0 && (
          <div className="datos-completo-reglas">
            <div className="datos-completo-reglas-list">
              {salon.reglas.map((regla, index) => (
                <span key={index} className="datos-completo-regla-item">{regla}</span>
              ))}
            </div>
          </div>
        )}

        <div className="datos-completo-divider"></div>

        {/* Precio y acciones */}
        <div className="datos-completo-actions">
          <div className="datos-completo-precio">
            <span className="datos-completo-monto">${salon.precio_por_hora?.toLocaleString() || '0'}</span>
            <span className="datos-completo-hora">por hora</span>
          </div>

          {!esDueno ? (
            <div className="datos-completo-botones">
              <BotonFavoritos 
                id_salon={salon.id_salon}
                showText={false}
                isIconOnly={false}
                customClass="datos-completo-favorito"
              />
              <div 
                className="datos-completo-reservar-btn"
                onClick={onReservar}
              >
                Reservar
              </div>
            </div>
          ) : (
            <div 
              className="datos-completo-editar-btn"
              onClick={onEditar}
            >
              Editar Salón
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatosSalonCompleto;