import React from 'react';
import './SidebarAdmin.css';
// 1. Importamos los íconos que vamos a usar
import { FiUsers, FiHome, FiCalendar, FiDollarSign } from 'react-icons/fi';

const SidebarAdmin = ({ activePanel, setActivePanel }) => {
  // 2. Usamos los componentes de los íconos directamente en el array
  const menuItems = [
    { name: 'Usuarios', icon: <FiUsers /> },
    { name: 'Salones', icon: <FiHome /> },
    { name: 'Reservas', icon: <FiCalendar /> },
    { name: 'Ingresos', icon: <FiDollarSign /> },
  ];

  return (
    <div className="adminSidebar">
      <h1 className="sidebar-title">Administrador</h1>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`sidebar-item ${activePanel === item.name ? 'active' : ''}`}
            onClick={() => setActivePanel(item.name)}
          >
            {/* El span ahora envuelve al componente del ícono */}
            <span className="sidebar-icon">{item.icon}</span>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarAdmin;