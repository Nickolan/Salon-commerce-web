// src/screens/ForgotPasswordScreen.jsx (o donde corresponda)
import React, { useState } from "react";
import axios from "axios"; // Asumiendo que usas axios globalmente
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/ForgotPasswordScreen.css"; // Crear este archivo CSS

// URL base de tu API (mejor si viene de una variable de entorno)
const API_URL = 'http://localhost:3000';

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState('enterEmail'); // 'enterEmail', 'enterCode', 'enterPassword'
  const [email, setEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState(""); // Código generado por el frontend
  const [enteredCode, setEnteredCode] = useState("");   // Código ingresado por el usuario
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Función para generar código de 4 dígitos
  const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // 1. Manejador para enviar el correo con el código generado
  const handleSendCode = async () => {
    setError(""); // Limpiar errores previos
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    const codeToSend = generateCode(); // Generar código aquí
    setGeneratedCode(codeToSend);     // Guardar en el estado local

    try {
      // Llamar al backend para que envíe el email con el código generado
      const response = await axios.post(`${API_URL}/usuarios/request-password-reset`, {
        email: email,
        code: codeToSend // Enviamos el código generado al backend
      });

      if (response.status === 200) {
        setStep('enterCode'); // Avanzar al siguiente paso
        Swal.fire({
          icon: "info",
          title: "Código Enviado",
          text: response.data.message, // Usar mensaje del backend
          timer: 4000,
          showConfirmButton: false,
        });
      } else {
        // Esto es por si el backend responde 200 pero con un error interno (raro)
        setError(response.data.message || "Ocurrió un error inesperado.");
      }
    } catch (err) {
      // Capturar errores de red o respuestas 4xx/5xx
      setError(err.response?.data?.message || err.message || "No se pudo enviar el código. Intenta de nuevo.");
      setGeneratedCode(""); // Limpiar código si falla el envío
    } finally {
      setLoading(false);
    }
  };

  // 2. Manejador para verificar el código ingresado (comparación local)
  const handleVerifyCode = () => {
    setError("");
    if (!enteredCode || enteredCode.length !== 4 || !/^\d{4}$/.test(enteredCode)) {
        setError("Ingresa un código válido de 4 dígitos.");
        return;
    }

    if (enteredCode === generatedCode) {
      setStep('enterPassword'); // Código correcto, avanzar
    } else {
      Swal.fire({
        icon: "error",
        title: "Código Incorrecto",
        text: "El código ingresado no coincide. Revisa tu correo o solicita uno nuevo.",
        confirmButtonText: "Entendido",
      });
      // Opcional: Limpiar el campo de código
      // setEnteredCode("");
    }
  };

  // 3. Manejador para enviar la nueva contraseña
  const handleResetPassword = async () => {
    setError("");
    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      // Llamar al backend para actualizar la contraseña (sin enviar el código)
      const response = await axios.post(`${API_URL}/usuarios/reset-password`, {
        email: email, // El email que guardamos al inicio
        newPassword: newPassword
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "¡Contraseña Restablecida!",
          text: "Tu contraseña ha sido actualizada. Ya puedes iniciar sesión.",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/login"); // Redirigir al login
        });
      } else {
        setError(response.data.message || "Ocurrió un error inesperado.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "No se pudo restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  // Renderizado condicional basado en el estado 'step'
  return (
    <div className="pass-change-container"> {/* Reutilizamos clase del ejemplo */}
      <div className="pass-change-content"> {/* Reutilizamos clase del ejemplo */}

        {/* --- PASO 1: Ingresar Email --- */}
        {step === 'enterEmail' && (
          <>
            <h2 className="title">Recuperar Contraseña</h2>
            <p className="subtitle">Ingresa tu correo electrónico para recibir un código de verificación.</p>
            <input
              placeholder="Correo Electrónico"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="input"
              disabled={loading}
            />
            <button onClick={handleSendCode} className="button" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Código"}
            </button>
          </>
        )}

        {/* --- PASO 2: Ingresar Código --- */}
        {step === 'enterCode' && (
          <>
            <h2 className="title">Verifica tu Correo</h2>
            <p className="subtitle">Ingresa el código de 4 dígitos que enviamos a {email}.</p>
            <input
              placeholder="Código de 4 dígitos"
              type="text" // Usar text para facilitar ingreso en móviles, aunque validemos número
              inputMode="numeric" // Sugerir teclado numérico
              maxLength={4}
              onChange={(e) => setEnteredCode(e.target.value)}
              value={enteredCode}
              className="input code-input" // Clase opcional para estilizar diferente
              disabled={loading}
            />
            <button onClick={handleVerifyCode} className="button" disabled={loading}>
              Validar Código
            </button>
            {/* Opcional: Botón para reenviar código */}
            <button onClick={() => setStep('enterEmail')} className="button-link" disabled={loading}>
              ¿No recibiste el código? Volver a ingresar email.
            </button>
          </>
        )}

        {/* --- PASO 3: Ingresar Nueva Contraseña --- */}
        {step === 'enterPassword' && (
          <>
            <h2 className="title">Crea tu Nueva Contraseña</h2>
            <p className="subtitle">Ingresa y confirma tu nueva contraseña segura.</p>
            <input
              placeholder="Nueva Contraseña (mín. 6 caracteres)"
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              className="input"
              disabled={loading}
            />
            <input
              placeholder="Confirmar Nueva Contraseña"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="input"
              disabled={loading}
            />
            <button onClick={handleResetPassword} className="button" disabled={loading}>
              {loading ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>
          </>
        )}

        {/* Mostrar errores generales */}
        {error && <p className="error error-general">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;