import React from 'react';
import './BloquearButton.css';

const BloquearButton = ({ type, id, onBlock }) => {
  const handleClick = () => {
    // En una aplicación real, aquí llamarías a una API.
    // Por ahora, solo mostramos una alerta.
    alert(`El ${type} con ID ${id} ha sido bloqueado (simulación).`);
    if (onBlock) {
      onBlock(id);
    }
  };

  return (
    <button className="bloquear-button" onClick={handleClick}>
      Bloquear {type}
    </button>
  );
};

export default BloquearButton;