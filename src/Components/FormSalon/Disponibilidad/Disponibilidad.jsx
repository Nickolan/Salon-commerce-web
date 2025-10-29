import React from "react";
import "./Disponibilidad.css";

const horas = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, "0")}:00`
);

// ✅ Recibimos 'formData' y 'handleChange' del padre
export default function Disponibilidad({ disponibilidad, setDisponibilidad, formData, handleChange }) {
  const toggleDisponible = (index) => {
    console.log("toggleDispnible");

    console.log(index);
    
    
    const copia = [...disponibilidad];
    
    copia[index].disponible = !copia[index].disponible;
    console.log(copia);
    
    setDisponibilidad(copia);
  };

  const cambiarHora = (index, campo, valor) => {
    const copia = [...disponibilidad];
    copia[index][campo] = valor;

    console.log(copia);
    
    setDisponibilidad(copia);
  };

  return (
    <div className="disponibilidad-container">
      {/* --- 👇 SECCIÓN NUEVA --- */}
      <div className="configuracion-franjas">
        <div className="config-item">
          <label htmlFor="granularidad_minutos">Duración de cada reserva:</label>
          <select
            id="granularidad_minutos"
            name="granularidad_minutos"
            value={formData.granularidad_minutos}
            onChange={handleChange}
          >
            <option value={30}>30 minutos</option>
            <option value={60}>1 hora</option>
            <option value={90}>1 hora y 30 mins</option>
            <option value={120}>2 horas</option>
          </select>
        </div>
        <div className="config-item">
          <label htmlFor="horizonte_meses">Permitir reservas con:</label>
          <select
            id="horizonte_meses"
            name="horizonte_meses"
            value={formData.horizonte_meses}
            onChange={handleChange}
          >
            <option value={3}>3 meses de antelación</option>
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
          </select>
        </div>
      </div>
      {/* --- FIN SECCIÓN NUEVA --- */}

      <table>
        {/* El resto de la tabla sigue igual */}
        <thead>
          <tr>
            <th>Día</th>
            <th>Disp</th>
            <th>Desde</th>
            <th>Hasta</th>
          </tr>
        </thead>
        <tbody>
          {disponibilidad.map((item, i) => (
            <tr key={item.dia}>
              <td>{item.dia}</td>
              <td>
                <input
                  type="checkbox"
                  checked={item.disponible}
                  onChange={() => toggleDisponible(i)}
                />
              </td>
              <td>
                <select
                  disabled={!item.disponible}
                  value={item.desde}
                  onChange={(e) => cambiarHora(i, "desde", e.target.value)}
                >
                  {horas.map((hora) => (<option key={hora} value={hora}>{hora}</option>))}
                </select>
              </td>
              <td>
                <select
                  disabled={!item.disponible}
                  value={item.hasta}
                  onChange={(e) => cambiarHora(i, "hasta", e.target.value)}
                >
                  {horas.map((hora) => (<option key={hora} value={hora}>{hora}</option>))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}