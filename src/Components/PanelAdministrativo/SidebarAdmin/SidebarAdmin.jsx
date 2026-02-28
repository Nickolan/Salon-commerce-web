import React from 'react';
import './SidebarAdmin.css';
import { FiBarChart2, FiUsers, FiHome, FiCalendar, FiDollarSign } from 'react-icons/fi';

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
    setActivePanel('PanelAdministrador'); 
  };

  return (
    <div className="adminSidebar">
      <div className="sidebar-header" onClick={handleHeaderClick}>
        <FiBarChart2 className="menu-icon" />
        <h1 className="sidebar-title">PANEL</h1>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`sidebar-item ${activePanel === item.name ? 'active' : ''}`}
            onClick={() => handleItemClick(item.name)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
            {activePanel === item.name && <div className="active-indicator"></div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarAdmin;