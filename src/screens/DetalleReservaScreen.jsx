import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/DetalleReservaScreen.css";

const DetalleReserva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    // Si no hay datos, redirige al home
    navigate("/");
    return null;
  }

  const { salon, fecha, horaInicio, horaFin, vendedor, metodoPago, totalPagar } = data;

  // Formatear fecha
  const fechaStr = fecha ? new Date(fecha).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long"
  }) : "";

    const handlePagar = () => {
        // Simulación de pago
        const pagoExitoso = true; // cambiar a false para probar fallo
        setTimeout(() => {
            navigate("/confirmacion-reserva", { state: { exito: pagoExitoso } });
        }, 1000); // simula 1 segundo de procesamiento
    };

  return (
    <div className="detalle-layout">
      <div className="detalle-box">
        <h2 className="detalle-titulo">Resumen Final</h2>

        <p><span>Salón:</span> {salon}</p>
        <p><span>Fecha:</span> {fechaStr}</p>
        <p><span>Horario:</span> {horaInicio}:00 - {horaFin}:00</p>
        <p><span>Vendedor:</span> {vendedor}</p>
        <p><span>Método de Pago:</span> {metodoPago === "mercadoPago" ? "Mercado Pago" : metodoPago}</p>
        <p><span>Precio:</span> ${totalPagar}</p>

        <button className="btn-pagar" onClick={handlePagar}>
            Pagar
        </button>

      </div>
    </div>
  );
};

export default DetalleReserva;
