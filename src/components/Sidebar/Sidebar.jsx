import React, { useState } from "react";
import "./Sidebar.css";
import { IoLogOutOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import { IoMdCard } from "react-icons/io";
import { LuHouse } from "react-icons/lu";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div
        className="sidebar-toggle mobile-only"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </div>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <a href="/perfil">Mi Perfil</a>
        <div className="sidebar-container">
          <div className="side-links">
            <div className="link-item">
              <IoLockClosedOutline alt="Mis Reservas" className="logo" />
              <a href="/">Mis Reservas</a>
            </div>
            <div className="link-item">
              <FaRegHeart alt="Favoritos" className="logo" />
              <a href="/">Favoritos</a>
            </div>
            <div className="link-item">
              <LuHouse alt="Mis Salones" className="logo" />
              <a href="/mis-salones">Mis Salones</a>
            </div>
            <div className="link-item">
              <IoMdCard alt="Mis Ventas" className="logo" />
              <a href="/mis_ventas">Mis Ventas</a>
            </div>
            <div className="link-item logout">
              <IoLogOutOutline alt="Cerrar Sesion" className="logos"/>
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

