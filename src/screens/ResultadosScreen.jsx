// src/screens/ResultadosScreen.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Searchbar from '../Components/SearchBar/searchbar';
import Sidebarfiltros from '../Components/Sidebarfiltros/Sidebarfiltros';
import ItemSalonDetallado from '../Components/Item-salon-detallado/ItemSalonDetallado';
import '../styles/ResultadosScreen.css';
import { FiFilter, FiX } from "react-icons/fi";

const ResultadosScreen = ({ isLoaded }) => {
    const { resultadosSalones, status, error } = useSelector((state) => state.salones);
    const [filtros, setFiltros] = useState({
        precioMin: 0,
        precioMax: Infinity,
        capacidadMin: 1,
        equipamientos: [],
        orden: 'cercania',
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    // --- 👇 1. MODIFICAMOS ESTA FUNCIÓN ---
    // Esta función ahora SOLO actualiza el estado de los filtros.
    // Ya no cierra el sidebar.
    const handleFiltrosChange = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        // La línea que cerraba el sidebar (setIsFiltersOpen(false)) SE ELIMINA de aquí.
    };

    // --- 👇 2. CREAMOS UNA NUEVA FUNCIÓN PARA CERRAR EL SIDEBAR ---
    // Esta función se pasará al botón "Aplicar" dentro del sidebar.
    const handleAplicarYcerrar = () => {
        setIsFiltersOpen(false);
    };
    
    // (useMemo de salonesFiltrados sin cambios)
    const salonesFiltrados = useMemo(() => {
        if (!resultadosSalones) return [];
        let filtrados = [...resultadosSalones];
        filtrados = filtrados.filter(salon =>
          salon.precio_por_hora >= filtros.precioMin && salon.precio_por_hora <= filtros.precioMax
        );
        filtrados = filtrados.filter(salon => salon.capacidad >= filtros.capacidadMin);
        if (filtros.equipamientos.length > 0) {
            filtrados = filtrados.filter(salon =>
              filtros.equipamientos.every(eq => salon.equipamientos?.includes(eq))
            );
        }
        switch (filtros.orden) {
            case 'precio_asc':
                filtrados.sort((a, b) => a.precio_por_hora - b.precio_por_hora);
                break;
            case 'precio_desc':
                filtrados.sort((a, b) => b.precio_por_hora - a.precio_por_hora);
                break;
            case 'cercania':
            default:
                break;
        }
        return filtrados;
    }, [resultadosSalones, filtros]);

    // (useEffect de bloquear scroll sin cambios)
    useEffect(() => {
        if (isFiltersOpen && window.innerWidth <= 992) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
             document.body.style.overflow = '';
        };
    }, [isFiltersOpen]);

    // (renderResultados sin cambios)
    const renderResultados = () => {
       if (status === 'loading') {
            return <p className="status-message">Buscando los mejores salones para ti...</p>;
        }
        if (status === 'failed') {
            return <p className="status-message error">Hubo un error en la búsqueda: {error}</p>;
        }
        if (status === 'succeeded' && salonesFiltrados.length === 0) {
            if (resultadosSalones.length === 0) {
              return <p className="status-message">No se encontraron salones con esos criterios iniciales. ¡Intenta ampliar tu búsqueda!</p>;
            } else {
              return <p className="status-message">No hay salones que coincidan con los filtros aplicados.</p>;
            }
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
        <div className={`pagina-resultados ${isFiltersOpen ? 'filters-open' : ''}`}>
            <aside className={`resultados-sidebar ${isFiltersOpen ? 'open' : ''}`}>
                {/* --- 👇 3. PASAMOS LA NUEVA PROP onAplicar --- */}
                <Sidebarfiltros 
                    onFiltrosChange={handleFiltrosChange} 
                    onAplicar={handleAplicarYcerrar} 
                />
            </aside>

            {isFiltersOpen && (
                <div
                    className="filtros-backdrop open"
                    onClick={() => setIsFiltersOpen(false)}
                ></div>
            )}

            <main className='resultados-main'>
                {/* ... (resto del JSX sin cambios) ... */}
                <div className='resultados-searchbar-wrapper'>
                     { isLoaded !== false && <Searchbar /> }
                </div>
                <div className='resultados-header'>
                     <button
                        className="filtros-toggle-btn"
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    >
                        {isFiltersOpen ? <FiX /> : <FiFilter />}
                        <span>{isFiltersOpen ? 'Cerrar' : 'Filtros'}</span>
                    </button>
                    <p className='resultados-contador'>
                        {status === 'succeeded' && `${salonesFiltrados.length} salones encontrados`}
                    </p>
                </div>
                {renderResultados()}
            </main>
        </div>
    );
}

export default ResultadosScreen;