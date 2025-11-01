// src/Components/Sidebarfiltros/Sidebarfiltros.jsx

import React, { useState, useEffect } from 'react';
import './Sidebarfiltros.css';

// (Lista de equipamientos sin cambios)
const EQUIPAMIENTOS_DISPONIBLES = [
  "WiFi", "Pizarra", "Proyector", "Pantalla TV", "Aire Acondicionado",
  "Calefacción", "Enchufes múltiples", "Mesas Grupales", "Sillas Ergonómicas",
  "Cafetera", "Dispensador de Agua", "Baño Privado", "Acceso Silla Ruedas",
  "Estacionamiento", "Pizarra blanca", "Iluminación LED", "Marcadores", "Sistema de sonido",
];

// (Opciones de ordenamiento sin cambios)
const ORDEN_OPCIONES = [
  { value: 'precio_asc', label: 'Precio: Menor a Mayor' },
  { value: 'precio_desc', label: 'Precio: Mayor a Menor' },
  { value: 'cercania', label: 'Más Cercanos' },
  { value: 'mejor_valorados', label: 'Mejor Valorados' },
];

// --- 👇 1. AÑADIMOS onAplicar COMO PROP ---
const Sidebarfiltros = ({ onFiltrosChange, onAplicar }) => {
  
  // --- 👇 2. CAMBIAMOS ESTADOS NUMÉRICOS A STRINGS ---
  // Esto soluciona el problema de los inputs numéricos en móvil.
  // El usuario podrá borrar el campo sin que se resetee a 0.
  const [precioMin, setPrecioMin] = useState("0");
  const [precioMax, setPrecioMax] = useState(""); // String vacío para "sin límite"
  const [capacidadMin, setCapacidadMin] = useState("1");
  // --- (Otros estados sin cambios) ---
  const [equipamientosSeleccionados, setEquipamientosSeleccionados] = useState([]);
  const [orden, setOrden] = useState('cercania');

  // --- 👇 3. HELPER PARA VALIDAR INPUTS NUMÉRICOS ---
  // Esta función solo permite dígitos o un string vacío.
  const handleNumericChange = (setter, value) => {
    if (/^\d*$/.test(value)) { // Regex: permite solo dígitos (0-9)
      setter(value);
    }
  };

  // (Manejador de equipamiento sin cambios)
  const handleEquipamientoChange = (event) => {
    const { value, checked } = event.target;
    setEquipamientosSeleccionados(prev =>
      checked ? [...prev, value] : prev.filter(eq => eq !== value)
    );
  };

  // --- 👇 4. ELIMINAMOS EL useEffect QUE LLAMABA A aplicarFiltros ---
  // useEffect(() => {
  //   aplicarFiltros();
  // }, [precioMin, precioMax, capacidadMin, equipamientosSeleccionados, orden]);
  // --- (FIN DE LA ELIMINACIÓN) ---


  // --- 👇 5. MODIFICAMOS LA FUNCIÓN PARA QUE SE LLAME AL HACER CLIC EN EL BOTÓN ---
  // Parseamos los números aquí, justo antes de enviarlos.
  const handleAplicarClick = () => {
    
    // Convertimos los strings a números, con valores por defecto
    const pMin = parseInt(precioMin) || 0;
    const pMax = parseInt(precioMax) || Infinity; // Si está vacío, es Infinito
    const cMin = parseInt(capacidadMin) || 1; // Si está vacío, es 1

    onFiltrosChange({
      precioMin: pMin,
      precioMax: (pMax === 0 || pMax < pMin) ? Infinity : pMax, // Lógica para max
      capacidadMin: cMin < 1 ? 1 : cMin, // Asegurar mínimo de 1
      equipamientos: equipamientosSeleccionados,
      orden,
    });

    // Llamamos a la función del padre para cerrar el sidebar
    if (onAplicar) {
      onAplicar();
    }
  };


  return (
    <div className="sidebar-filtros">
      <h4>Filtrar Resultados</h4>

      {/* Filtro por Precio */}
      <div className="filtro-grupo">
        <label htmlFor="precioMin">Precio por Hora</label>
        <div className="precio-inputs">
          <input
            type="tel" // Usar "tel" en lugar de "number" para mejor compatibilidad móvil
            inputMode="numeric" // Muestra el teclado numérico
            id="precioMin"
            value={precioMin}
            // --- 👇 6. USAMOS EL NUEVO HANDLER ---
            onChange={(e) => handleNumericChange(setPrecioMin, e.target.value)}
            placeholder="Mín"
          />
          <span>-</span>
          <input
            type="tel" // Usar "tel"
            inputMode="numeric" // Muestra el teclado numérico
            id="precioMax"
            value={precioMax}
            // --- 👇 6. USAMOS EL NUEVO HANDLER ---
            onChange={(e) => handleNumericChange(setPrecioMax, e.target.value)}
            placeholder="Máx"
          />
        </div>
      </div>

      {/* Filtro por Capacidad */}
      <div className="filtro-grupo">
        <label htmlFor="capacidadMin">Capacidad Mínima</label>
        <input
          type="tel" // Usar "tel"
          inputMode="numeric" // Muestra el teclado numérico
          id="capacidadMin"
          value={capacidadMin}
          // --- 👇 6. USAMOS EL NUEVO HANDLER ---
          onChange={(e) => handleNumericChange(setCapacidadMin, e.target.value)}
          placeholder="Ej: 5"
        />
      </div>

      {/* Filtro por Equipamientos (Sin cambios) */}
      <div className="filtro-grupo">
        <label>Equipamientos</label>
        <div className="equipamientos-checkboxes">
          {EQUIPAMIENTOS_DISPONIBLES.map(eq => (
            <div key={eq}>
              <input
                type="checkbox"
                id={`eq-${eq}`}
                value={eq}
                checked={equipamientosSeleccionados.includes(eq)}
                onChange={handleEquipamientoChange}
              />
              <label htmlFor={`eq-${eq}`}>{eq}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Ordenar por (Sin cambios) */}
      <div className="filtro-grupo">
        <label htmlFor="orden">Ordenar por</label>
        <select
          id="orden"
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
        >
          {ORDEN_OPCIONES.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>

      {/* --- 👇 7. DESCOMENTAMOS Y ACTIVAMOS EL BOTÓN "APLICAR" --- */}
      <button className="boton-aplicar-filtros" onClick={handleAplicarClick}>
        Aplicar Filtros
      </button>
    </div>
  );
};

export default Sidebarfiltros;