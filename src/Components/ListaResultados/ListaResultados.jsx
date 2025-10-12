import React, { Fragment, use, useState } from "react";
import './ListaResultados.css';
import ItemSalonDetallado from "../Item-salon-detallado/ItemSalonDetallado";

const ListaResultados = ({ salones = [], loading = false, onSelect }) => {
   if (loading) {
    return (
      <div className="caja_listaresultados">
        <p className="lr-loading">Cargando resultados…</p>
      </div>
    );
  }
  if (!salones || salones.length==0){
    return(
     <div className="caja_listaresultados">
      <p>No se encontraron salones.</p>
     </div>
    );
  }
  return (
    <Fragment>
        <div className="caja_listaresultados">
         {salones.map((salon) => (
           <div key={salon.id_salon} className="lr-item-wrapper">
           <ItemSalonDetallado salon={salon} />
           </div>
))}
          
        </div>
      

    </Fragment>
  );
};

export default ListaResultados;