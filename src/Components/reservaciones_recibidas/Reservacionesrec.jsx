import React, { useState, Fragment } from "react";
import { AiOutlineDownCircle, AiOutlineUpCircle } from "react-icons/ai";
import reservasData from "../../utils/Reservas.json";
import "./reservacionesrec.css";

function Reservacionesrec() {
  const [visibleCount, setVisibleCount] = useState(3);

  const expandirse = () => setVisibleCount(reservasData.length);
  const reducir = () => setVisibleCount(3);

  return (
    <Fragment>
      <div className="reservaciones-container">
        <h2 className="titulo">Reservaciones Recibidas</h2>

        <div className="tabla-contenedor">
          <div className="table-responsive">
            <table className="table tabla1 text-center">
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
              <tbody>
                {reservasData.slice(0, visibleCount).map((reserva, index) => (
                  <tr key={index}>
                    <td>{reserva.cliente}</td>
                    <td>{reserva.id_salon}</td>
                    <td>{reserva.fecha_reserva}</td>
                    <td>{reserva.hora_inicio}</td>
                    <td>{reserva.hora_fin}</td>
                    <td>
                      <span
                        className={`estado ${
                          reserva.estado_reserva.toLowerCase() === "confirmada"
                            ? "confirmada"
                            : reserva.estado_reserva.toLowerCase() ===
                              "pendiente"
                            ? "pendiente"
                            : "cancelada"
                        }`}
                      >
                        {reserva.estado_reserva}
                      </span>
                    </td>
                    <td>{reserva.id_reserva}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="botones_expansion text-center">
          {visibleCount < reservasData.length ? (
            <button onClick={expandirse} className="btn-expansion">
              <AiOutlineDownCircle className="icono" />
              <span>Ver más</span>
            </button>
          ) : (
            <button onClick={reducir} className="btn-expansion">
              <AiOutlineUpCircle className="icono" />
              <span>Ver menos</span>
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default Reservacionesrec;