import React, { useState, useEffect } from 'react'; // 👈 1. Importar useEffect
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'; // 👈 2. Importar hooks
import { fetchMySalones, updateSalonStatusAdmin } from '../store/features/salones/salonSlice'; // 👈 3. Importar thunk
import BarraBusqueda from '../Components/BarraBusqueda/BarraBusqueda';
import "../styles/MisSalonesScreen.css";
import { FiEdit, FiXCircle, FiUsers, FiMapPin, FiDollarSign } from "react-icons/fi";
import ItemMiSalon from '../Components/ItemMiSalon/ItemMiSalon';
import Swal from 'sweetalert2'

const SalonStatus = {
    OCULTA: 'oculta',
    BORRADOR: 'borrador',
    APROBADA: 'aprobada',
    RECHAZADA: 'rechazada'
};


const MisSalonesScreen = () => {
    const dispatch = useDispatch();
    
    // 👈 4. Obtener datos del store de Redux
    const { mySalones, status, error } = useSelector((state) => state.salones);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [salonBuscado, setSalonBuscado] = useState("");

    // 👈 5. Cargar los salones del usuario cuando el componente se monta
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchMySalones());
        }
    }, [dispatch, isAuthenticated]);

    const handleSearch = (query) => {
        setSalonBuscado(query);
    };

    const normalizarTexto = (text = '') =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    // 👈 6. Filtrar sobre los datos del store
    const salonesFiltrados = mySalones.filter(salon => 
        normalizarTexto(salon.nombre).includes(normalizarTexto(salonBuscado))
    );

    

    const handleHideSalon = (salonId) => {
        console.log(salonId);
        
    Swal.fire({
      title: '¿Ocultar este salón?',
      text: "El salón no será visible en las búsquedas, pero podrás reactivarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ocultar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateSalonStatusAdmin({ salonId, nuevoEstado: SalonStatus.OCULTA })) // Llama al thunk con el estado 'oculta'
          .unwrap()
          .then(() => Swal.fire('Oculto', 'El salón ha sido ocultado.', 'success'))
          .catch((err) => Swal.fire('Error', `No se pudo ocultar el salón: ${err?.message || 'Error desconocido'}`, 'error'));
      }
    });
  };
    
    // 👈 7. Renderizado condicional según el estado de la petición
   const renderContent = () => {
        if (status === 'loading') {
            return <p className='sin-resultados'>Cargando tus salones...</p>;
        }
        if (status === 'failed') {
            return <p className='sin-resultados'>Error al cargar: {error}</p>;
        }
        if (salonesFiltrados.length === 0) {
            return <p className='sin-resultados'>No se encontraron salones.</p>;
        }
        // Simplemente mapeamos y pasamos los datos al nuevo componente
        return salonesFiltrados.map(salon => (
            <ItemMiSalon 
                key={salon.id_salon} 
                salon={salon}
                onHide={handleHideSalon}
            />
        ));
    };

    return (
        <div className='pagina-misSalones'>
            <h1 className='titulo'>Mis Salones</h1>
            <BarraBusqueda 
                placeholder='Buscar en mis salones...' 
                onSearch={handleSearch} 
                totalSalones={salonesFiltrados.length} 
            />
            <div className='listado-salones'>
                {renderContent()}
            </div>
        </div>
    );
}

export default MisSalonesScreen;