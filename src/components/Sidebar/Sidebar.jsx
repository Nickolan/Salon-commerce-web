import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { IoLogOutOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import { IoMdCard } from "react-icons/io";
import { LuHouse } from "react-icons/lu";
import { FiBarChart2 } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/features/auth/authSlice";

const Sidebar = () => { 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Definimos los items del menú con sus rutas
  const menuItems = [
    { name: 'Mi Perfil', icon: <FiBarChart2 />, path: '/perfil' },
    { name: 'Mis Reservas', icon: <IoLockClosedOutline />, path: '/mis-reservas' },
    { name: 'Favoritos', icon: <FaRegHeart />, path: '/favoritos' },
    { name: 'Mis Salones', icon: <LuHouse />, path: '/mis-salones' },
    { name: 'Mis Ventas', icon: <IoMdCard />, path: '/mis_ventas' },
  ];

  // Función para determinar si un item está activo
  const isItemActive = (itemPath) => {
    // Si estamos en /editar-perfil, consideramos /perfil como activo también
    if (location.pathname === '/editar-perfil' && itemPath === '/perfil') {
      return true;
    }
    return location.pathname === itemPath;
  };

  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
  };

  // Cerrar sidebar al cambiar de ruta (en móvil)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div
        className="sidebar-toggle mobile-only"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </div>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-container">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`sidebar-item ${isItemActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.name}</span>
                {isItemActive(item.path) && <div className="active-indicator"></div>}
              </li>
            ))}
          </ul>

          {/* Línea divisoria */}
          <div className="sidebar-divider"></div>

          {/* Cerrar Sesión */}
          <div 
            className="sidebar-item cerrar-sesion-item" 
            onClick={handleLogout}
          >
            <span className="sidebar-icon">
              <IoLogOutOutline />
            </span>
            <span className="sidebar-text">Cerrar Sesión</span>
          </div>

          {/* Espaciador flexible */}
          <div className="sidebar-spacer"></div>
        </div>
      </div>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
};

export default Sidebar;