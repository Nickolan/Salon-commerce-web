import React from 'react'
import '../styles/HomeScreen.css'

import ItemSalonSimple from '../Components/ItemSalonSimple/ItemSalonSimple.jsx';
import Salones from '../utils/Salones.json';
import Reservas from '../utils/Reservas.json';
import Resenias from '../utils/Resenias.json';

const HomeScreen = () => {

  function name(params) {
    
  }
  return (
    <div className='screen-wrapper'>
      <h1>hola</h1>
      {Salones.map(salon => (
        <ItemSalonSimple 
          key={salon.id_salon}
          id_salon={salon.id_salon}
          nombre={salon.nombre}
          precio={salon.precio_por_hora}
          imagen={salon.fotos[0]}
          reservas={Reservas}
          resenias={Resenias}
        />
      ))}
    </div>
  )
}

export default HomeScreen
