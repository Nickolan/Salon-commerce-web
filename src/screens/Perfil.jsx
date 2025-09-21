import React from 'react'
import "../styles/Perfil.css";

const Perfil = () => {
  return (
    <div className='Profile-page'>
        <span className="nombre_de_usuario">
          Lautaro Joel Ferreria
        </span>
        <div className='Left-container'>
            <div>
                <h2>Información Personal
                    
                </h2>
            </div>
            <div>
                <h2>nombre
                    Lautaro Joel Ferreria
                </h2>
            </div>
            <div>
                <h2>
                    DNI 
                    46621231
                </h2>
            </div>
            <div>
                <h2>
                    Ciudad 
                    Luján de Cuyo
                </h2>
            </div>
            <div>
                <h2>
                    Provincia
                    Mendoza
                </h2>
            </div>
        </div>
        <div className='Right-container'>
            
        </div>
    </div>
  )
}

export default Perfil
