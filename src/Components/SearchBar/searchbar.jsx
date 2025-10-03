import React, { Fragment, use, useState } from "react";
import "./searchbar.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaLocationDot } from 'react-icons/fa6';
import { BsFillPersonFill } from 'react-icons/bs';

function Searchbar() {
  const [ubicacion,setUbicacion]=useState("");
  const [lugares, setLugares] = useState([]); //lista de lugares
  const [personas,setPersonas]=useState("1");
  const Buscar= ()=>{   
    if (!ubicacion.trim()){
      alert("Ingrese una ubicacion");
      return;
    }
    if (!personas.trim() || personas<1 ){
      alert("Ingrese una cantidad mínima de personas");
      return;
    }
    onBuscar(ubicacion, parseInt(personas));
  }

  const onBuscar = (ubicacion, personasMin) => {
    if (!ubicacion.trim()) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: ubicacion }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const { lat, lng } = results[0].geometry.location;


        const resultados = salonesData.filter(salon => {
          const distancia = calcularDistanciaKm(lat, lng, salon.lat, salon.lng);
          return distancia <= 5 && salon.capacidad >= personasMin;
        });


        if (resultados.length === 0) {
          alert('No se encontraron salones cercanos en esa ubicación.');
        }

        setLugares(resultados);
      } else {
        alert('No se pudo encontrar la ubicación.');
      }
    });
  };
  
  
  function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  return (
    <Fragment>
        <div className="search-bar-wrapper"> 
          <div className="barras_searchbar">
            <FaLocationDot/>
             <input className=" "type="text"
              placeholder="¿Dónde?"
              value={ubicacion}
              onChange={(e)=>setUbicacion(e.target.value)}
              />
          </div>
             <div className="barras_searchbar">
             <BsFillPersonFill/>
            <input className="  "type="number"
              placeholder="¿Cuántos son?"
              value={personas}
              onChange={(e)=>setPersonas(e.target.value)}
              />
              </div> 
              <div className="barra_buscar">
                 <button className="boton_buscar" onClick={Buscar}>
                Buscar
              </button>
              </div>
             
            
       </div>
    </Fragment>
  );
}

export default Searchbar;