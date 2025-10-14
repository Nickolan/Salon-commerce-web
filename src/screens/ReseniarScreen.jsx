import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "../styles/ReseniarScreen.css";
import Salones from "../utils/Salones.json";

const ReseniarScreen = () => {
  const { id_salon } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [salon, setSalon] = useState(null);
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [error, setError] = useState("");

  const maxLetras = 200;

  // Restricción de acceso: solo desde Mis Reservas
  useEffect(() => {
    if (!location.state || !location.state.desdeMisReservas) {
      navigate("/");
    }
  }, [location, navigate]);

  // Cargar datos del salón según el id
  useEffect(() => {
    const encontrado = Salones.find((s) => s.id_salon === parseInt(id_salon));
    if (!encontrado) {
      navigate("/mis-reservas"); // si no existe, redirigir
    } else {
      setSalon(encontrado);
    }
  }, [id_salon, navigate]);

  const handlePublicar = () => {
    if (comentario.trim().length === 0 || calificacion === 0) {
      setError("Por favor, completa tu comentario y selecciona una calificación.");
      return;
    }

    // Reset de estado
    setComentario("");
    setCalificacion(0);
    setError("");

    // Redirigir
    navigate("/mis-reservas");
  };

  if (!salon) return null;

  return (
    <div className="reseniar-container">
      <img src={salon.imagen} alt={salon.nombre} className="reseniar-imagen" />

      <h2 className="reseniar-nombre">{salon.nombre}</h2>

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
