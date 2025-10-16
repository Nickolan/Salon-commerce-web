import React, { Fragment, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Searchbar from "../Components/SearchBar/searchbar";
import Sidebarfiltros from "../Components/Sidebarfiltros/Sidebarfiltros";
import ListaResultados from "../Components/ListaResultados/ListaResultados";
import salonesData from "../utils/Salones.json";
import "../styles/ResultadosScreen.css";

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const ResultadosScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
 const { ubicacion, personas, lat, lng } = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);

    let u = queryParams.get("ubicacion") || "";
    let p = parseInt(queryParams.get("personas")) || 1;
    let la = parseFloat(queryParams.get("lat"));
    let ln = parseFloat(queryParams.get("lng"));

    if ((isNaN(la) || isNaN(ln)) && u.includes(",")) {
      [la, ln] = u.split(",").map(parseFloat);
    }

    return { ubicacion: u, personas: p, lat: la, lng: ln };
  }, [location.search]);
  const [filtros, setFiltros] = useState({
    precioMin: "",
    precioMax: "",
    puntaje: "",
    equipamiento: []
  });
  

  const handleFilterChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };
  const horaAminutos = (horaStr) => {
  if (!horaStr || typeof horaStr !== "string" || !horaStr.includes(":")) {
    return 0;
  }
  const [h, m] = horaStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

  const salonesCercanos = useMemo(() => {
    if (isNaN(lat) || isNaN(lng)) return salonesData;

   return salonesData.filter(s => {
  if (!s.latitud || !s.longitud) return false;
  const distancia = calcularDistanciaKm(lat, lng, s.latitud, s.longitud);
  return distancia <= 5 && s.capacidad >= personas;
});
  }, [lat, lng, personas]);

const salonesFiltradosFinal = useMemo(() => {
  return salonesCercanos.filter(s => {
    // Precio
    if (filtros.precioMin && s.precio_por_hora < filtros.precioMin) return false;
    if (filtros.precioMax && s.precio_por_hora > filtros.precioMax) return false;

    // Estrellas
    if (filtros.puntaje && s.resenia < Number(filtros.puntaje)) return false;

    // Equipamiento
    const equipamientosSalon = s.equipamientos || Object.keys(s.equipamientos_json || {}).filter(k => s.equipamientos_json[k]);
if (filtros.equipamiento.length > 0 &&
    !filtros.equipamiento.every(eq => equipamientosSalon.includes(eq))) return false;

    // Horas (solo minutos)
    const inicioSalon = horaAminutos(s.disponibilidad_inicio);
    const finSalon = horaAminutos(s.disponibilidad_fin);

    if (filtros.inicio) {
      const inicioFiltro = horaAminutos(filtros.inicio);
      if (inicioFiltro < inicioSalon) return false;
    }

    if (filtros.fin) {
      const finFiltro = horaAminutos(filtros.fin);
      if (finFiltro > finSalon) return false;
    }
 // Fecha
    if (filtros.fecha) {
      const fechaFiltro = new Date(filtros.fecha);
      if (s.fecha) {
        const fechaSalon = new Date(s.fecha);
        if (fechaFiltro < fechaSalon || fechaFiltro > fechaSalon) return false;
      }
    }

    return true;
  });
}, [salonesCercanos, filtros]);

  return (
    <Fragment>
      <div className="resultados_principal">
        <div className="div_sidebarfiltros">
          <Sidebarfiltros onFilterChange={handleFilterChange} />
        </div>
        <div className="div_contenido">
          <Searchbar key={`${ubicacion}-${personas}`} ubicacionInicial={ubicacion} personasInicial={personas.toString()} />
          <ListaResultados salones={salonesFiltradosFinal} />
        </div>
      </div>
    </Fragment>
  );
};

export default ResultadosScreen;