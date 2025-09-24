import React, { useState } from 'react'
import General from '../Components/FormSalon/General/General';
import '../styles/NuevoSalonScreen.css'
import Ubicacion from '../Components/FormSalon/Ubicacion/Ubicacion';

const NuevoSalonScreen = () => {
    // Se realizara todo en una sola pantalla, se cambiara el componente segun el paso actual
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
    })
    const [photos, setPhotos] = useState([]);

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
          step == 1 && <General  salon={formData} photos={photos} handleChange={handleChange} handlePhotoChange={handlePhotoChange} removePhoto={removePhoto}/>
        }

        {
          step == 2 && <Ubicacion/>
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
