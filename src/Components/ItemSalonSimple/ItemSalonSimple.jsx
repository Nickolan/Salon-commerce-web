import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import BotonFavoritos from "../BotonFavoritos/BotonFavoritos";
import "./ItemSalonSimple.css";

const ItemSalonSimple = ({ id_salon, nombre, precio, imagen, promedioResenias = 0, direccion = '' }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/salon/${id_salon}`);
  };

  // Extraer provincia/zona de la dirección (opcional)
  const extraerZona = (direccionCompleta) => {
    if (!direccionCompleta) return '';
    // Intenta obtener la última parte después de la última coma
    const partes = direccionCompleta.split(',');
    return partes.length > 1 ? partes[partes.length - 1].trim() : '';
  };

  const zona = extraerZona(direccion);

  return (
    <div className="salon-card" onClick={handleCardClick} role="button" tabIndex="0">
      <div className="salon-card-imagen-wrapper">
        <img 
          src={imagen || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqEx41lmw6yMNksFVU2dPXYqdciHh9CaGlw&s"} 
          alt={nombre} 
          className="salon-card-img" 
        />
        <BotonFavoritos id_salon={id_salon} isIconOnly={true} />
      </div>

      <div className="salon-card-info">
        <p className="salon-card-nombre">{nombre}</p>
        {zona && <p className="salon-card-zona">{zona}</p>}
        <p className="salon-card-precio">
          <span className="precio-valor">${precio}</span> / hora
        </p>
      </div>

      {/* Rating en la esquina inferior derecha */}
      {promedioResenias > 0 && (
        <div className="salon-card-rating-bottom">
          <FaStar className="rating-star" />
          <span>{promedioResenias.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
};

export default ItemSalonSimple;