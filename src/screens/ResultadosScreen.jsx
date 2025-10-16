import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// Importa los componentes necesarios
import Searchbar from '../Components/SearchBar/searchbar';
import Sidebarfiltros from '../Components/Sidebarfiltros/Sidebarfiltros';
import ItemSalonDetallado from '../Components/Item-salon-detallado/ItemSalonDetallado';

// Importa los nuevos estilos
import '../styles/ResultadosScreen.css';

const ResultadosScreen = ({isLoaded}) => {
    // 1. Obtenemos los datos de la búsqueda y el estado desde Redux
    const { resultadosSalones, status, error } = useSelector((state) => state.salones);

    // Estado local para los filtros que se aplicarán sobre los resultados
    const [filtros, setFiltros] = useState({
        // Aquí podrías inicializar los filtros que necesites, por ejemplo:
        // precioMax: 10000,
        // orden: 'cercania',
    });

    // Esta función se pasará al Sidebar para actualizar los filtros
    const handleFiltrosChange = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
    };

    // Lógica para filtrar los resultados (aquí se aplicarían los filtros del sidebar)
    // Por ahora, solo muestra los resultados tal cual llegan de la API.
    const salonesFiltrados = resultadosSalones; // A futuro, aquí aplicarías la lógica de 'filtros'

    // Función para renderizar el contenido principal
    const renderResultados = () => {
        if (status === 'loading') {
            return <p className="status-message">Buscando los mejores salones para ti...</p>;
        }
        if (status === 'failed') {
            return <p className="status-message error">Hubo un error en la búsqueda: {error}</p>;
        }
        if (status === 'succeeded' && salonesFiltrados.length === 0) {
            return <p className="status-message">No se encontraron salones con esos criterios. ¡Intenta ampliar tu búsqueda!</p>;
        }
        return (
            <div className='resultados_lista'>
                {salonesFiltrados.map((salon) => (
                    <ItemSalonDetallado key={salon.id_salon} salon={salon} />
                ))}
            </div>
        );
    };

    return (
        <div className='pagina-resultados'>
            {/* Columna Izquierda: Filtros */}
            <aside className='resultados-sidebar'>
                <Sidebarfiltros onFiltrosChange={handleFiltrosChange} />
            </aside>

            {/* Columna Derecha: Contenido Principal */}
            <main className='resultados-main'>
                {/* Barra de búsqueda integrada en la parte superior */}
                <div className='resultados-searchbar-wrapper'>
                    {
                        isLoaded &&  <Searchbar />
                    }
                    
                </div>
                
                {/* Contador de resultados */}
                <div className='resultados-header'>
                    <p className='resultados-contador'>
                        {status === 'succeeded' && `${salonesFiltrados.length} salones encontrados`}
                    </p>
                </div>

                {/* Lista de resultados */}
                {renderResultados()}
            </main>
        </div>
    );
}

export default ResultadosScreen;