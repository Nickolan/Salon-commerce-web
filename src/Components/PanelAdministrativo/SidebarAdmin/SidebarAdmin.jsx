import React from 'react';
import './SidebarAdmin.css';

// Puedes reemplazar estos strings con íconos reales de una librería como react-icons
const IconUsuario = () => '👤';
const IconCasa = () => '🏠';
const IconCandado = () => '🔒';
const IconDinero = () => '💰';

const SidebarAdmin = ({ activePanel, setActivePanel }) => {
  const menuItems = [
    { name: 'Usuarios', icon: <IconUsuario /> },
    { name: 'Salones', icon: <IconCasa /> },
    { name: 'Reservas', icon: <IconCandado /> },
    { name: 'Ingresos', icon: <IconDinero /> },
  ];

  return (
    <div className="sidebar">
      <h1 className="sidebar-title">Administrador</h1>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`sidebar-item ${activePanel === item.name ? 'active' : ''}`}
            onClick={() => setActivePanel(item.name)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarAdmin;