import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ItemSalonDetallado.css";
import { FaMap } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import {FiKey} from 'react-icons/fi';
import BotonFavoritos from "../BotonFavoritos/BotonFavoritos";
import { FaStar } from "react-icons/fa";
import axios from 'axios';

function ItemSalonDetallado({ salon }) {
  const navigate = useNavigate();
  const [promedioRating, setPromedioRating] = useState(0);
  const [loadingResenias, setLoadingResenias] = useState(false);

  useEffect(() => {
    const fetchResenias = async () => {
      if (!salon?.id_salon) return;
      
      setLoadingResenias(true);
      try {
        const response = await axios.get(`http://localhost:3000/resenias/salon/${salon.id_salon}`);
        const resenias = response.data;
        
        if (resenias && resenias.length > 0) {
          const suma = resenias.reduce((total, opinion) => total + opinion.calificacion, 0);
          const promedio = suma / resenias.length;
          setPromedioRating(Math.round(promedio * 10) / 10);
        } else {
          setPromedioRating(0);
        }
      } catch (error) {
        console.error("Error al cargar reseñas:", error);
        setPromedioRating(0);
      } finally {
        setLoadingResenias(false);
      }
    };

    fetchResenias();
  }, [salon?.id_salon]);

  const handleClick = () => {
    navigate(`/salon/${salon.id_salon}`);
  };

  const ratingFormateado = promedioRating > 0 ? promedioRating.toFixed(1) : "0";

  return (
    <div className="item-salon-detallado-card" onClick={handleClick} role="button" tabIndex={0}>
      {/* Imagen a la izquierda */}
      <div className="item-salon-detallado-imagen-wrapper">
        <img
          src={salon.fotos?.length > 0 ? salon.fotos[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqEx41lmw6yMNksFVU2dPXYqdciHh9CaGlw&s"}
          alt={salon.nombre || 'Salón'}
          className="item-salon-detallado-imagen"
        />
        {/* alwaysFilled=true porque esta página solo muestra salones ya guardados como favoritos */}
        <BotonFavoritos id_salon={salon.id_salon} isIconOnly={true} alwaysFilled={true} />
      </div>

      {/* Contenido a la derecha */}
      <div className="item-salon-detallado-contenido">

        {/* Bloque superior: nombre + rating */}
        <div className="item-salon-detallado-top">
          <div className="item-salon-detallado-header">
            <h3 className="item-salon-detallado-titulo">
              {salon.nombre || 'Nombre no disponible'}
            </h3>
            <div className="item-salon-detallado-rating">
              <FaStar className="item-salon-detallado-rating-icon" />
              <span className="item-salon-detallado-rating-number">{ratingFormateado}</span>
            </div>
          </div>
          <p className="item-salon-detallado-direccion">
            <FaMap className="item-salon-detallado-direccion-icon" />
            {salon.direccion || 'Dirección no disponible'}
          </p>
        </div>

        {/* Fila de capacidad */}
        <div className="item-salon-detallado-detalles-fila">
          <div className="item-salon-detallado-detalle">
            <FaUserGroup className="item-salon-detallado-icono" />
            <span className="item-salon-detallado-detalle-texto">
              {salon.capacidad_max || salon.capacidad || '?'} personas de capacidad máxima
            </span>
          </div>
        </div>

        {/* Fila de propietario */}
        <div className="item-salon-detallado-detalle">
          <FiKey className="item-salon-detallado-icono" />
          <span className="item-salon-detallado-propietario">
            Propietario: {salon.publicador?.nombre || 'Usuario'} {salon.publicador?.apellido || ''}
          </span>
        </div>

        {/* Precio por hora */}
        <div className="item-salon-detallado-footer">
          <div className="item-salon-detallado-precio-container">
            <span className="item-salon-detallado-precio">
              ${salon.precio_por_hora ? salon.precio_por_hora.toLocaleString('es-AR') : '-'}
            </span>
            <span className="item-salon-detallado-precio-label">por hora</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemSalonDetallado;