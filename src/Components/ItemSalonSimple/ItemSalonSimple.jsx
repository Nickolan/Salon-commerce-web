import React from 'react';
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import BotonFavoritos from "../BotonFavoritos/BotonFavoritos";
import "./ItemSalonSimple.css";

const ItemSalonSimple = ({ id_salon, nombre, precio, imagen, promedioResenias = 0 }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/salon/${id_salon}`);
  };

  return (
    <div className="salon-card" onClick={handleCardClick} role="button" tabIndex="0">
      <div className="salon-card-imagen-wrapper">
        <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqEx41lmw6yMNksFVU2dPXYqdciHh9CaGlw&s"} alt={nombre} className="salon-card-img" />
        {/* El botón de favoritos se posiciona sobre la imagen gracias al CSS */}
        <BotonFavoritos id_salon={id_salon} isIconOnly={true} />
      </div>

      <div className="salon-card-info">
        <p className="salon-card-nombre">{nombre}</p>
        <p className="salon-card-precio">
          <strong>${precio}</strong> / hora
        </p>
      </div>

      {/* Mostramos la calificación solo si es mayor a 0 */}
      {promedioResenias > 0 && (
        <div className="salon-card-rating">
          <FaStar />
          <span>{promedioResenias.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
};

export default ItemSalonSimple;