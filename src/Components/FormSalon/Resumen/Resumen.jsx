import React from "react";
import "./Resumen.css";
import { FaRegMap } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GoPeople } from "react-icons/go";

const Resumen = ({
  formData, //
  reglas, //
  equipamientoSeleccionado, //
  photos, // Tipo: ({ url: string, ... } | File)[]
  disponibilidad, //
}) => {
  return (
    <div className="resumen-container"> {/* */}
      {/* Título */}
      <h2>{formData.nombre || "Nombre del salón"}</h2> {/* */}

      {/* Descripción */}
      <p className="descripcion">{formData.descripcion || "Sin descripción"}</p> {/* */}

      {/* Dirección */}
      <div className="dato"> {/* */}
        <FaRegMap /> {/* */}
        <span>{formData.direccion || "Dirección no especificada"}</span> {/* */}
      </div>

      {/* Precio */}
      <div className="dato"> {/* */}
        <MdOutlineAttachMoney /> {/* */}
        <span> {/* */}
          <strong>{formData.precio_por_hora || 0}</strong> x hora {/* */}
        </span> {/* */}
      </div>

      {/* Capacidad */}
      <div className="dato"> {/* */}
        <GoPeople /> {/* */}
        <span>{formData.capacidad || 0} personas de capacidad</span> {/* */}
      </div>

      <h3>Configuración de Reservas</h3> {/* */}
      <div className="dato"> {/* */}
        <span> {/* */}
          Duración de cada franja:{" "} {/* */}
          <strong>{formData.granularidad_minutos} minutos</strong> {/* */}
        </span> {/* */}
      </div>
      <div className="dato"> {/* */}
        <span> {/* */}
          Calendario generado con{" "} {/* */}
          <strong>{formData.horizonte_meses} meses</strong> de antelación {/* */}
        </span> {/* */}
      </div>

      {/* Reglas */}
      <h3>Reglas</h3> {/* */}
      <div className="tags"> {/* */}
        {reglas.length > 0 ? ( //
          reglas.map((r, i) => ( //
            <span key={i} className="tag regla"> {/* */}
              {r} {/* */}
            </span> //
          )) //
        ) : ( //
          <p className="empty">No se especificaron reglas</p> //
        )} {/* */}
      </div>

      {/* Equipamiento */}
      <h3>Equipamiento</h3> {/* */}
      <div className="tags"> {/* */}
        {equipamientoSeleccionado.length > 0 ? ( //
          equipamientoSeleccionado.map((eq, i) => ( //
            <span key={i} className="tag equipamiento"> {/* */}
              {eq} {/* */}
            </span> //
          )) //
        ) : ( //
          <p className="empty">No se especificó equipamiento</p> //
        )} {/* */}
      </div>

      {/* Fotos */}
      <h3>Fotos</h3> {/* */}
      <div className="fotos-grid"> {/* */}
        {photos.length > 0 ? ( //
          photos.map((fileOrObject, i) => { // Renombrar variable para claridad
            let imageUrl = null;
            let needsRevoke = false; // Flag para saber si necesitamos liberar memoria

            // --- 👇 LÓGICA CORREGIDA ---
            if (fileOrObject instanceof File) {
              // Si es un archivo nuevo (File), creamos una URL temporal
              imageUrl = URL.createObjectURL(fileOrObject);
              needsRevoke = true; // Marcar para liberar memoria después
            } else if (typeof fileOrObject === 'object' && fileOrObject !== null && typeof fileOrObject.url === 'string') {
              // Si es un objeto de foto existente, usamos su URL
              imageUrl = fileOrObject.url;
            } else {
              // Si no es ninguno de los esperados, podemos poner un placeholder o loggear un error
              console.warn("Elemento de foto inesperado:", fileOrObject);
              // imageUrl = 'URL_PLACEHOLDER'; // Opcional: poner una imagen por defecto
            }
            // --- FIN CORRECCIÓN ---

            // Renderizar la imagen solo si tenemos una URL válida
            return imageUrl ? (
              <img
                key={i}
                src={imageUrl}
                alt={`foto-${i}`}
                // Opcional: Liberar la memoria del ObjectURL cuando la imagen ya no se necesite
                onLoad={needsRevoke ? () => URL.revokeObjectURL(imageUrl) : undefined}
                onError={(e) => { e.target.style.display = 'none'; if(needsRevoke) URL.revokeObjectURL(imageUrl) }} // Ocultar si falla y revocar
              />
            ) : null; // No renderizar nada si no hay URL válida
          }) //
        ) : ( //
          <p className="empty">No se subieron fotos</p> //
        )} {/* */}
      </div>

      {/* Disponibilidad */}
      <h3>Disponibilidad</h3> {/* */}
      <div className="disponibilidad-resumen"> {/* */}
        {disponibilidad.filter((d) => d.disponible).length > 0 ? ( //
          disponibilidad //
            .filter((d) => d.disponible) //
            .map((d, i) => ( //
              <p key={i}> {/* */}
                <strong>{d.dia}:</strong> {d.desde} - {d.hasta} {/* */}
              </p> //
            )) //
        ) : ( //
          <p className="empty">No se configuró disponibilidad</p> //
        )} {/* */}
      </div>
    </div>
  );
};

export default Resumen;