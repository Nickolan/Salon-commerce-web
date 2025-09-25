import React, { Fragment, useState } from "react";
import {
  Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import  "./reservacionesrec.css"
import { AiOutlineDownCircle } from 'react-icons/ai';

function Reservacionesrec() {


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
                   <tr>
                    <td> Lautaro Ferreria </td>
                    <td>Check and Home-Study Room</td>
                    <td>03/09/2025</td>
                    <td>08:00</td>
                    <td>11:00</td>
                    <td>Reservado</td>
                    <td>123</td>
                  </tr>
                   <tr>
                    <td> Lautaro Ferreria </td>
                    <td>Check and Home-Study Room</td>
                    <td>03/09/2025</td>
                    <td>08:00</td>
                    <td>11:00</td>
                    <td>Confirmado</td>
                    <td>125</td>
                  </tr>
                   <tr>
                    <td> Lautaro Ferreria </td>
                    <td>Check and Home-Study Room</td>
                    <td>03/09/2025</td>
                    <td>08:00</td>
                    <td>11:00</td>
                    <td>Reservado</td>
                    <td>128</td>
                   </tr>
                  </tbody>
                </table>
                </div>
            </div>

           <div className="text-center ">
            <button><AiOutlineDownCircle className="fs-1" /></button>
           </div>
        </div>
    </Fragment>
  );
}

export default Reservacionesrec;