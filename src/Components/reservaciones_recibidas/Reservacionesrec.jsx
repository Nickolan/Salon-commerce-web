import React, { Fragment, useState } from "react";
import {
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import  "./reservacionesrec.css"
import reservasData from "../../utils/Reservas.json";
import { AiOutlineDownCircle } from 'react-icons/ai';
import { AiOutlineUpCircle } from 'react-icons/ai';

function Reservacionesrec() {
const [visibleCount, setVisibleCount] = useState(3);
const expandirse = ()=>{
setVisibleCount(reservasData.length);
};
const reducir =()=>{
setVisibleCount(3);
};

  return (
    <Fragment>
        <div> 
            <h2 className="mt-5 pt-5 titulo" >Reservaciones recibidas</h2>
            <div className="container mt-4">
              <div className="table-responsive">
              <table className=" table text-center tabla1">
                  <thead className="nombres_de_filas">
                    <tr>
                      <th>Cliente</th>
                      <th>Salón</th>
                      <th>Fecha</th>
                      <th>Desde</th>
                      <th>Hasta</th>
                      <th>Estado</th>
                      <th>Nro. Reserva</th>
                    </tr>
                  </thead>
                  </table>
                <table className=" table text-center tabla1">
                  <tbody>
                    {reservasData.slice(0,visibleCount).map((reserva, index ) => (
                   <tr key={index}>
                    <td> {reserva.cliente} </td>
                    <td>{reserva.id_salon}</td>
                    <td>{reserva.fecha_reserva}</td>
                    <td>{reserva.hora_inicio}</td>
                    <td>{reserva.hora_fin}</td>
                    <td>{reserva.estado_reserva}</td>
                    <td>{reserva.id_reserva}</td>
                  </tr>
                  ))}
                  
                  </tbody>
                </table>
                </div>
            </div>
 
           <div className="text-center botones_expansion">
            {visibleCount < reservasData.length ? (
              <button  onClick={expandirse}><AiOutlineDownCircle className="fs-1" /></button>
            ) : (
             <button onClick={reducir}>
              <AiOutlineUpCircle className="fs-1 " /> 
             </button>
            )}
           </div>
        </div>
    </Fragment>
  );
}

export default Reservacionesrec;