import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSalonById, updateSalon, resetSalonStatus } from '../store/features/salones/salonSlice';
import Swal from 'sweetalert2';

// Importa los componentes del formulario
import General from '../Components/FormSalon/General/General';
import Ubicacion from '../Components/FormSalon/Ubicacion/Ubicacion';
import PrecioYCapacidad from '../Components/FormSalon/Precio&Capacidad/PrecioYCapacidad';
import EquipamientoYReglas from '../Components/FormSalon/Equipamiento&Reglas/EquipamientoYReglas';
import Disponibilidad from '../Components/FormSalon/Disponibilidad/Disponibilidad';
import Resumen from '../Components/FormSalon/Resumen/Resumen';

// Importa los estilos (reutilizados)
import '../styles/NuevoSalonScreen.css';

// Importar Steps de Ant Design
import { Steps } from 'antd';

const EditarSalonScreen = ({ isLoaded }) => {
    const { id: salonId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedSalon, status, error } = useSelector((state) => state.salones);
    const { user } = useSelector((state) => state.auth);

    // Estado para Ant Design Steps
    const [current, setCurrent] = useState(0); // Índice del paso actual (0-5)
    // En edición, asumimos completados para permitir navegación inicial
    const [maxStepCompleted, setMaxStepCompleted] = useState(0); // Se seteará a 5 al cargar datos

    // Estados del formulario
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
    const [currentPhotos, setCurrentPhotos] = useState([]); // { url: string, public_id?: string }[]
    const [newPhotos, setNewPhotos] = useState([]); // File[]
    const [photosToDelete, setPhotosToDelete] = useState([]); // string[] (public_ids)
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

    const isLoading = status === 'loading'; // Para deshabilitar botones

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

    // Rellenar el estado del formulario cuando los datos del salón se cargan
    useEffect(() => {
        if (selectedSalon && selectedSalon.id_salon === parseInt(salonId)) {
            // Verificar permisos
            if (user?.id_usuario !== selectedSalon.publicador?.id_usuario /* && !user?.es_administrador */) {
                Swal.fire('Acceso Denegado', 'No tienes permiso para editar este salón.', 'error');
                navigate('/mis-salones');
                return;
            }

            // Rellenar formData
            setFormData({
                nombre: selectedSalon.nombre || "",
                descripcion: selectedSalon.descripcion || "",
                precio_por_hora: selectedSalon.precio_por_hora || "",
                capacidad: selectedSalon.capacidad || 1,
                direccion: selectedSalon.direccion || "",
                latitud: selectedSalon.latitud || null,
                longitud: selectedSalon.longitud || null,
                granularidad_minutos: selectedSalon.granularidad_minutos || 60,
                horizonte_meses: selectedSalon.horizonte_meses || 6,
            });

            // Rellenar fotos, reglas, equipamiento
            setCurrentPhotos(selectedSalon.fotos?.map(url => ({ url, public_id: extraerPublicIdDeUrl(url) })) || []);
            setReglas(selectedSalon.reglas || []);
            setEquipamientoSeleccionado(selectedSalon.equipamientos || []);

            console.log("Viendo salon",selectedSalon);
            

            // Rellenar disponibilidad
            if (selectedSalon.disponibilidades && selectedSalon.disponibilidades.length > 0) {
                const initialDisponibilidad = disponibilidad.map(d => {
                    const match = selectedSalon.disponibilidades.find(sd => sd.dia_semana === d.dia);
                    const desde = match?.hora_inicio ? match.hora_inicio.substring(0, 5) : "08:00";
                    const hasta = match?.hora_fin ? match.hora_fin.substring(0, 5) : "08:00";
                    return match ? { ...d, disponible: true, desde, hasta } : d;
                });
                setDisponibilidad(initialDisponibilidad);
            } else {
                setDisponibilidad(disponibilidad.map(d => ({ ...d, disponible: false, desde: "08:00", hasta: "08:00" })));
            }

            // Resetear cambios pendientes y marcar todos los pasos como accesibles
            setNewPhotos([]);
            setPhotosToDelete([]);
            setMaxStepCompleted(5); // <-- Marcar todos los pasos como completados/accesibles
            setCurrent(0); // Opcional: empezar siempre en el primer paso al cargar
        }
    }, [selectedSalon, salonId, user, navigate]); // Dependencias

    // Función auxiliar para extraer public_id (AJUSTAR SI ES NECESARIO)
    const extraerPublicIdDeUrl = (url = "") => {
        try {
            const parts = url.split('/upload/');
            if (parts.length < 2) return null;
            const versionAndPath = parts[1];
            const pathWithoutVersion = versionAndPath.includes('/') ? versionAndPath.substring(versionAndPath.indexOf('/') + 1) : versionAndPath;
            const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.')) || pathWithoutVersion;
            return publicId || null;
        } catch (e) {
            console.error("Error extrayendo public_id:", e, "URL:", url);
            return null;
        }
    };

    // Lógica de navegación para Ant Design Steps
    const handleNext = () => {
        setCurrent((prev) => prev + 1);
        // No actualizamos maxStepCompleted aquí
    };
    const handleBack = () => {
        setCurrent((prev) => prev - 1);
    };
    const goTo = (stepIndex) => {
        // Permitir ir a cualquier paso en modo edición
        setCurrent(stepIndex);
    };

    // Manejadores del formulario
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
            if (photoToRemove.public_id) {
                if (!photosToDelete.includes(photoToRemove.public_id)) {
                    setPhotosToDelete(prev => [...prev, photoToRemove.public_id]);
                }
            } else {
                console.warn("No se pudo obtener el public_id:", photoToRemove.url);
                Swal.fire('Advertencia', 'No se pudo identificar esta imagen para eliminarla del servidor.', 'warning');
            }
            setCurrentPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
        } else {
            setNewPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
        }
    };

    // Función para guardar los cambios
    const handleSave = async () => {
        // Validaciones
        if (!formData.nombre || !formData.descripcion || !formData.precio_por_hora || !formData.capacidad || !formData.direccion) {
            Swal.fire('Campos incompletos', 'Revisa los campos obligatorios.', 'warning');
            return;
        }
        if (currentPhotos.length + newPhotos.length === 0) { // Validar fotos restantes
             Swal.fire('Faltan Fotos', 'Debes tener al menos una foto.', 'warning');
             return;
        }

        // Preparar datos
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
            disponibilidad: disponibilidadesActivas,
        };

        const dataToSend = new FormData();
        dataToSend.append('salonData', JSON.stringify(salonDataToUpdate));
        newPhotos.forEach(file => dataToSend.append('files', file));
        dataToSend.append('photosToDelete', JSON.stringify(photosToDelete));

        console.log("Enviando actualización:", { salonData: salonDataToUpdate, photosToDelete, newPhotosCount: newPhotos.length });

        // Dispatch de la acción
        const resultAction = await dispatch(updateSalon({ salonId: parseInt(salonId), formData: dataToSend }));

        if (updateSalon.fulfilled.match(resultAction)) {
            Swal.fire('¡Guardado!', 'Los cambios han sido guardados.', 'success');
            navigate('/mis-salones');
        } else {
            Swal.fire('Error', resultAction.payload || 'No se pudieron guardar los cambios.', 'error');
            console.error("Error al guardar:", resultAction.payload);
        }
    };

    // Definición de pasos para Ant Design
    const stepsItems = [
        { title: "General" },
        { title: 'Ubicacion' },
        { title: 'Precio y Capacidad' },
        { title: 'Reglas y Equipamiento' },
        { title: 'Disponibilidad' },
        { title: 'Resumen' },
    ];

    // Renderizado condicional inicial
    if (status === 'loading' && !selectedSalon) {
        return <div className='form-full-screen'><h1>Cargando datos del salón...</h1></div>;
    }
    if (status === 'failed' && !selectedSalon) {
        return <div className='form-full-screen'><h1>Error al cargar</h1><p>{error}</p></div>;
    }
    if (!selectedSalon && status !== 'idle' && status !== 'loading') {
         return <div className='form-full-screen'><h1>Salón no encontrado</h1></div>;
    }
    // Añadir una comprobación explícita para el estado idle sin salón (puede ocurrir brevemente)
    if (!selectedSalon && status === 'idle') {
       return <div className='form-full-screen'><h1>Inicializando...</h1></div>; // O simplemente null
    }

    // Renderizado del contenido del paso actual
    const renderStepContent = () => {
        switch (current) {
            case 0: return <General salon={formData} currentPhotos={currentPhotos} newPhotos={newPhotos} handleChange={handleChange} handlePhotoChange={handlePhotoChange} removePhoto={removePhoto} />;
            case 1: return <Ubicacion isLoaded={isLoaded} salon={formData} handleChange={handleChange} />;
            case 2: return <PrecioYCapacidad salon={formData} handleChange={handleChange} />;
            case 3: return <EquipamientoYReglas reglas={reglas} setReglas={setReglas} equipamientoSeleccionado={equipamientoSeleccionado} setEquipamientoSeleccionado={setEquipamientoSeleccionado} />;
            case 4: return <Disponibilidad disponibilidad={disponibilidad} setDisponibilidad={setDisponibilidad} formData={formData} handleChange={handleChange} />;
            case 5: return <Resumen formData={formData} reglas={reglas} equipamientoSeleccionado={equipamientoSeleccionado} photos={[...currentPhotos, ...newPhotos]} disponibilidad={disponibilidad} />;
            default: return null;
        }
    };

    return (
        <div className='form-full-screen'>
            {/* Componente Steps de Ant Design */}
            <Steps
                current={current}
                onChange={goTo}
                className="stepper-antd" // Aplicar la clase personalizada
                items={stepsItems.map((item, index) => ({
                    key: item.title,
                    title: item.title,
                    // En edición, todos los pasos son clickables una vez cargados los datos
                    disabled: false // Siempre habilitado en modo edición
                }))}
            />

            {/* Botones de Navegación */}
            <div className="navigation-buttons">
                {current > 0 && <button onClick={handleBack} disabled={isLoading} className="btn-back">Atrás</button>}
                {current < stepsItems.length - 1 && <button onClick={handleNext} disabled={isLoading} className="btn-next">Siguiente</button>}
                {current === stepsItems.length - 1 && (
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