import React, { useEffect, useState } from 'react'
import General from '../Components/FormSalon/General/General';
import '../styles/NuevoSalonScreen.css'
import Ubicacion from '../Components/FormSalon/Ubicacion/Ubicacion';
import PrecioYCapacidad from '../Components/FormSalon/Precio&Capacidad/PrecioYCapacidad';
import EquipamientoYReglas from '../Components/FormSalon/Equipamiento&Reglas/EquipamientoYReglas';
import Disponibilidad from '../Components/FormSalon/Disponibilidad/Disponibilidad';
import Resumen from '../Components/FormSalon/Resumen/Resumen';
import { AgregarSalon } from '../utils/FuncionesSalon';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { createSalon, resetSalonStatus } from '../store/features/salones/salonSlice';

const NuevoSalonScreen = ({ isLoaded }) => {
  // Se realizara todo en una sola pantalla, se cambiara el componente segun el paso actual
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Leemos el estado del slice de salones y del usuario logueado
  const { status: salonStatus } = useSelector((state) => state.salones);
  const { user: usuarioLogueado } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_por_hora: "",
    capacidad: 1,
    direccion: "",
    latitud: null,
    longitud: null,
    estado: "borrador",
    granularidad_minutos: 60, // Por defecto, franjas de 1 hora
    horizonte_meses: 6,
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

  useEffect(() => {
    // Esto asegura que si el usuario sale y vuelve a entrar, no vea un mensaje de éxito/error antiguo.
    return () => {
      dispatch(resetSalonStatus());
    };
  }, [dispatch]);


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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value ?? "",
    }));
  };

  // --- NUEVA FUNCIÓN PARA PUBLICAR ---
  const handlePublish = async () => {
    if (!usuarioLogueado) {
      Swal.fire('Error', 'Debes iniciar sesión para publicar un salón.', 'error');
      return;
    }

    // Validación (la que tenías en FuncionesSalon.js)
    if (!formData.nombre || !formData.descripcion || !formData.precio_por_hora || !formData.capacidad || !formData.direccion || photos.length < 1) {
        Swal.fire('Campos incompletos', 'Debes completar todos los campos obligatorios (Nombre, Descripción, Precio, Capacidad, Dirección y al menos una foto).', 'warning');
        return;
    }

    const disponibilidadesActivas = disponibilidad
        .filter(d => d.disponible)
        .map(d => ({ dia_semana: d.dia, hora_inicio: d.desde, hora_fin: d.hasta }));

    const salonPayload = {
      ...formData,
      granularidad_minutos: parseInt(formData.granularidad_minutos),
      horizonte_meses: parseInt(formData.horizonte_meses),
      precio_por_hora: parseFloat(formData.precio_por_hora),
      capacidad: parseInt(formData.capacidad, 10),
      reglas,
      equipamientos: equipamientoSeleccionado,
      disponibilidades: disponibilidadesActivas,
      id_publicador: usuarioLogueado.id_usuario, // <-- ID del usuario logueado
    };
    

    const resultAction = await dispatch(createSalon({ salonData: salonPayload, photos }));
    console.log(resultAction);
    

    if (createSalon.fulfilled.match(resultAction)) {
      Swal.fire('¡Publicado!', 'Tu salón ha sido enviado para revisión.', 'success');
      navigate('/mis-salones'); // Redirigir a la lista de sus salones
    } else {
      console.log(resultAction);
      
      Swal.fire('Error', resultAction.payload || 'Ocurrió un error al publicar.', 'error');
    }
  };

  const isLoading = salonStatus === 'loading';


  useEffect(() => {
    console.log(formData);

  }, [formData])

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

      <div className="navigation-buttons">
        {step > 1 && <button onClick={handleBack} disabled={isLoading} className="btn-back">Atrás</button>}
        {step < 6 && <button onClick={handleNext} disabled={isLoading} className="btn-next">Siguiente</button>}
        {step === 6 && (
          <button onClick={handlePublish} disabled={isLoading} className="btn-publish">
            {isLoading ? 'Publicando...' : 'Publicar'}
          </button>
        )}
      </div>

      <div className="form-content">
       { step == 1 && <General salon={formData} photos={photos} handleChange={handleChange} handlePhotoChange={handlePhotoChange} removePhoto={removePhoto} /> }

        {
          step == 2 && <Ubicacion isLoaded={isLoaded} salon={formData} handleChange={handleChange} />
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
              formData={formData}      // <-- Prop necesaria para leer los valores
              handleChange={handleChange} // <-- Prop necesaria para actualizarlos
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


    </div>
  )
}

export default NuevoSalonScreen
