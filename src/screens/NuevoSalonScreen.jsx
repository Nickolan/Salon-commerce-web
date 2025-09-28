import React, { useState } from 'react'
import General from '../Components/FormSalon/General/General';
import '../styles/NuevoSalonScreen.css'
import Ubicacion from '../Components/FormSalon/Ubicacion/Ubicacion';
import PrecioYCapacidad from '../Components/FormSalon/Precio&Capacidad/PrecioYCapacidad';
import EquipamientoYReglas from '../Components/FormSalon/Equipamiento&Reglas/EquipamientoYReglas';
import Disponibilidad from '../Components/FormSalon/Disponibilidad/Disponibilidad';
import Resumen from '../Components/FormSalon/Resumen/Resumen';

const NuevoSalonScreen = () => {
  // Se realizara todo en una sola pantalla, se cambiara el componente segun el paso actual
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_por_hora: "",
    capacidad: 1
  })
  const [photos, setPhotos] = useState([]);
  const [reglas, setReglas] = useState([]);
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([
    { dia: "Lunes", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Martes", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Miercoles", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Jueves", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Viernes", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Sábado", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Domingo", disponible: false, desde: "08:00", hasta: "08:00" },
  ]);


  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handlePhotoChange = (e) => {
    // Convertimos el FileList a un array.
    const files = Array.from(e.target.files);

    // Validamos que no se exceda el límite de 5 fotos.
    if (photos.length + files.length > 5) {
      alert("No puedes seleccionar más de 5 fotos en total.");
      return;
    }

    // Añadimos las nuevas fotos a las ya existentes.
    setPhotos(prevPhotos => [...prevPhotos, ...files]);
  };

  // Función para eliminar una foto del array.
  const removePhoto = (indexToRemove) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, index) => index !== indexToRemove));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className='form-full-screen'>
      <div className="stepper">
        <div className={`step ${step >= 1 ? "active" : ""}`}>General</div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>Ubicacion</div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>Precio y Capacidad</div>
        <div className={`step ${step >= 4 ? "active" : ""}`}>Reglas y Equipamiento</div>
        <div className={`step ${step >= 5 ? "active" : ""}`}>Disponibilidad</div>
        <div className={`step ${step >= 6 ? "active" : ""}`}>Resumen</div>
      </div>

      <div className="form-content">
        {
          step == 1 && <General salon={formData} photos={photos} handleChange={handleChange} handlePhotoChange={handlePhotoChange} removePhoto={removePhoto} />
        }

        {
          step == 2 && <Ubicacion />
        }

        {
          step == 3 && <PrecioYCapacidad handleChange={handleChange} salon={formData} />
        }

        {
          step == 4 && <EquipamientoYReglas equipamientoSeleccionado={equipamientoSeleccionado} reglas={reglas} setEquipamientoSeleccionado={setEquipamientoSeleccionado} setReglas={setReglas} />
        }

        {
          step == 5 && (
            <Disponibilidad
              disponibilidad={disponibilidad}
              setDisponibilidad={setDisponibilidad}
            />
          )
        }

        {
          step == 6 && (
            <Resumen
              formData={formData}
              reglas={reglas}
              equipamientoSeleccionado={equipamientoSeleccionado}
              photos={photos}
              disponibilidad={disponibilidad}
            />
          )
        }


      </div>

      <div className="navigation-buttons">
        {step > 1 && (
          <button onClick={handleBack} disabled={loading} className="btn-back">
            Atrás
          </button>
        )}
        {step < 6 && (
          <button onClick={handleNext} disabled={loading} className="btn-next">
            Siguiente
          </button>
        )}
        {step === 6 && (
          <button
            disabled={loading}
            className="btn-publish"
          >
            Publicar Evento
          </button>
        )}
      </div>
    </div>
  )
}

export default NuevoSalonScreen
