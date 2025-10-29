import React, { useState } from "react";
import './EquipamientoYReglas.css'

const EquipamientoYReglas = ({ reglas, setReglas, equipamientoSeleccionado, setEquipamientoSeleccionado }) => {
  const [regla, setRegla] = useState("");

  // Lista fija de equipamientos
  const equipamientos = [
  "WiFi",
  "Pizarra",
  "Proyector",
  "Pantalla TV",
  "Aire Acondicionado",
  "Calefacción",
  "Enchufes múltiples",
  "Mesas Grupales",
  "Sillas Ergonómicas",
  "Cafetera",
  "Dispensador de Agua",
  "Baño Privado",
  "Acceso Silla Ruedas",
  "Estacionamiento",
  "Pizarra blanca",
  "Iluminación LED",
  "Marcadores",
  "Sistema de sonido",
];

  const handleInputChange = (e) => {
    setRegla(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (regla.trim() !== "") {
        setReglas([...reglas, regla.trim()]);
        setRegla("");
      }
    }
  };

  const removeRegla = (index) => {
    setReglas(reglas.filter((_, i) => i !== index));
  };

  const toggleEquipamiento = (item) => {
    if (equipamientoSeleccionado.includes(item)) {
      setEquipamientoSeleccionado(
        equipamientoSeleccionado.filter((eq) => eq !== item)
      );
    } else {
      setEquipamientoSeleccionado([...equipamientoSeleccionado, item]);
    }
  };

  return (
    <div className='form-zone'>

      {/* Reglas */}
      <div className='section-zone'>
        <h3>Reglas del salón</h3>
        <input
          type="text"
          placeholder="Escribe una regla y presiona Enter o ,"
          value={regla}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ padding: "8px" }}
        />
        <ul className="lista-reglas">
          {reglas.map((r, index) => (
            <li key={index}>
              <span className="texto-regla">{r}</span>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeRegla(index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Equipamiento */}
      <div className='section-zone'>
        <h3>Equipamiento disponible</h3>
        {equipamientos.map((item, index) => (
          <label key={index} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <input
              id="miCheckbox"
              type="checkbox"
              checked={equipamientoSeleccionado.includes(item)}
              onChange={() => toggleEquipamiento(item)}
            />
            {item}
          </label>
        ))}
      </div>

      {/* Debug: Arrays guardados */}
      {/* <div style={{ marginTop: "20px" }}>
        <h4>Resumen</h4>
        <p><b>Reglas:</b> {JSON.stringify(reglas)}</p>
        <p><b>Equipamiento seleccionado:</b> {JSON.stringify(equipamientoSeleccionado)}</p>
      </div> */}
    </div>
  );
};

export default EquipamientoYReglas;
