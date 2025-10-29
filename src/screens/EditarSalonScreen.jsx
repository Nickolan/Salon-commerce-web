import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSalonById, updateSalon, resetSalonStatus } from '../store/features/salones/salonSlice';
import Swal from 'sweetalert2';

// Importa los componentes del formulario (asegúrate que las rutas sean correctas)
import General from '../Components/FormSalon/General/General';
import Ubicacion from '../Components/FormSalon/Ubicacion/Ubicacion';
import PrecioYCapacidad from '../Components/FormSalon/Precio&Capacidad/PrecioYCapacidad';
import EquipamientoYReglas from '../Components/FormSalon/Equipamiento&Reglas/EquipamientoYReglas';
import Disponibilidad from '../Components/FormSalon/Disponibilidad/Disponibilidad';
import Resumen from '../Components/FormSalon/Resumen/Resumen';

// Importa los estilos (asegúrate que la ruta sea correcta)
import '../styles/NuevoSalonScreen.css'; // Reutilizamos estilos de NuevoSalonScreen

const EditarSalonScreen = ({ isLoaded }) => {
    const { id: salonId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedSalon, status, error } = useSelector((state) => state.salones);
    const { user } = useSelector((state) => state.auth);

    // Estado inicial del formulario (vacío, se llenará con datos del salón)
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio_por_hora: "",
        capacidad: 1,
        direccion: "",
        latitud: null,
        longitud: null,
        granularidad_minutos: 60,
        horizonte_meses: 6,
    });
    // Estado para manejar las fotos
    const [currentPhotos, setCurrentPhotos] = useState([]); // { url: string, public_id?: string }[]
    const [newPhotos, setNewPhotos] = useState([]); // File[]
    const [photosToDelete, setPhotosToDelete] = useState([]); // string[] (public_ids)

    // Estado para reglas, equipamiento y disponibilidad
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

    // Estado para el stepper (si lo usas)
    const [step, setStep] = useState(1);
    const isLoading = status === 'loading'; // Para deshabilitar botones mientras carga/guarda

    // Cargar datos del salón al montar el componente
    useEffect(() => {
        if (salonId) {
            dispatch(fetchSalonById(salonId));
        }
        // Limpiar el estado de Redux al desmontar
        return () => {
            dispatch(resetSalonStatus());
        };
    }, [salonId, dispatch]);

    // Rellenar el estado del formulario cuando los datos del salón se cargan desde Redux
    useEffect(() => {
        // Asegúrate que el salón cargado coincida con el ID de la URL
        if (selectedSalon && selectedSalon.id_salon === parseInt(salonId)) {
            // Verificar si el usuario actual es el publicador (o admin, si aplica)
            if (user?.id_usuario !== selectedSalon.publicador?.id_usuario /* && !user?.es_administrador */ ) {
                 Swal.fire('Acceso Denegado', 'No tienes permiso para editar este salón.', 'error');
                 navigate('/mis-salones'); // O a donde corresponda
                 return;
            }

            setFormData({
                nombre: selectedSalon.nombre || "",
                descripcion: selectedSalon.descripcion || "",
                precio_por_hora: selectedSalon.precio_por_hora || "",
                capacidad: selectedSalon.capacidad || 1,
                direccion: selectedSalon.direccion || "", // Usar 'direccion'
                latitud: selectedSalon.latitud || null,
                longitud: selectedSalon.longitud || null,
                granularidad_minutos: selectedSalon.granularidad_minutos || 60,
                horizonte_meses: selectedSalon.horizonte_meses || 6,
            });

            // Asumiendo que selectedSalon.fotos es string[] (URLs)
            // Necesitarás adaptar esto si guardas objetos { url, public_id }
            setCurrentPhotos(selectedSalon.fotos?.map(url => ({ url, public_id: extraerPublicIdDeUrl(url) })) || []);
            setReglas(selectedSalon.reglas || []);
            setEquipamientoSeleccionado(selectedSalon.equipamientos || []);

            // Rellenar disponibilidad
            if (selectedSalon.disponibilidades && selectedSalon.disponibilidades.length > 0) {
                const initialDisponibilidad = disponibilidad.map(d => {
                    const match = selectedSalon.disponibilidades.find(sd => sd.dia_semana === d.dia);
                    // Asegurarse de formatear HH:mm
                    const desde = match?.hora_inicio ? match.hora_inicio.substring(0, 5) : "08:00";
                    const hasta = match?.hora_fin ? match.hora_fin.substring(0, 5) : "08:00";
                    return match ? { ...d, disponible: true, desde, hasta } : d;
                });
                setDisponibilidad(initialDisponibilidad);
            } else {
                 // Resetear si no hay disponibilidades guardadas
                setDisponibilidad(disponibilidad.map(d => ({...d, disponible: false, desde: "08:00", hasta: "08:00"})));
            }

            // Resetear fotos nuevas y a borrar al cargar datos nuevos
            setNewPhotos([]);
            setPhotosToDelete([]);
        }
    }, [selectedSalon, salonId, user, navigate]); // Dependencias importantes

    // --- Funciones auxiliares y manejadores ---

    // Función auxiliar para intentar extraer public_id de URL de Cloudinary
    // ¡AJUSTA ESTO A TU ESTRUCTURA DE URLS!
    const extraerPublicIdDeUrl = (url = "") => {
        try {
            const parts = url.split('/upload/');
            if (parts.length < 2) return null; // No parece una URL de Cloudinary válida
            const versionAndPath = parts[1];
            // Quita la versión (ej. v1234567/) si existe
            const pathWithoutVersion = versionAndPath.includes('/') ? versionAndPath.substring(versionAndPath.indexOf('/') + 1) : versionAndPath;
            // Quita la extensión del archivo
            const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.')) || pathWithoutVersion;
            return publicId || null;
        } catch (e) {
            console.error("Error extrayendo public_id:", e, "URL:", url);
            return null; // Devuelve null si falla
        }
    };


    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value ?? "",
        }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        const currentTotal = currentPhotos.length + newPhotos.length - photosToDelete.length;
        if (currentTotal + files.length > 5) {
            Swal.fire('Límite Excedido', 'No puedes tener más de 5 fotos en total.', 'warning');
            return;
        }
        setNewPhotos(prev => [...prev, ...files]);
    };

    const removePhoto = (indexToRemove, isExisting) => {
        if (isExisting) {
            const photoToRemove = currentPhotos[indexToRemove];
            // Usamos el public_id que extrajimos al cargar
            if (photoToRemove.public_id) {
                // Solo añadir a borrar si no estaba ya añadido (evita duplicados)
                if (!photosToDelete.includes(photoToRemove.public_id)) {
                    setPhotosToDelete(prev => [...prev, photoToRemove.public_id]);
                }
            } else {
                console.warn("No se pudo obtener el public_id para borrar la imagen:", photoToRemove.url);
                 // Opcional: mostrar alerta al usuario
                 Swal.fire('Advertencia', 'No se pudo identificar esta imagen para eliminarla del servidor. Se quitará de la vista previa.', 'warning');
            }
            // Quitar de la vista previa de fotos actuales
            setCurrentPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
        } else {
            // El índice para newPhotos es relativo a su propio array
            setNewPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
        }
    };


    const handleSave = async () => {
        // Validaciones básicas (puedes añadir más)
        if (!formData.nombre || !formData.descripcion || !formData.precio_por_hora || !formData.capacidad || !formData.direccion) {
            Swal.fire('Campos incompletos', 'Revisa los campos obligatorios (Nombre, Descripción, Precio, Capacidad, Dirección).', 'warning');
            return;
        }
        if (currentPhotos.length + newPhotos.length - photosToDelete.length === 0) {
             Swal.fire('Faltan Fotos', 'Debes tener al menos una foto para el salón.', 'warning');
             return;
        }


        const disponibilidadesActivas = disponibilidad
            .filter(d => d.disponible)
            .map(d => ({ dia_semana: d.dia, hora_inicio: d.desde, hora_fin: d.hasta }));

        const salonDataToUpdate = {
            ...formData,
            precio_por_hora: parseFloat(formData.precio_por_hora) || 0,
            capacidad: parseInt(formData.capacidad, 10) || 1,
            granularidad_minutos: parseInt(formData.granularidad_minutos, 10) || 60,
            horizonte_meses: parseInt(formData.horizonte_meses, 10) || 6,
            reglas,
            equipamientos: equipamientoSeleccionado,
            disponibilidades: disponibilidadesActivas,
        };

        // Creamos el FormData para enviar todo junto
        const dataToSend = new FormData();
        dataToSend.append('salonData', JSON.stringify(salonDataToUpdate));
        newPhotos.forEach(file => {
            dataToSend.append('files', file); // Clave 'files'
        });
        // Enviamos los public_ids a borrar como un array JSON stringificado
        dataToSend.append('photosToDelete', JSON.stringify(photosToDelete));

        console.log("Enviando actualización con:", { salonData: salonDataToUpdate, photosToDelete, newPhotosCount: newPhotos.length }); // Log para depurar

        const resultAction = await dispatch(updateSalon({ salonId: parseInt(salonId), formData: dataToSend }));

        if (updateSalon.fulfilled.match(resultAction)) {
            Swal.fire('¡Guardado!', 'Los cambios en tu salón han sido guardados.', 'success');
            navigate('/mis-salones');
        } else {
            Swal.fire('Error', resultAction.payload || 'No se pudieron guardar los cambios.', 'error');
            console.error("Error al guardar:", resultAction.payload);
        }
    };

    // --- Renderizado Condicional ---
    if (status === 'loading' && !selectedSalon) { // Muestra carga solo la primera vez
        return <div className='form-full-screen'><h1>Cargando datos del salón...</h1></div>;
    }
    if (status === 'failed' && !selectedSalon) {
        return <div className='form-full-screen'><h1>Error al cargar</h1><p>{error}</p></div>;
    }
    // Si no hay salón seleccionado después de cargar (raro, pero posible)
    if (!selectedSalon && status !== 'idle' && status !== 'loading') {
         return <div className='form-full-screen'><h1>Salón no encontrado</h1></div>;
    }
    // Si el salón aún no se ha cargado (estado inicial 'idle')
     if (!selectedSalon && status === 'idle') {
        return <div className='form-full-screen'><h1>Inicializando...</h1></div>; // O null
     }


    // --- Renderizado del Formulario por Pasos ---
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <General
                           salon={formData}
                           // Pasamos ambas listas de fotos y la función remove adaptada
                           photos={[...currentPhotos.map(p => p.url), ...newPhotos.map(f => URL.createObjectURL(f))]} // URLs para preview
                           // Modificamos cómo pasamos las fotos al componente General si es necesario
                           // O adaptar General para manejar currentPhotos y newPhotos por separado
                           currentPhotos={currentPhotos} // Podrías pasar estas props si adaptas General
                           newPhotos={newPhotos}       // Podrías pasar estas props si adaptas General
                           handleChange={handleChange}
                           handlePhotoChange={handlePhotoChange}
                           removePhoto={removePhoto} // La nueva función removePhoto
                       />;
            case 2:
                return <Ubicacion isLoaded={isLoaded} salon={formData} handleChange={handleChange} />;
            case 3:
                return <PrecioYCapacidad salon={formData} handleChange={handleChange} />;
            case 4:
                return <EquipamientoYReglas
                           reglas={reglas}
                           setReglas={setReglas}
                           equipamientoSeleccionado={equipamientoSeleccionado}
                           setEquipamientoSeleccionado={setEquipamientoSeleccionado}
                       />;
            case 5:
                return <Disponibilidad
                           disponibilidad={disponibilidad}
                           setDisponibilidad={setDisponibilidad}
                           formData={formData}
                           handleChange={handleChange}
                       />;
            case 6:
                return <Resumen
                           formData={formData}
                           reglas={reglas}
                           equipamientoSeleccionado={equipamientoSeleccionado}
                           photos={[...currentPhotos.map(p => p.url), ...newPhotos]} // Mezcla URLs existentes y Files nuevos
                           disponibilidad={disponibilidad}
                       />;
            default:
                return null;
        }
    };

    return (
        <div className='form-full-screen'>
            {/* Stepper (igual que en NuevoSalonScreen) */}
            <div className="stepper">
                <div className={`step ${step >= 1 ? "active" : ""}`}>General</div>
                <div className={`step ${step >= 2 ? "active" : ""}`}>Ubicacion</div>
                <div className={`step ${step >= 3 ? "active" : ""}`}>Precio y Capacidad</div>
                <div className={`step ${step >= 4 ? "active" : ""}`}>Reglas y Equipamiento</div>
                <div className={`step ${step >= 5 ? "active" : ""}`}>Disponibilidad</div>
                <div className={`step ${step >= 6 ? "active" : ""}`}>Resumen</div>
            </div>

            {/* Botones de Navegación (igual, pero el último es "Guardar") */}
            <div className="navigation-buttons">
                {step > 1 && <button onClick={handleBack} disabled={isLoading} className="btn-back">Atrás</button>}
                {step < 6 && <button onClick={handleNext} disabled={isLoading} className="btn-next">Siguiente</button>}
                {step === 6 && (
                    <button onClick={handleSave} disabled={isLoading} className="btn-publish">
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                )}
            </div>

            {/* Contenido del paso actual */}
            <div className="form-content">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default EditarSalonScreen;