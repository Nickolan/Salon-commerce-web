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
    <div className="datos-salon-completo">
      {/* Columna izquierda - Galería */}
      <div className="datos-salon-gallery">
        <div className="datos-gallery-main">
          <img 
            src={salon.fotos?.[selectedImage] || 'placeholder.jpg'} 
            alt={salon.nombre}
          />
          {salon.fotos?.length > 1 && (
            <div className="datos-gallery-nav">
              <div onClick={handlePrevImage} className="gallery-nav-btn">&lt;</div>
              <div onClick={handleNextImage} className="gallery-nav-btn">&gt;</div>
            </div>
          )}
        </div>
        
        {salon.fotos?.length > 1 && (
          <div className="datos-gallery-thumbnails">
            {salon.fotos.slice(0, 3).map((foto, index) => (
              <img
                key={index}
                src={foto}
                alt={`${salon.nombre} ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Columna derecha - Información */}
      <div className="datos-salon-info">
        <div className="datos-salon-header">
          <h1>{salon.nombre}</h1>
          <div className="datos-rating-circle">
            {salon.promedioCalificacion || '0'}
          </div>
        </div>

        <div className="datos-salon-location">
          <LuMapPin />
          <span>{salon.direccion}</span>
        </div>

        <div className="datos-salon-capacity">
          <FiUsers />
          <span>Para {salon.capacidad || 'N/A'} Personas</span>
        </div>

        <div className="datos-connect-business">
          <FiShoppingCart />
          <span>Connect Business Rooms</span>
        </div>

        <div className="datos-divider"></div>

        {/* Equipamientos */}
        {salon.equipamientos?.length > 0 && (
          <div className="datos-equipamientos-section">
            <div className="datos-equipamientos-list">
              {salon.equipamientos.map((eq, index) => (
                <span key={index} className="datos-equipamiento-item">{eq}</span>
              ))}
            </div>
          </div>
        )}

        {/* Reglas */}
        {salon.reglas?.length > 0 && (
          <div className="datos-reglas-section">
            <div className="datos-reglas-list">
              {salon.reglas.map((regla, index) => (
                <span key={index} className="datos-regla-item">{regla}</span>
              ))}
            </div>
          </div>
        )}

        <div className="datos-divider"></div>

        {/* Precio y acciones */}
        <div className="datos-salon-actions">
          <div className="datos-price-info">
            <span className="datos-price">${salon.precio_por_hora?.toLocaleString() || '0'}</span>
            <span className="datos-per-hour">por hora</span>
          </div>

          {!esDueno ? (
            <div className="datos-action-buttons">
              <BotonFavoritos 
                id_salon={salon.id_salon}
                showText={false}
                isIconOnly={false}
                customClass="favorito-cuadrado" // Nueva prop para identificar el estilo
              />
              <div 
                className="datos-reserve-btn"
                onClick={onReservar}
              >
                Reservar
              </div>
            </div>
          ) : (
            <div 
              className="datos-reserve-btn"
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