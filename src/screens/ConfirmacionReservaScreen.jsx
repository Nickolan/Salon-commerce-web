import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ConfirmacionReservaScreen.css";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // íconos

const ConfirmacionReservaScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const exito = state?.exito;

  if (exito === undefined) {
    navigate("/");
    return null;
  }

  // Generar ID de reserva aleatorio de 12 dígitos
  const reservaID = `#${Math.floor(100000000000 + Math.random() * 900000000000)}`;

  return (
    <div className="confirmacion-layout">
      {exito ? (
        <>
          <FaCheckCircle className="confirmacion-icono" />
          <p className="numero-compra">Número de reserva: {reservaID}</p>
          <h2 className="mensaje-exito">El pago fue efectuado correctamente</h2>
          <h3 className="agradecimiento">¡Muchas Gracias!</h3>
          <button className="btn-volver" onClick={() => navigate("/")}>
            VOLVER AL INICIO
          </button>
        </>
      ) : (
        <>
          <FaTimesCircle className="confirmacion-icono-fallo" />
          <h2 className="mensaje-fallo">El pago no pudo efectuarse</h2>
          <h3 className="agradecimiento-fallo">Lo sentimos</h3>
          <button className="btn-volver" onClick={() => navigate("/")}>
            VOLVER AL INICIO
          </button>
        </>
      )}
    </div>
  );
};

export default ConfirmacionReservaScreen;
