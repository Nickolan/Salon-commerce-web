import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from "react";
import "./../styles/ReservarScreen.css";
import Salones from "../utils/Salones.json"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReservarScreen = () => {
  const [fecha, setFecha] = useState(null);
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  const salonSeleccionado = Salones[0]; // Salón 201 de ejemplo
  const diasHabilitados = salonSeleccionado.disponibilidades.map(d => d.dia_semana);

  const getDiaSemana = (date) => {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[date.getDay()];
  };

  const esDiaValido = (date) => diasHabilitados.includes(getDiaSemana(date));

  // --- Horarios ocupados para la fecha seleccionada ---
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

  const getHorasDisponibles = () => {
    if (!fecha) return [];
    const diaSemana = getDiaSemana(fecha);
    const disponibilidadDia = salonSeleccionado.disponibilidades.find(d => d.dia_semana === diaSemana);
    if (!disponibilidadDia) return [];

    const inicio = parseInt(disponibilidadDia.hora_inicio.split(":")[0], 10);
    const fin = parseInt(disponibilidadDia.hora_fin.split(":")[0], 10);

    let horas = [];
    for (let h = inicio; h < fin; h++) {
      horas.push(h);
    }

    // Filtrar horas pasadas si es hoy
    const hoy = new Date();
    if (fecha.toISOString().split("T")[0] === hoy.toISOString().split("T")[0]) {
      horas = horas.filter(h => h >= hoy.getHours());
    }

    return horas;
  };

  // --- Hora fin: desde horaInicio+1 hasta fin de disponibilidad ---
  const getHorasFinDisponibles = () => {
    if (horaInicio === "") return [];
    const diaSemana = getDiaSemana(fecha);
    const disponibilidadDia = salonSeleccionado.disponibilidades.find(d => d.dia_semana === diaSemana);
    if (!disponibilidadDia) return [];

    const finDia = parseInt(disponibilidadDia.hora_fin.split(":")[0], 10);

    let horasFin = [];
    for (let h = horaInicio + 1; h <= finDia; h++) {
        // Bloquear si la hora está ocupada en cualquier reserva
        const ocupada = horariosOcupados.some(r => h > r.inicio && h <= r.fin);
        if (ocupada) break; // cortamos en la primera hora ocupada
        horasFin.push(h);
    }

    return horasFin;
    };


  const handleHoraInicio = (h) => {
    setHoraInicio(h);
    setHoraFin("");
  };

  const handleAplicar = (e) => {
    e.preventDefault();
    if (!fecha || !horaInicio || !horaFin) return;

    if (!esDiaValido(fecha)) {
      alert("Ese día el salón no está disponible");
      return;
    }

    console.log("Datos seleccionados:", {
      fecha: fecha.toISOString().split("T")[0],
      horaInicio,
      horaFin
    });
  };

  const horariosOcupados = getHorariosOcupados();

  // --- Funciones para determinar si hora está ocupada ---
  const isHoraOcupadaInicio = (h) => horariosOcupados.some(r => h >= r.inicio && h < r.fin);
  const isHoraOcupadaFin = (h) => horariosOcupados.some(r => h > r.inicio && h <= r.fin);

  return (
    <div className="reservar-container">
      <h2 className="reservar-titulo">Elegí la fecha y el horario</h2>
      <form className="reservar-form" onSubmit={handleAplicar}>
        <div className="reservar-inputs">

          {/* Fecha */}
          <div className="form-group">
            <label htmlFor="fecha">Fecha</label>
            <DatePicker
              selected={fecha}
              onChange={(date) => setFecha(date)}
              filterDate={esDiaValido}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="-- Selecciona --"
            />
          </div>

          {/* Hora inicio */}
          <div className="form-group">
            <label htmlFor="horaInicio">Hora inicio</label>
            <select
              id="horaInicio"
              className="form-control"
              value={horaInicio}
              onChange={(e) => handleHoraInicio(Number(e.target.value))}
              required
              disabled={!fecha}
            >
              <option value="">-- Selecciona --</option>
              {getHorasDisponibles().map(h => (
                <option 
                  key={h} 
                  value={h} 
                  disabled={isHoraOcupadaInicio(h)}
                  style={{ color: isHoraOcupadaInicio(h) ? "gray" : "black" }}
                >
                  {`${h.toString().padStart(2,"0")}:00`}
                </option>
              ))}
            </select>
          </div>

          {/* Hora fin */}
          <div className="form-group">
            <label htmlFor="horaFin">Hora fin</label>
            <select
              id="horaFin"
              className="form-control"
              value={horaFin}
              onChange={(e) => setHoraFin(Number(e.target.value))}
              required
              disabled={!horaInicio}
            >
              <option value="">-- Selecciona --</option>
              {getHorasFinDisponibles().map(h => (
                <option 
                  key={h} 
                  value={h} 
                  disabled={isHoraOcupadaFin(h)}
                  style={{ color: isHoraOcupadaFin(h) ? "gray" : "black" }}
                >
                  {`${h.toString().padStart(2,"0")}:00`}
                </option>
              ))}
            </select>
          </div>

          {/* Botón */}
          <div className="form-group form-btn">
            <label>&nbsp;</label>
            <button type="submit" className="btn-aplicar">Aplicar</button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default ReservarScreen;

