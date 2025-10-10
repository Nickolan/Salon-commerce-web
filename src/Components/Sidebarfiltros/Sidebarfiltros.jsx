import React, { Fragment, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaStar } from "react-icons/fa";
import RatingSelector from "../RatingSelector/RatingSelector";
import "./Sidebarfiltros.css";


function Sidebarfiltros({ onFilterChange }) {
    const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [fecha, setFecha] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [puntaje, setPuntaje] = useState("");
  const [equipamiento, setEquipamiento] = useState([]);
  const handleEquipamiento = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEquipamiento([...equipamiento, value]);
    } else {
      setEquipamiento(equipamiento.filter((item) => item !== value));
    }
  };
   const handlePuntajeChange = (newVal) => {
    setPuntaje(newVal);
    
  };
 const aplicarFiltros = () => {
  onFilterChange({
    precioMin,
    precioMax,
    fecha,
    inicio,
    fin,
    puntaje,
    equipamiento,
  });
};
  return (
    <Fragment>
        <div className="caja_sidebarfiltros">
            <h2 className="h2titulo">Filtros</h2>
            <div > 
                <h4 className="h4subtitulos">Precio</h4>
                <div className="precio-wrapper">
  <input className="preciominimo"type="number"
              placeholder="Mínimo"
              value={precioMin}
              onChange={(e)=>setPrecioMin(e.target.value)}
              />
              <div>-</div>
              <input className="preciomaximo"type="number"
              placeholder="Máximo"
              value={precioMax}
              onChange={(e)=>setPrecioMax(e.target.value)}
              />
                </div>
            </div>
            <div>
                <h4 className="h4subtitulos">Disponibilidad</h4>
                <input className="input_fecha"type="date"
              placeholder="Fecha"
              value={fecha}
              onChange={(e)=>setFecha(e.target.value)}
              />
              <div className="horarios-wrapper ">
              <input className="input_inicio"type="time"
              placeholder="Inicio"
              value={inicio}
              onChange={(e)=>setInicio(e.target.value)}
              />
              <div>-</div>
              <input className="input_fin"type="time"
              placeholder="Fin"
              value={fin}
              onChange={(e)=>setFin(e.target.value)}
              />
              </div>
                 <aside>
      <h4 className="h4subtitulos">Puntaje</h4>
      <RatingSelector value={puntaje} onChange={handlePuntajeChange} size={20} />
      <p>Seleccionado: {puntaje} <FaStar/></p>
    </aside>
              </div>
              <div>
  <h4 className="h4subtitulos">Equipamiento</h4>
  <div>
    <label>
      <input
        type="checkbox"
        value="wifi"
        onChange={(e) => handleEquipamiento(e)}
      />
      WiFi
    </label>
  </div>

  <div>
    <label>
      <input
        type="checkbox"
        value="proyector"
        onChange={(e) => handleEquipamiento(e)}
      />
      Proyector
    </label>
  </div>

  <div>
    <label>
      <input
        type="checkbox"
        value="aire acondicionado"
        onChange={(e) => handleEquipamiento(e)}
      />
      Aire acondicionado
    </label>
  </div>

  <div>
    <label>
      <input
        type="checkbox"
        value="tv"
        onChange={(e) => handleEquipamiento(e)}
      />
      TV
    </label>
  </div>

  <div>
    <label>
      <input
        type="checkbox"
        value="calefacción"
        onChange={(e) => handleEquipamiento(e)}
      />
      Calefacción
    </label>
  </div>

  <div>
    <label>
      <input
        type="checkbox"
        value="pizarron"
        onChange={(e) => handleEquipamiento(e)}
      />
      Pizarrón
    </label>
  </div>

  <div>
    <label>
      <input
        type="checkbox"
        value="aislamiento de ruido"
        onChange={(e) => handleEquipamiento(e)}
      />
      Aislamiento de ruido
    </label>
  </div>

  <div>
    <label>
      <input
        type="checkbox"
        value="vajilla"
        onChange={(e) => handleEquipamiento(e)}
      />
      Vajilla
    </label>
  </div>
</div>
<button className="boton_aplicar" onClick={aplicarFiltros}>Aplicar filtros</button>
              
            

        </div>
    </Fragment>
  );
}
export default Sidebarfiltros;