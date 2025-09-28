import React from "react";
import "./Resumen.css";

const Resumen = ({ formData, reglas, equipamientoSeleccionado, photos, disponibilidad }) => {
  return (
    <div className="resumen-container">
      {/* Título */}
      <h2>{formData.nombre || "Nombre del salón"}</h2>

      {/* Descripción */}
      <p className="descripcion">{formData.descripcion || "Sin descripción"}</p>

      {/* Dirección */}
      <div className="dato">
        <span className="icon">📍</span>
        <span>{formData.direccion || "Dirección no especificada"}</span>
      </div>

      {/* Precio */}
      <div className="dato">
        <span className="icon">💲</span>
        <span>
          <strong>{formData.precio_por_hora || 0}</strong> x hora
        </span>
      </div>

      {/* Capacidad */}
      <div className="dato">
        <span className="icon">👥</span>
        <span>{formData.capacidad || 0} personas de capacidad</span>
      </div>

      {/* Reglas */}
      <h3>Reglas</h3>
      <div className="tags">
        {reglas.length > 0 ? (
          reglas.map((r, i) => (
            <span key={i} className="tag regla">
              {r}
            </span>
          ))
        ) : (
          <p className="empty">No se especificaron reglas</p>
        )}
      </div>

      {/* Equipamiento */}
      <h3>Equipamiento</h3>
      <div className="tags">
        {equipamientoSeleccionado.length > 0 ? (
          equipamientoSeleccionado.map((eq, i) => (
            <span key={i} className="tag equipamiento">
              {eq}
            </span>
          ))
        ) : (
          <p className="empty">No se especificó equipamiento</p>
        )}
      </div>

      {/* Fotos */}
      <h3>Fotos</h3>
      <div className="fotos-grid">
        {photos.length > 0 ? (
          photos.map((file, i) => {
            const url = typeof file === "string" ? file : URL.createObjectURL(file);
            return <img key={i} src={url} alt={`foto-${i}`} />;
          })
        ) : (
          <p className="empty">No se subieron fotos</p>
        )}
      </div>

      {/* Disponibilidad */}
      <h3>Disponibilidad</h3>
      <div className="disponibilidad-resumen">
        {disponibilidad.filter((d) => d.disponible).length > 0 ? (
          disponibilidad
            .filter((d) => d.disponible)
            .map((d, i) => (
              <p key={i}>
                <strong>{d.dia}:</strong> {d.desde} - {d.hasta}
              </p>
            ))
        ) : (
          <p className="empty">No se configuró disponibilidad</p>
        )}
      </div>
    </div>
  );
};

export default Resumen;
