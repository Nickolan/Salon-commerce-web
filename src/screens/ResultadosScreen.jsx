// src/screens/ResultadosScreen.jsx
import React, { useState, useMemo, useEffect } from 'react'; // <-- Import useEffect
import { useSelector } from 'react-redux';
import Searchbar from '../Components/SearchBar/searchbar';
import Sidebarfiltros from '../Components/Sidebarfiltros/Sidebarfiltros';
import ItemSalonDetallado from '../Components/Item-salon-detallado/ItemSalonDetallado';
import '../styles/ResultadosScreen.css';
import { FiFilter, FiX } from "react-icons/fi"; // <-- Importar iconos para el botón

const ResultadosScreen = ({ isLoaded }) => { // <-- Asegúrate de recibir isLoaded si Searchbar lo necesita
    const { resultadosSalones, status, error } = useSelector((state) => state.salones);
    const [filtros, setFiltros] = useState({
        precioMin: 0,
        precioMax: Infinity,
        capacidadMin: 1,
        equipamientos: [],
        orden: 'cercania',
    });

    // --- 👇 ESTADO PARA CONTROLAR EL SIDEBAR MÓVIL ---
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    // --------------------------------------------------

    const handleFiltrosChange = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        // Opcional: Cerrar el sidebar en móvil al aplicar filtros
        if (window.innerWidth <= 992) {
             setIsFiltersOpen(false);
        }
    };

    const salonesFiltrados = useMemo(() => {
        // ... (lógica de filtrado sin cambios) ...
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

    // --- 👇 EFECTO PARA BLOQUEAR SCROLL CUANDO EL SIDEBAR ESTÁ ABIERTO ---
    useEffect(() => {
        if (isFiltersOpen && window.innerWidth <= 992) {
            document.body.style.overflow = 'hidden'; // Bloquear scroll del body
        } else {
            document.body.style.overflow = ''; // Restaurar scroll
        }
        // Limpieza al desmontar
        return () => {
             document.body.style.overflow = '';
        };
    }, [isFiltersOpen]);
    // -----------------------------------------------------------------


    const renderResultados = () => {
        // ... (lógica de renderizado sin cambios) ...
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
        // Añadimos una clase al contenedor principal cuando el sidebar está abierto
        // para posibles estilos globales (aunque no es estrictamente necesario aquí)
        <div className={`pagina-resultados ${isFiltersOpen ? 'filters-open' : ''}`}>

            {/* --- 👇 SIDEBAR CON CLASE CONDICIONAL --- */}
            <aside className={`resultados-sidebar ${isFiltersOpen ? 'open' : ''}`}>
                <Sidebarfiltros onFiltrosChange={handleFiltrosChange} />
            </aside>
            {/* -------------------------------------- */}

            {/* --- 👇 BACKDROP CONDICIONAL --- */}
            {isFiltersOpen && (
                <div
                    className="filtros-backdrop open"
                    onClick={() => setIsFiltersOpen(false)} // Cerrar al hacer clic fuera
                ></div>
            )}
            {/* ----------------------------- */}


            <main className='resultados-main'>
                <div className='resultados-searchbar-wrapper'>
                    {/* Renderiza Searchbar solo si isLoaded es true, si es necesario */}
                     { isLoaded !== false && <Searchbar /> }
                </div>
                <div className='resultados-header'>
                     {/* --- 👇 BOTÓN PARA ABRIR/CERRAR FILTROS --- */}
                     <button
                        className="filtros-toggle-btn"
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    >
                        {isFiltersOpen ? <FiX /> : <FiFilter />}
                        <span>{isFiltersOpen ? 'Cerrar' : 'Filtros'}</span>
                    </button>
                    {/* ----------------------------------------- */}

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