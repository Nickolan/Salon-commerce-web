import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ItemSalonDetallado.css"
import { FaMap } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';
import BotonFavoritos from "../BotonFavoritos/BotonFavoritos";

function ItemSalonDetallado({salon}) {
 const navigate = useNavigate();
 
  const handleClick = () => {
  navigate(`/salon/${salon.id_salon}`);
};

console.log("Salon", salon);

const calificacionTexto = (puntaje) => {
  if (puntaje >= 4.5) return "Excelente";
  if (puntaje >= 3.5) return "Muy bien";
  if (puntaje >= 2.5) return "Mediana";
  return "Mala";
};
  return ( 
    <Fragment>
     <div className="caja" onClick={handleClick} style={{ cursor: "pointer" }}>
        <div className="imagen-wrapper">
          <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqEx41lmw6yMNksFVU2dPXYqdciHh9CaGlw&s"} alt={salon.nombre} className="imagen_salon" />
          <BotonFavoritos id_salon={salon.id_salon}/> 
        </div>
  
      <div className="info_principal">
        <h3 className="titulo">{salon.nombre}</h3>
         <p><FaMap /> {salon.direccion}</p>
         <p><FaUserGroup /> {salon.capacidad} personas de capacidad</p>
      </div>
      <div className="info_extra">
       <div className="calificacion">
        <span className="puntaje"> {salon.resenia} </span>
        <small>{calificacionTexto(salon.resenia)}</small>
      </div>
      <div className="precio">
        <span>{salon.precio_por_hora}$</span>
        <small>Precio por hora</small>
      </div>
      </div>
      
     </div>
    </Fragment>
  );
}

export default ItemSalonDetallado;