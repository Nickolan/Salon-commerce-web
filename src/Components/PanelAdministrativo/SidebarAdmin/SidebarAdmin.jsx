import React from 'react';
import './SidebarAdmin.css';
import { FiBarChart2, FiUsers, FiHome, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const SidebarAdmin = ({ activePanel, setActivePanel }) => {
  const navigate = useNavigate();
  
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

  const handleVolverClick = () => {
    navigate('/');
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

      {/* Línea horizontal divisoria */}
      <div className="sidebar-divider"></div>

      {/* Item Volver - justo después de la línea */}
      <div 
        className="sidebar-item volver-item" 
        onClick={handleVolverClick}
      >
        <span className="sidebar-icon">
          <CiLogout />
        </span>
        <span className="sidebar-text">Volver</span>
      </div>

      {/* Espaciador flexible que empuja el contenido hacia arriba */}
      <div className="sidebar-spacer"></div>
    </div>
  );
};

export default SidebarAdmin;