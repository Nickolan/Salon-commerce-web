import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "../styles/ReseniarScreen.css";
import Salones from "../utils/Salones.json";
import Reservas from "../utils/Reservas.json"; // 👈 1. IMPORTAR RESERVAS

const ReseniarScreen = () => {
  const { id_salon } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 2. OBTENER EL ID DE LA RESERVA
  const { id_reserva } = location.state || {};

  const [salon, setSalon] = useState(null);
  const [reserva, setReserva] = useState(null); // 👈 3. NUEVO ESTADO PARA LA RESERVA
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [error, setError] = useState("");

  const maxLetras = 200;

  useEffect(() => {
    if (!location.state || !location.state.desdeMisReservas) {
      navigate("/");
    }
  }, [location, navigate]);

  // 👇 4. EFECTO MODIFICADO PARA BUSCAR SALÓN Y RESERVA
  useEffect(() => {
    const salonEncontrado = Salones.find((s) => s.id_salon === parseInt(id_salon));
    if (!salonEncontrado) {
      navigate("/mis-reservas");
    } else {
      setSalon(salonEncontrado);
    }

    if (id_reserva) {
      const reservaEncontrada = Reservas.find((r) => r.id_reserva === id_reserva);
      setReserva(reservaEncontrada);
    }
  }, [id_salon, id_reserva, navigate]);

  const handlePublicar = () => {
    if (comentario.trim().length === 0 || calificacion === 0) {
      setError("Por favor, completa tu comentario y selecciona una calificación.");
      return;
    }
    setComentario("");
    setCalificacion(0);
    setError("");
    navigate("/mis-reservas");
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const fechaObj = new Date(fecha + 'T00:00:00'); // Asegura que se tome como fecha local
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  };

  const formatearHora = (hora) => {
    if (!hora) return "";
    return hora.slice(0, 5);
  };

  // Se muestra un mensaje de carga hasta que ambos datos estén listos
  if (!salon || !reserva) {
    return <p>Cargando datos de la reserva...</p>;
  }

  return (
    <div className="reseniar-container">
      <img src={salon.imagen} alt={salon.nombre} className="reseniar-imagen" />

      <h2 className="reseniar-nombre">{salon.nombre}</h2>

      {/* 👇 5. BLOQUE ACTUALIZADO CON LOS DATOS CORRECTOS DE LA RESERVA */}
      <div className="reseniar-info-reserva">
        <p>
          Reserva del <b>{formatearFecha(reserva.fecha_reserva)}</b>
        </p>
        <p>
          De <b>{formatearHora(reserva.hora_inicio)}</b> a <b>{formatearHora(reserva.hora_fin)} hs</b>
        </p>
      </div>

      <label className="reseniar-label">¿Qué te pareció el salón?</label>

      <textarea
        className="reseniar-textarea"
        placeholder="El salón me pareció..."
        value={comentario}
        onChange={(e) => {
          if (e.target.value.length <= maxLetras) {
            setComentario(e.target.value);
          }
        }}
      ></textarea>

      <p className="reseniar-contador">
        {comentario.length}/{maxLetras} letras
      </p>

      <div className="reseniar-estrellas">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={40}
            color={star <= calificacion ? "var(--primary-color)" : "#EADCFB"}
            onClick={() => setCalificacion(star)}
            className="estrella"
          />
        ))}
      </div>

      {error && <p className="reseniar-error">{error}</p>}

      <button
        className="reseniar-boton"
        onClick={handlePublicar}
        disabled={comentario.trim() === "" || calificacion === 0}
      >
        Publicar
      </button>
    </div>
  );
};

export default ReseniarScreen;