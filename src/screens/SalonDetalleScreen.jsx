import React, { Fragment, useMemo } from "react";
import { useParams } from "react-router-dom";
import salonesData from "../utils/Salones.json";

function SalonDetalleScreen() {
    const { id } = useParams();

  const salon = useMemo(
    () => salonesData.find(s => s.id_salon.toString() === id),
    [id]
  );

  if (!salon) return <p>Salón no encontrado</p>;

  return (
    <Fragment>
      <div className="detalle_salon">
        <h1>{salon.nombre}</h1>
        <img src={salon.imagen} alt={salon.nombre} className="imagen_detalle" />
        <p>Ubicación: {salon.ubicacion}</p>
        <p>Capacidad: {salon.capacidad} personas</p>
        <p>Precio por hora: {salon.precio_por_hora}$</p>
        <p>Reseña: {salon.resenia}</p>
        <p>Descripción: {salon.descripcion}</p>
        {/* puedes agregar fotos, equipamientos, reglas, etc */}
      </div>
    </Fragment>
  );
}

export default SalonDetalleScreen;