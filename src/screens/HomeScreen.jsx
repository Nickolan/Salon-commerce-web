import React from 'react';
import '../styles/HomeScreen.css';
import Salon1Logo from "../assets/img/Salon1-logo.png";

const HomeScreen = () => {
  return (
    <div className='screen-wrapper'>
      <div className='title'>
        <h1>¿Quiéres reservar un salón para ti?</h1>
        <h2>¡Encuentra los mejores salones para reservar aquí!</h2>
      </div>
      <div className='subtitulos'>
        <div className='logo-group'>
          <h3>Los mejores puntuados</h3>
          <div className='logos-row'>
            <img src={Salon1Logo} className='logo' alt="editar"/>
            <img src={Salon1Logo} className='logo' alt="editar"/>
            <img src={Salon1Logo} className='logo' alt="editar"/>
          </div>
        </div>
        <div className='logo-group'>
          <h3>Cerca de ti</h3>
          <div className='logos-row'>
            <img src={Salon1Logo} className='logo' alt="editar"/>
            <img src={Salon1Logo} className='logo' alt="editar"/>
            <img src={Salon1Logo} className='logo' alt="editar"/>
          </div>
        </div>
        <div className='logo-group'>
          <h3>Visto recientemente</h3>
          <div className='logos-row'>
            <img src={Salon1Logo} className='logo' alt="editar"/>
            <img src={Salon1Logo} className='logo' alt="editar"/>
            <img src={Salon1Logo} className='logo' alt="editar"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
