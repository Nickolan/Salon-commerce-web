import React, { useState } from "react";
import "./Sidebar.css";
import { IoLogOutOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import { IoMdCard } from "react-icons/io";
import { LuHouse } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/features/auth/authSlice";

const Sidebar = () => { 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogout = () => {
      navigate("/")
      dispatch(logout());
    };

  return (
    <>
      <div
        className="sidebar-toggle mobile-only"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </div>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Link to="/perfil">Mi Perfil</Link>
        <div className="sidebar-container">
          <div className="side-links">
            <div className="link-item">
              <IoLockClosedOutline alt="Mis Reservas" className="logo" />
              <Link to="/mis-reservas">Mis Reservas</Link>
            </div>
            <div className="link-item">
              <FaRegHeart alt="Favoritos" className="logo" />
              <Link to="/favoritos">Favoritos</Link>
            </div>
            <div className="link-item">
              <LuHouse alt="Mis Salones" className="logo" />
              <Link to="/mis-salones">Mis Salones</Link>
            </div>
            <div className="link-item">
              <IoMdCard alt="Mis Ventas" className="logo" />
              <Link to="/mis_ventas">Mis Ventas</Link>
            </div>
            <div className="link-item logout">
              <IoLogOutOutline alt="Cerrar Sesion" className="logos"/>
              
              <span onClick={handleLogout}>Cerrar Sesión</span>
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
};

export default Sidebar;

