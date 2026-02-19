import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ResumenReservaScreen.css";

const ResumenReservaScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [loading, setLoading] = useState(false);

  // Redirige si se ingresa sin datos de reserva
  if (!data || !data.idReserva) {
    navigate("/");
    return null;
  }

  const { idReserva, salon, fecha, horaInicio, horaFin, vendedor, metodoPago, totalPagar } = data;

  // 🔒 Recuperar token del usuario logueado
  const tokenUsuario = localStorage.getItem("tokenUsuario");

  // 📅 Formatear fecha en formato legible (Ajustado para manejar el formato YYYY-MM-DD)
  const fechaObjeto = new Date(fecha + 'T00:00:00'); // Añade hora para evitar desfase de zona horaria
  const fechaStr = fechaObjeto.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

  // 💳 Función para iniciar el pago
  const handlePagar = async () => {
    setLoading(true);

    try {
      // 1️⃣ 100% NECESARIO EL URL DE DESPLIEGUE DEL BACKEND AQUÍ
      const response = await fetch("https://mi-backend.example.com/api/pago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenUsuario}`,
        },
        body: JSON.stringify({
          idReserva,
          metodoPago,
          totalPagar,
        }),
      });

      const result = await response.json();

      if (response.ok && result.urlPago) {
        // 2️⃣ Éxito: Redirige al link de pago generado (MercadoPago o Coinbase)
        window.location.href = result.urlPago;

        // No hay 'finally' porque la página es redirigida
      } else if (response.ok && result.estado === "completado") {
        // 3️⃣ Caso Sandbox/Test: Si el backend ya confirma el pago instantáneamente
        navigate("/confirmacion-reserva", { state: { exito: true } });
      } else {
        alert("Error al generar el pago: " + (result.message || "Inténtalo nuevamente"));
        setLoading(false); // Detener el loader si falla la llamada
      }
    } catch (error) {
      console.error("Error de red en el pago:", error);
      alert("Ocurrió un error de conexión al procesar el pago. Intenta más tarde.");
      setLoading(false); // Detener el loader en caso de error de red
    }
  };

  const metodoPagoTexto =
    metodoPago === "mercadoPago"
      ? "Mercado Pago"
      : metodoPago;

  return (
    <div className="detalle-layout">
      <div className="detalle-box">
        <h2 className="detalle-titulo">Resumen Final</h2>

        <p><span>ID Reserva:</span> {idReserva}</p> {/* Útil para el debug */}
        <p><span>Salón:</span> {salon}</p>
        <p><span>Fecha:</span> {fechaStr}</p>
        <p><span>Horario:</span> {horaInicio}:00 - {horaFin}:00</p>
        <p><span>Vendedor:</span> {vendedor}</p>
        <p><span>Método de Pago:</span> {metodoPagoTexto}</p>

        <hr className="detalle-divider" />
        <p className="total-final"><span>Total a Pagar:</span> <strong>${totalPagar}</strong></p>

        <button className="btn-pagar" onClick={handlePagar} disabled={loading}>
          {loading ? "Generando..." : `Pagar $${totalPagar}`}
        </button>
      </div>
    </div>
  );
};

export default ResumenReservaScreen;