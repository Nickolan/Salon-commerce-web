import React from "react";
import "./Disponibilidad.css";

const horas = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, "0")}:00`
);

export default function Disponibilidad({ disponibilidad, setDisponibilidad }) {
  const toggleDisponible = (index) => {
    const copia = [...disponibilidad];
    copia[index].disponible = !copia[index].disponible;
    setDisponibilidad(copia);
  };

  const cambiarHora = (index, campo, valor) => {
    const copia = [...disponibilidad];
    copia[index][campo] = valor;
    setDisponibilidad(copia);
  };

  return (
    <div className="disponibilidad-container">
      <table>
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
                  {horas.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  disabled={!item.disponible}
                  value={item.hasta}
                  onChange={(e) => cambiarHora(i, "hasta", e.target.value)}
                >
                  {horas.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
