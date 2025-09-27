import React, { Fragment, use, useState } from "react";
import "./searchbar.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaLocationDot } from 'react-icons/fa6';
import { BsFillPersonFill } from 'react-icons/bs';
function Searchbar() {
  const [ubicacion,setUbicacion]=useState("");
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
    alert(`Buscando en: ${ubicacion} para un mínimo de ${personas} personas`);
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