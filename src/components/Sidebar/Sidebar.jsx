import React, { useState } from "react";
import "./Sidebar.css";
import CerrarSesionLogo from "../../assets/img/CerrarSesion-logo.png";
import FavoritoLogo from "../../assets/img/Favorito-logo.png";
import ReservasLogo from "../../assets/img/Reservas-logo.png";
import SalonesLogo from "../../assets/img/Salones-logo.png";
import VentasLogo from "../../assets/img/Ventas-logo.png";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <button
        className="sidebar-toggle mobile-only"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <a href="/">Mi Perfil</a>
        <div className="sidebar-container">
          <div className="side-links">
            <div className="link-item">
              <img src={ReservasLogo} alt="Mis Reservas" className="logo" />
              <a href="/">Mis Reservas</a>
            </div>
            <div className="link-item">
              <img src={FavoritoLogo} alt="Favoritos" className="logo" />
              <a href="/">Favoritos</a>
            </div>
            <div className="link-item">
              <img src={SalonesLogo} alt="Mis Salones" className="logo" />
              <a href="/">Mis Salones</a>
            </div>
            <div className="link-item">
              <img src={VentasLogo} alt="Mis Ventas" className="logo" />
              <a href="/">Mis Ventas</a>
            </div>
            <div className="link-item logout">
              <img src={CerrarSesionLogo} alt="Cerrar Sesión" className="logo" />
              <a href="/">Cerrar Sesión</a>
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
};

export default Sidebar;

