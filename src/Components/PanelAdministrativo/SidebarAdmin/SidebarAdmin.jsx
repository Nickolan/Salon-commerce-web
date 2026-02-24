import React from 'react';
import './SidebarAdmin.css';
import { FiUsers, FiHome, FiCalendar, FiDollarSign, FiMenu } from 'react-icons/fi';

const SidebarAdmin = ({ activePanel, setActivePanel }) => {
  
  const menuItems = [
    { name: 'Usuarios', icon: <FiUsers /> },
    { name: 'Salones', icon: <FiHome /> },
    { name: 'Reservas', icon: <FiCalendar /> },
    { name: 'Ingresos', icon: <FiDollarSign /> },
  ];

  const handleItemClick = (itemName) => {
    setActivePanel(itemName);
  };

  const handleHeaderClick = () => {
    // Opcional: Podrías resetear al panel principal o simplemente mantener el actual
    setActivePanel('Reservas'); // Por defecto a Reservas
  };

  return (
    <div className="adminSidebar">
      <div className="sidebar-header" onClick={handleHeaderClick}>
        <FiMenu className="menu-icon" />
        <h1 className="sidebar-title">PANEL DE ADMINISTRACIÓN</h1>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`sidebar-item ${activePanel === item.name ? 'active' : ''}`}
            onClick={() => handleItemClick(item.name)}
          >
            {activePanel === item.name && <div className="active-indicator"></div>}
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarAdmin;