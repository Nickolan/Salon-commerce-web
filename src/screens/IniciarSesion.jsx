import React from 'react';
import './FormularioContacto.css';

function FormularioContacto() {
  return (
    <div className="form-container">
      <h1>Bienvenidos, Inicia sesión</h1>
      <form action="#" method="post">
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" required placeholder='Correo electronico'/>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required  placeholder='Contraseña'/>
        </div>
        <a href="http://">Olvidé mi contraseña</a>
        <button className='button-container' type="submit">Iniciar Sesión</button>
        <a href="/">No tengo una cuenta</a>
      </form>
    </div>
  );
}

export default FormularioContacto;
