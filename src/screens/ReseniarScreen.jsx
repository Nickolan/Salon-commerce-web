// src/screens/ReseniarScreen.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "../styles/ReseniarScreen.css";
// import Salones from "../utils/Salones.json"; // 👈 Ya no usaremos JSON
// import Reservas from "../utils/Reservas.json"; // 👈 Ya no usaremos JSON

// --- 👇 1. IMPORTACIONES DE REDUX Y DATOS ---
import { useDispatch, useSelector } from "react-redux";
import { fetchSalonById, createResenia, resetSalonStatus } from "../store/features/salones/salonSlice";
import { fetchReservaById, clearSelectedReserva } from "../store/features/reservas/reservasSlice";
import Swal from 'sweetalert2';
// ------------------------------------------

const ReseniarScreen = () => {
  const { id_salon } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { id_reserva } = location.state || {};

  // --- 👇 2. OBTENER DATOS DESDE EL STORE ---
  const { selectedSalon, status: salonStatus, reseniaStatus, reseniaError } = useSelector((state) => state.salones);
  const { selectedReserva, selectedReservaStatus } = useSelector((state) => state.reservas);
  // ----------------------------------------

  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [error, setError] = useState(""); // Error local del formulario

  const maxLetras = 300;

  // Efecto de seguridad (sin cambios)
  useEffect(() => {
    if (!location.state || !location.state.desdeMisReservas || !id_reserva) {
      console.warn("Acceso inválido a ReseniarScreen, redirigiendo...");
      navigate("/");
    }
  }, [location, id_reserva, navigate]);

  // --- 👇 3. EFECTO PARA CARGAR DATOS DE LA API ---
  useEffect(() => {
    if (id_salon) {
      dispatch(fetchSalonById(id_salon));
    }
    if (id_reserva) {
      dispatch(fetchReservaById(id_reserva));
    }

    // Limpiar estados al desmontar
    return () => {
      dispatch(resetSalonStatus());
      dispatch(clearSelectedReserva());
    };
  }, [id_salon, id_reserva, dispatch]);
  // -------------------------------------------

  // --- 👇 4. MANEJADOR DE PUBLICACIÓN (handlePublicar) ---
  const handlePublicar = () => {
    if (comentario.trim().length === 0 || calificacion === 0) {
      setError("Por favor, completa tu comentario y selecciona una calificación.");
      return;
    }
    setError("");

    console.log({
      id_reserva: id_reserva,
      calificacion: calificacion,
      comentario: comentario
    });
    

    // Despachamos la nueva acción
    dispatch(createResenia({
      id_reserva: id_reserva,
      calificacion: calificacion,
      comentario: comentario
    }));
  };
  // ----------------------------------------------------

  // --- 👇 5. EFECTO PARA MANEJAR LA RESPUESTA DE LA API ---
  useEffect(() => {
    if (reseniaStatus === 'succeeded') {
      Swal.fire({
        title: '¡Reseña Publicada!',
        text: 'Gracias por tu opinión.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate("/mis-reservas"); // Volvemos a "Mis Reservas"
      });
    } else if (reseniaStatus === 'failed') {
      console.log(reseniaError);
      
      Swal.fire('Error', reseniaError || 'No se pudo publicar tu reseña.', 'error');
      // Reseteamos el estado para que pueda intentarlo de nuevo
      dispatch(resetSalonStatus());
    }
  }, [reseniaStatus, reseniaError, navigate, dispatch]);
  // ----------------------------------------------------

  // (Funciones de formateo sin cambios)
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

  // (Renderizado de carga y error)
  if (salonStatus === 'loading' || selectedReservaStatus === 'loading') {
    return <p>Cargando datos de la reserva...</p>;
  }
  if (!selectedSalon || !selectedReserva) {
    return <p>Error al cargar los datos.</p>;
  }

  console.log(selectedSalon);
  

  // -----------------------------

  return (
    <div className="reseniar-container">
      <img src={selectedSalon.fotos.length > 0 ? selectedSalon.fotos[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqEx41lmw6yMNksFVU2dPXYqdciHh9CaGlw&s"} alt={selectedSalon.nombre} className="reseniar-imagen" />
      <h2 className="reseniar-nombre">{selectedSalon.nombre}</h2>

      <div className="reseniar-info-reserva">
        <p>
          Reserva del <b>{formatearFecha(selectedReserva.fecha_reserva)}</b>
        </p>
        <p>
          De <b>{formatearHora(selectedReserva.hora_inicio)}</b> a <b>{formatearHora(selectedReserva.hora_fin)} hs</b>
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
      
      <p className="reseniar-contador">{comentario.length}/{maxLetras} letras</p>

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
        disabled={comentario.trim() === "" || calificacion === 0 || reseniaStatus === 'loading'}
      >
        {reseniaStatus === 'loading' ? 'Publicando...' : 'Publicar'}
      </button>
    </div>
  );
};

export default ReseniarScreen;