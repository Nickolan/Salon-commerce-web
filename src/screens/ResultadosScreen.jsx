import React, { useState, useMemo } from 'react'; // 👈 Importar useMemo
import { useSelector } from 'react-redux';
import Searchbar from '../Components/SearchBar/searchbar';
import Sidebarfiltros from '../Components/Sidebarfiltros/Sidebarfiltros';
import ItemSalonDetallado from '../Components/Item-salon-detallado/ItemSalonDetallado';
import '../styles/ResultadosScreen.css';

const ResultadosScreen = () => {
    const { resultadosSalones, status, error } = useSelector((state) => state.salones);
    const [filtros, setFiltros] = useState({
        precioMin: 0,
        precioMax: Infinity, // Usamos Infinity para no limitar inicialmente
        capacidadMin: 1,
        equipamientos: [],
        orden: 'cercania',
    });

    const handleFiltrosChange = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
    };

    // 👈 Usamos useMemo para recalcular los salones filtrados solo cuando cambian los resultados o los filtros
    const salonesFiltrados = useMemo(() => {
        if (!resultadosSalones) return [];

        let filtrados = [...resultadosSalones]; // Copiamos para no mutar el estado de Redux

        // Aplicar filtro de precio
        filtrados = filtrados.filter(salon =>
            salon.precio_por_hora >= filtros.precioMin && salon.precio_por_hora <= filtros.precioMax
        );

        // Aplicar filtro de capacidad
        filtrados = filtrados.filter(salon => salon.capacidad >= filtros.capacidadMin);

        // Aplicar filtro de equipamientos (si hay alguno seleccionado)
        if (filtros.equipamientos.length > 0) {
            filtrados = filtrados.filter(salon =>
                filtros.equipamientos.every(eq => salon.equipamientos?.includes(eq))
            );
        }

        // Aplicar ordenamiento
        switch (filtros.orden) {
            case 'precio_asc':
                filtrados.sort((a, b) => a.precio_por_hora - b.precio_por_hora);
                break;
            case 'precio_desc':
                filtrados.sort((a, b) => b.precio_por_hora - a.precio_por_hora);
                break;
            // 'cercania' es el orden por defecto de la API, no hacemos nada extra
            case 'cercania':
            default:
                // La API ya los devuelve ordenados por distancia
                break;
            // case 'mejor_valorados': // A implementar a futuro
            //   filtrados.sort((a, b) => (b.promedioResenias || 0) - (a.promedioResenias || 0));
            //   break;
        }

        return filtrados;

    }, [resultadosSalones, filtros]); // Dependencias del useMemo

    // ... (El resto del componente, incluyendo renderResultados, se mantiene igual,
    //      pero ahora usará la variable `salonesFiltrados` que ya está procesada)

    const renderResultados = () => {
      // ... (código existente, usando salonesFiltrados) ...
       if (status === 'loading') {
            return <p className="status-message">Buscando los mejores salones para ti...</p>;
        }
        if (status === 'failed') {
            return <p className="status-message error">Hubo un error en la búsqueda: {error}</p>;
        }
        // Ahora verificamos salonesFiltrados después de aplicar los filtros locales
        if (status === 'succeeded' && salonesFiltrados.length === 0) {
            // Distinguimos si no hubo resultados iniciales o si los filtros los eliminaron todos
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
        <div className='pagina-resultados'>
            <aside className='resultados-sidebar'>
                <Sidebarfiltros onFiltrosChange={handleFiltrosChange} />
            </aside>
            <main className='resultados-main'>
                <div className='resultados-searchbar-wrapper'>
                    <Searchbar />
                </div>
                <div className='resultados-header'>
                    <p className='resultados-contador'>
                         {/* Mostramos el conteo de los salones YA filtrados */}
                        {status === 'succeeded' && `${salonesFiltrados.length} salones encontrados`}
                    </p>
                </div>
                {renderResultados()}
            </main>
        </div>
    );
}

export default ResultadosScreen;