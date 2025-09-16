import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegistroScreen.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegistroScreen() {

  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarContraseña2, setMostrarContraseña2] = useState(false);
  const [errores, setErrores] = useState({});
  const [nombre, setNombre] = useState("");
  const [contraseña2, setContraseña2] = useState("");
  const [terminos_condiciones, setTerminos_condiciones] = useState(false);

  const navigate = useNavigate();

  const toggleContraseña = () => {
    setMostrarContraseña(!mostrarContraseña);
  };

  const toggleContraseña2 = () => {
    setMostrarContraseña2(!mostrarContraseña2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let nuevosErrores = {};
    if (!nombre.trim()) {
        nuevosErrores.nombre = "Campo obligatorio";
    } 

    if (!email.trim()) {
        nuevosErrores.email = "Campo obligatorio";
    } else if (!email.includes("@")) {
        nuevosErrores.email = "El correo no es válido";
    }

    if (!contraseña.trim()) {
        nuevosErrores.contraseña = "Campo obligatorio";
    } else if (contraseña.length < 8) {
      nuevosErrores.contraseña = "La contraseña debe tener al menos 8 caracteres"
    }

    if (!contraseña2.trim()) {
        nuevosErrores.contraseña2 = "Campo obligatorio";
    } else if (contraseña2 != contraseña) {
        nuevosErrores.contraseña2 = "Las contraseñas no coinciden"
    }

    if (!terminos_condiciones) {
        nuevosErrores.terminos_condiciones = "Debes aceptar los términos y condiciones"
    }

    setErrores(nuevosErrores);

    if(Object.keys(nuevosErrores).length === 0) {
      console.log("Nombre: ", nombre, " Email: ", email, " Contraseña: ", contraseña, " Contraseña 2: ", contraseña2);
      setNombre("");
      setEmail("");
      setContraseña("");
      setContraseña2("");
      setTerminos_condiciones(false);
      navigate("/login");
    }
  }

  return (
    <div className="registro-page">
      <div className="registro-container">
        <h1>Bienvenido, Regístrate</h1>
        
        <form className="registro-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <p className={`error ${errores.nombre ? "active" : ""}`}>{errores.nombre || " "}</p>
            </div>  

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className={`error ${errores.email ? "active" : ""}`}>{errores.email || " "}</p>
          </div>

          <div className="form-group password-group">
            <input
              type={mostrarContraseña ? "text" : "password"}
              name="contraseña"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <span className="toggle" onClick={toggleContraseña}>
              {mostrarContraseña ? <FaEyeSlash/> : <FaEye/>}
            </span>
            <p className={`error ${errores.contraseña ? "active" : ""}`}>{errores.contraseña || " "}</p>
          </div>

          <div className="form-group password-group">
            <input
              type={mostrarContraseña2 ? "text" : "password"}
              name="contraseña2"
              placeholder="Repetir Contraseña"
              value={contraseña2}
              onChange={(e) => setContraseña2(e.target.value)}
              required
            />
            <span className="toggle" onClick={toggleContraseña2}>
              {mostrarContraseña2 ? <FaEyeSlash/> : <FaEye/>}
            </span>
            <p className={`error ${errores.contraseña2 ? "active" : ""}`}>{errores.contraseña2 || " "}</p>
          </div>

          <div className="form-group checkbox-group">
            <label>
                <input 
                type="checkbox" 
                name="terminos_condiciones"
                checked={terminos_condiciones}
                onChange={(e) => setTerminos_condiciones(e.target.checked)}
                required
            /> 
            <span className="custom-checkbox"></span>
            Acepto los <a 
            href="/src/terminos.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            >términos y condiciones</a>
            </label>
            <p className={`error ${errores.terminos_condiciones ? "active" : ""}`}>{errores.terminos_condiciones || " "}</p>
          </div>

          <button type="submit" className="btn-primary">
            Continuar
          </button>
        </form>

        <div className="registro-links">
          <Link to="/login">Ya tengo una cuenta</Link>
        </div>
      </div>
    </div>
  );
}

export default RegistroScreen;