import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFavoritos } from '../store/features/favoritos/favoritosSlice';

import Sidebar from '../Components/Sidebar/Sidebar';
import SearchbarReservas from '../Components/SearchBar/SearchbarReservas';
import ItemSalonDetallado from '../Components/Item-salon-detallado/ItemSalonDetallado';
import "../styles/FavoritosScreen.css";

const FavoritosScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { favoritos, status, error } = useSelector((state) => state.favoritos);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [query, setQuery] = useState("");
    const [filterActive, setFilterActive] = useState(false);

    // Efecto para cargar los favoritos y proteger la ruta
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            if (status === 'idle' || status === 'failed') {
                dispatch(fetchFavoritos());
            }
        }
    }, [isAuthenticated, status, dispatch, navigate]);

    const normalizarTexto = (text = '') =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    // Lógica de filtrado
    const salonesFiltrados = useMemo(() => {
        if (!favoritos) return [];

        // Extraemos los salones de los favoritos
        const salones = favoritos
            .map(fav => fav.salon)
            .filter(salon => salon != null);

        if (!query.trim()) {
            return salones;
        }

        const queryNormalizada = normalizarTexto(query);

        return salones.filter(salon =>
            normalizarTexto(salon.nombre).includes(queryNormalizada)
        );
    }, [favoritos, query]);

    const handleApplyFilter = () => {
        // El filtro ya se aplica en tiempo real
        setFilterActive(false);
    };

    const renderContent = () => {
        if (status === 'loading') {
            return <p className="status-message">Cargando tus favoritos...</p>;
        }
        if (status === 'failed') {
            return <p className="status-message error">Error al cargar favoritos: {error}</p>;
        }
        if (status === 'succeeded' && salonesFiltrados.length === 0) {
            if (!favoritos || favoritos.length === 0) {
                return <p className="status-message">Aún no tienes salones guardados en favoritos.</p>;
            } else {
                return <p className="status-message">No se encontraron salones que coincidan con tu búsqueda.</p>;
            }
        }
        return (
            <div className="lista-favoritos">
                {salonesFiltrados.map((salon) => (
                    <ItemSalonDetallado key={salon.id_salon} salon={salon} />
                ))}
            </div>
        );
    };

    return (
        <div className="favoritos-layout">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Contenido principal */}
            <div className="favoritos-content">
                <div className="favoritos-header">
                    <h1 className="favoritos-titulo">MIS FAVORITOS</h1>
                    
                    {/* Searchbar con diseño de admin (mismo que en MisReservas) */}
                    <SearchbarReservas
                        filterValue={query}
                        onFilterChange={setQuery}
                        onApplyFilter={handleApplyFilter}
                        totalResultados={salonesFiltrados.length}
                        isActive={filterActive}
                        setIsActive={setFilterActive}
                    />
                </div>

                {renderContent()}
            </div>
        </div>
    );
};

export default FavoritosScreen;