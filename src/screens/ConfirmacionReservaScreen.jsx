import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ConfirmacionReservaScreen.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ConfirmacionReservaScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const exito = state?.exito;

  // Si se ingresa sin datos (por URL directa), volver al inicio
  useEffect(() => {
    if (exito === undefined) {
      navigate("/");
      return;
    }
  }, [exito, navigate]);

  return (
    <div className="confirmacion-layout">
      {exito ? (
        <>
          <FaCheckCircle className="confirmacion-icono-exito" />
          <h2 className="mensaje-exito">Pago efectuado correctamente</h2>
          <h3 className="agradecimiento">¡Muchas gracias por tu reserva!</h3>
          <p className="numero-compra">
            En breve recibirás un correo con los detalles de tu compra.
          </p>
          <button className="btn-volver" onClick={() => navigate("/")}>
            VOLVER AL INICIO
          </button>
        </>
      ) : (
        <>
          <FaTimesCircle className="confirmacion-icono-fallo" />
          <h2 className="mensaje-fallo">El pago no pudo completarse</h2>
          <h3 className="agradecimiento-fallo">Lo sentimos mucho</h3>
          <p className="numero-compra">
            Tu reserva no fue procesada. Puedes intentar nuevamente o elegir otro método de pago.
          </p>
          <button className="btn-volver" onClick={() => navigate("/")}>
            VOLVER AL INICIO
          </button>
        </>
      )}
    </div>
  );
};

export default ConfirmacionReservaScreen;
