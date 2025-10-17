import React, { useState, useEffect } from 'react';
import './Sidebarfiltros.css';

// Lista de equipamientos comunes (podría venir de la API en el futuro)
const EQUIPAMIENTOS_DISPONIBLES = [
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

// Opciones de ordenamiento
const ORDEN_OPCIONES = [
  { value: 'precio_asc', label: 'Precio: Menor a Mayor' },
  { value: 'precio_desc', label: 'Precio: Mayor a Menor' },
  { value: 'cercania', label: 'Más Cercanos' }, // Asumiendo que la API ordena por cercanía por defecto
  { value: 'mejor_valorados', label: 'Mejor Valorados' }, // A implementar a futuro
];

const Sidebarfiltros = ({ onFiltrosChange }) => {
  // Estados para cada filtro
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(10000); // Un valor máximo inicial alto
  const [capacidadMin, setCapacidadMin] = useState(1);
  const [equipamientosSeleccionados, setEquipamientosSeleccionados] = useState([]);
  const [orden, setOrden] = useState('cercania'); // Orden por defecto

  // Manejador para checkboxes de equipamiento
  const handleEquipamientoChange = (event) => {
    const { value, checked } = event.target;
    setEquipamientosSeleccionados(prev =>
      checked ? [...prev, value] : prev.filter(eq => eq !== value)
    );
  };

  // Función que se llama al aplicar filtros
  const aplicarFiltros = () => {
    onFiltrosChange({
      precioMin,
      precioMax,
      capacidadMin,
      equipamientos: equipamientosSeleccionados,
      orden,
    });
  };

  // Opcional: Llamar a aplicarFiltros automáticamente cuando cambian los valores
  // Esto puede ser útil si no quieres un botón "Aplicar" explícito
  useEffect(() => {
    // Podrías agregar un debounce aquí si prefieres no aplicar en cada cambio
    aplicarFiltros();
  }, [precioMin, precioMax, capacidadMin, equipamientosSeleccionados, orden]);


  return (
    <div className="sidebar-filtros">
      <h4>Filtrar Resultados</h4>

      {/* Filtro por Precio */}
      <div className="filtro-grupo">
        <label htmlFor="precioMin">Precio por Hora</label>
        <div className="precio-inputs">
          <input
            type="number"
            id="precioMin"
            value={precioMin}
            onChange={(e) => setPrecioMin(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            placeholder="Mín"
          />
          <span>-</span>
          <input
            type="number"
            id="precioMax"
            value={precioMax}
            onChange={(e) => setPrecioMax(Math.max(precioMin + 1, parseInt(e.target.value) || 0))} // Asegura que max > min
            min={precioMin + 1}
            placeholder="Máx"
          />
        </div>
      </div>

      {/* Filtro por Capacidad */}
      <div className="filtro-grupo">
        <label htmlFor="capacidadMin">Capacidad Mínima</label>
        <input
          type="number"
          id="capacidadMin"
          value={capacidadMin}
          onChange={(e) => setCapacidadMin(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
          placeholder="Ej: 5"
        />
      </div>

      {/* Filtro por Equipamientos */}
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

      {/* Ordenar por */}
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

      {/* Botón Aplicar (Opcional, si quitas el useEffect) */}
      {/*
      <button className="boton-aplicar-filtros" onClick={aplicarFiltros}>
        Aplicar Filtros
      </button>
      */}
    </div>
  );
};

export default Sidebarfiltros;