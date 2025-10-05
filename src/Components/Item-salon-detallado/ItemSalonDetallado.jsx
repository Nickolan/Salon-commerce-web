import React, { Fragment, useState } from "react";
import "./ItemSalonDetallado.css"
import { FaMap } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';
import BotonFavoritos from "../BotonFavoritos/BotonFavoritos";

function ItemSalonDetallado({salon}) {
 
  return ( 
    <Fragment>
     <div className="caja">
        <div className="imagen-wrapper">
          <img src={salon.imagen} alt={salon.nombre} className="imagen_salon" />
          <BotonFavoritos id_salon={salon.id_salon}/> 
        </div>
  
      <div className="info_principal">
        <h3 className="titulo">{salon.nombre}</h3>
         <p><FaMap /> {salon.ubicacion}</p>
         <p><FaUserGroup /> {salon.capacidad}</p>
         <p><FaShoppingCart /> Id del publicador: {salon.id_publicador}</p>
      </div>
      <div className="info_extra">
       <div className="calificacion">
        <span className="puntaje"> {salon.resenia} </span>
        <small>Calificacion</small>
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