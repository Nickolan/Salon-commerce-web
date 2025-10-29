import React, { useEffect, useState } from 'react';
import General from '../Components/FormSalon/General/General';
import '../styles/NuevoSalonScreen.css';
import Ubicacion from '../Components/FormSalon/Ubicacion/Ubicacion';
import PrecioYCapacidad from '../Components/FormSalon/Precio&Capacidad/PrecioYCapacidad';
import EquipamientoYReglas from '../Components/FormSalon/Equipamiento&Reglas/EquipamientoYReglas';
import Disponibilidad from '../Components/FormSalon/Disponibilidad/Disponibilidad';
import Resumen from '../Components/FormSalon/Resumen/Resumen';
// import { AgregarSalon } from '../utils/FuncionesSalon'; // Probablemente ya no lo uses
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createSalon, resetSalonStatus } from '../store/features/salones/salonSlice';

// 👇 Importar Steps de Ant Design
import { Steps } from 'antd';

// ❌ Ya no necesitas estos
// const { Step } = Steps;
// const { Panel } = Collapse;

const NuevoSalonScreen = ({ isLoaded }) => {
  // 👇 Cambiamos 'step' (1-6) por 'current' (0-5) para Ant Design
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false); // Mantener loading si lo usas
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status: salonStatus } = useSelector((state) => state.salones);
  const { user: usuarioLogueado } = useSelector((state) => state.auth);

  // Estados del formulario (sin cambios)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio_por_hora: "",
    capacidad: 1,
    direccion: "",
    latitud: null,
    longitud: null,
    estado: "borrador",
    granularidad_minutos: 60,
    horizonte_meses: 6,
  });
  const [photos, setPhotos] = useState([]);
  const [reglas, setReglas] = useState([]);
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState([
    { dia: "Lunes", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Martes", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Miércoles", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Jueves", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Viernes", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Sábado", disponible: false, desde: "08:00", hasta: "08:00" },
    { dia: "Domingo", disponible: false, desde: "08:00", hasta: "08:00" },
  ]);

  // 👇 Estado para saber hasta qué paso se ha llegado (para habilitar clics)
  const [maxStepCompleted, setMaxStepCompleted] = useState(0);

  // useEffect para resetear estado (sin cambios)
  useEffect(() => {
    return () => {
      dispatch(resetSalonStatus());
    };
  }, [dispatch]);

  // 👇 Lógica de navegación actualizada
  const handleNext = () => {
    const nextStep = current + 1;
    setCurrent(nextStep);
    // Actualiza el paso máximo completado si avanzamos a un nuevo paso
    if (nextStep > maxStepCompleted) {
      setMaxStepCompleted(nextStep);
    }
  };

  const handleBack = () => {
    setCurrent((prev) => prev - 1);
  };

  // 👇 Función para ir a un paso específico (llamada por Steps onChange)
  const goTo = (stepIndex) => {
    // Solo permite ir si el paso ya fue visitado o es el siguiente inmediato
    if (stepIndex <= maxStepCompleted) {
      setCurrent(stepIndex);
    }
  };
  // ------------------------------

  // Funciones handleChange, handlePhotoChange, removePhoto (sin cambios)
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      Swal.fire('Límite Excedido', 'No puedes tener más de 5 fotos en total.', 'warning'); // Usar Swal
      return;
    }
    setPhotos(prevPhotos => [...prevPhotos, ...files]);
  };

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
  // ----------------------------------------------------

  // Función handlePublish (sin cambios en la lógica interna)
  const handlePublish = async () => {
    if (!usuarioLogueado) {
      Swal.fire('Error', 'Debes iniciar sesión para publicar un salón.', 'error');
      return;
    }
    if (!formData.nombre || !formData.descripcion || !formData.precio_por_hora || !formData.capacidad || !formData.direccion || photos.length < 1) {
      Swal.fire('Campos incompletos', 'Revisa los campos obligatorios (Nombre, Descripción, Precio, Capacidad, Dirección y al menos una foto).', 'warning');
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
      disponibilidad: disponibilidadesActivas, // <-- DUPLICADO, QUITAR
      id_publicador: usuarioLogueado.id_usuario,
    };

    const resultAction = await dispatch(createSalon({ salonData: salonPayload, photos }));

    if (createSalon.fulfilled.match(resultAction)) {
      Swal.fire('¡Publicado!', 'Tu salón ha sido enviado para revisión.', 'success');
      //navigate('/mis-salones'); // Redirigir
    } else {
      Swal.fire('Error', resultAction.payload || 'Ocurrió un error al publicar.', 'error');
    }
  };

  const isLoading = salonStatus === 'loading';

  // useEffects para logs (sin cambios)
  useEffect(() => { console.log("FormData:", formData); }, [formData]);
  useEffect(() => { console.log("Disponibilidad:", disponibilidad); }, [disponibilidad]);

  // 👇 Definición de los pasos para Ant Design
  const stepsItems = [
    { title: "General" },
    { title: 'Ubicacion' },
    { title: 'Precio y Capacidad' },
    { title: 'Reglas y Equipamiento' },
    { title: 'Disponibilidad' },
    { title: 'Resumen' },
  ];
  // ------------------------------------

  // 👇 Lógica para renderizar el contenido del paso actual (basado en 'current')
  const renderStepContent = () => {
    switch (current) { // Usamos 'current' (0-5)
      case 0: // General
        return <General salon={formData} photos={photos} handleChange={handleChange} handlePhotoChange={handlePhotoChange} removePhoto={removePhoto} />;
      case 1: // Ubicacion
        return <Ubicacion isLoaded={isLoaded} salon={formData} handleChange={handleChange} />;
      case 2: // Precio y Capacidad
        return <PrecioYCapacidad handleChange={handleChange} salon={formData} />;
      case 3: // Reglas y Equipamiento
        return <EquipamientoYReglas equipamientoSeleccionado={equipamientoSeleccionado} reglas={reglas} setEquipamientoSeleccionado={setEquipamientoSeleccionado} setReglas={setReglas} />;
      case 4: // Disponibilidad
        return <Disponibilidad disponibilidad={disponibilidad} setDisponibilidad={setDisponibilidad} formData={formData} handleChange={handleChange} />;
      case 5: // Resumen
        return <Resumen formData={formData} reglas={reglas} equipamientoSeleccionado={equipamientoSeleccionado} photos={photos} disponibilidad={disponibilidad} />;
      default:
        return null;
    }
  };
  // ------------------------------------------------------------------------

  return (
    <div className='form-full-screen'>

      {/* 👇 Componente Steps de Ant Design */}
      <Steps
        current={current} // El índice del paso actual (0-5)
        onChange={goTo}   // Función que se llama al hacer clic en un paso
        className="stepper-antd" // Clase CSS opcional para estilos personalizados
        // items es la forma recomendada en antd v5+
        items={stepsItems.map((item, index) => ({
             key: item.title,
             title: item.title,
             disabled: index > maxStepCompleted // Deshabilita clics en pasos futuros
        }))}
      />
      {/* ------------------------------- */}

      {/* ❌ Eliminamos el stepper antiguo */}
      {/* <div className="stepper"> ... </div> */}

      {/* Botones de Navegación (lógica actualizada) */}
      <div className="navigation-buttons">
        {current > 0 && <button onClick={handleBack} disabled={isLoading} className="btn-back">Atrás</button>}
        {current < stepsItems.length - 1 && <button onClick={handleNext} disabled={isLoading} className="btn-next">Siguiente</button>}
        {current === stepsItems.length - 1 && (
          <button onClick={handlePublish} disabled={isLoading} className="btn-publish">
            {isLoading ? 'Publicando...' : 'Publicar'}
          </button>
        )}
      </div>

      {/* Contenido del paso actual (sin cambios) */}
      <div className="form-content">
        {renderStepContent()}
      </div>

    </div>
  );
};

export default NuevoSalonScreen;