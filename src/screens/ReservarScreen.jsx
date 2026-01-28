import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../styles/ReservarScreen.css";
import Salones from "../utils/Salones.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReservarScreen = () => {
  const [fecha, setFecha] = useState(null);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [aplicado, setAplicado] = useState(false);
  const [cantidadHoras, setCantidadHoras] = useState(0);
  const [totalPagar, setTotalPagar] = useState(0);
  const [mesPicker, setMesPicker] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id_salon } = useParams();
  const salonSeleccionado = Salones.find(s => s.id_salon === Number(id_salon)) || Salones[0];
  const diasHabilitados = salonSeleccionado.disponibilidades.map(d => d.dia_semana);

  // ✅ Recuperar token del usuario logueado (ya guardado por el login)
  const tokenUsuario = localStorage.getItem("tokenUsuario");

  const getDiaSemana = (date) => {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[date.getDay()];
  };

  const esDiaValido = (date) => {
    const diaSemana = getDiaSemana(date);
    if (date.getMonth() !== mesPicker.getMonth() || date.getFullYear() !== mesPicker.getFullYear()) return false;
    if (!diasHabilitados.includes(diaSemana)) return false;

    const hoy = new Date();
    const esHoy = date.toDateString() === hoy.toDateString();

    if (esHoy) {
      const disponibilidadDia = salonSeleccionado.disponibilidades.find(d => d.dia_semana === diaSemana);
      if (!disponibilidadDia) return false;

      const cierre = parseInt(disponibilidadDia.hora_fin.split(":")[0], 10);
      const ultimaHoraInicio = cierre - 1;
      if (hoy.getHours() >= ultimaHoraInicio) return false;
    }
    return true;
  };

  const getHorariosOcupados = () => {
    if (!fecha) return [];
    const fechaStr = fecha.toISOString().split("T")[0];
    return salonSeleccionado.reservas
      .filter(r => r.estado_reserva === "confirmada" && r.fecha_reserva === fechaStr)
      .map(r => ({
        inicio: parseInt(r.hora_inicio.split(":")[0], 10),
        fin: parseInt(r.hora_fin.split(":")[0], 10)
      }));
  };

  const horariosOcupados = getHorariosOcupados();

  const getHorasDisponibles = () => {
    if (!fecha) return [];
    const diaSemana = getDiaSemana(fecha);
    const disponibilidadDia = salonSeleccionado.disponibilidades.find(d => d.dia_semana === diaSemana);
    if (!disponibilidadDia) return [];

    const inicio = parseInt(disponibilidadDia.hora_inicio.split(":")[0], 10);
    const fin = parseInt(disponibilidadDia.hora_fin.split(":")[0], 10);

    let horas = [];
    for (let h = inicio; h < fin; h++) horas.push(h);

    const ultimaHoraInicio = fin - 1;
    const hoy = new Date();
    if (fecha.toDateString() === hoy.toDateString()) {
      horas = horas.filter(h => h > hoy.getHours() && h <= ultimaHoraInicio);
    } else {
      horas = horas.filter(h => h <= ultimaHoraInicio);
    }

    return horas;
  };

  const getHorasFinDisponibles = () => {
    if (horaInicio === "") return [];
    const diaSemana = getDiaSemana(fecha);
    const disponibilidadDia = salonSeleccionado.disponibilidades.find(d => d.dia_semana === diaSemana);
    if (!disponibilidadDia) return [];

    const finDia = parseInt(disponibilidadDia.hora_fin.split(":")[0], 10);
    let horasFin = [];
    for (let h = horaInicio + 1; h <= finDia; h++) {
      const ocupada = horariosOcupados.some(r => h > r.inicio && h <= r.fin);
      if (ocupada) break;
      horasFin.push(h);
    }
    return horasFin;
  };

  const handleHoraInicio = (h) => {
    setHoraInicio(h);
    setHoraFin("");
    setAplicado(false);
  };

  const handleHoraFin = (h) => {
    setHoraFin(h);
    setAplicado(false);
  };

  const handleAplicar = (e) => {
    e.preventDefault();
    if (!fecha || !horaInicio || !horaFin) return;

    if (!esDiaValido(fecha)) {
      alert("Ese día el salón no está disponible");
      return;
    }

    const cantidad = horaFin - horaInicio;
    const precioHora = salonSeleccionado.precio_por_hora;
    setCantidadHoras(cantidad);
    setTotalPagar(cantidad * precioHora);
    setAplicado(true);
  };

  const isHoraOcupadaInicio = (h) => horariosOcupados.some(r => h >= r.inicio && h < r.fin);
  const isHoraOcupadaFin = (h) => horariosOcupados.some(r => h > r.inicio && h <= r.fin);

  const isAplicarDisabled = !(fecha && horaInicio && horaFin);
  const isPagarDisabled = !(aplicado && metodoPago !== "" && horaInicio !== "" && horaFin !== "");

  // ✅ Enviar reserva al backend (ya con token)
  const handleIrAPagar = async () => {
    if (isPagarDisabled) return;

    const reserva = {
      idSalon: salonSeleccionado.id_salon,
      salon: salonSeleccionado.nombre,
      fecha: fecha.toISOString().split("T")[0],
      horaInicio,
      horaFin,
      vendedor: salonSeleccionado.publicador.nombre + " " + salonSeleccionado.publicador.apellido,
      metodoPago,
      totalPagar,
    };

    try {
      setLoading(true);
      const response = await fetch("https://mi-backend.example.com/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenUsuario}`, // 🔒 Token real del usuario
        },
        body: JSON.stringify(reserva),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/resumen-reserva/${salonSeleccionado.id_salon}`, { state: { ...reserva, idReserva: data.idReserva } });
      } else {
        alert("Error al reservar: " + (data.message || "Inténtalo nuevamente"));
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al enviar la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservar-layout">
      <div className="reservar-container">
        <h2 className="reservar-titulo">Elegí la fecha y el horario</h2>
        <form className="reservar-form" onSubmit={handleAplicar}>
          <div className="reservar-inputs">
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <DatePicker
                selected={fecha}
                onChange={(date) => setFecha(date)}
                onMonthChange={(date) => setMesPicker(date)}
                filterDate={esDiaValido}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="-- Selecciona --"
                dayClassName={(date) =>
                  esDiaValido(date) ? "dia-habilitado" : "dia-invalido"
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="horaInicio">Hora inicio</label>
              <select
                id="horaInicio"
                className="form-control"
                value={horaInicio}
                onChange={(e) => handleHoraInicio(Number(e.target.value))}
                disabled={!fecha}
              >
                <option value="">-- Selecciona --</option>
                {getHorasDisponibles().map(h => (
                  <option
                    key={h}
                    value={h}
                    disabled={isHoraOcupadaInicio(h)}
                    className={isHoraOcupadaInicio(h) ? "option-disabled" : ""}
                  >
                    {`${h.toString().padStart(2, "0")}:00`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="horaFin">Hora fin</label>
              <select
                id="horaFin"
                className="form-control"
                value={horaFin}
                onChange={(e) => handleHoraFin(Number(e.target.value))}
                disabled={!horaInicio}
              >
                <option value="">-- Selecciona --</option>
                {getHorasFinDisponibles().map(h => (
                  <option
                    key={h}
                    value={h}
                    disabled={isHoraOcupadaFin(h)}
                    className={isHoraOcupadaFin(h) ? "option-disabled" : ""}
                  >
                    {`${h.toString().padStart(2, "0")}:00`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-btn">
              <label>&nbsp;</label>
              <button type="submit" className="btn-aplicar" disabled={isAplicarDisabled}>
                Aplicar
              </button>
            </div>
          </div>
        </form>

        <h2 className="reservar-titulo titulo-pago">Elegí cómo pagar</h2>
        <div className="payment-section">
          <div className="payment-row">
            <label
              className="payment-label"
              onClick={() => setMetodoPago(metodoPago === "mercadoPago" ? "" : "mercadoPago")}
            >
              <input
                type="radio"
                name="metodoPago"
                value="mercadoPago"
                checked={metodoPago === "mercadoPago"}
                readOnly
              />
              <span className="payment-text">Mercado Pago</span>
            </label>
          </div>


        </div>

        <div className="reservar-boton-pago">
          <button
            className="btn-aplicar"
            disabled={isPagarDisabled || loading}
            onClick={handleIrAPagar}
          >
            {loading ? "Cargando..." : "Ir a pagar"}
          </button>
        </div>
      </div>

      <div className="detalle-container">
        <h4 className="detalle-titulo">Detalle de reserva</h4>

        <div className="detalle-row">
          <span>Servicio</span>
          <span>${salonSeleccionado.precio_por_hora}</span>
        </div>

        <div className="detalle-row">
          <span>Cantidad de horas</span>
          <span>{cantidadHoras}</span>
        </div>

        <hr className="detalle-divider" />

        <div className="detalle-row bold">
          <span>Pagás</span>
          <span>${totalPagar}</span>
        </div>
      </div>
    </div>
  );
};

export default ReservarScreen;
