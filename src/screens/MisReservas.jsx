import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMisReservas } from '../store/features/reservas/reservasSlice';

import Sidebar from '../Components/Sidebar/Sidebar';
import SearchbarReservas from '../Components/SearchBar/SearchbarReservas';
import ItemReserva from '../Components/ItemReserva/ItemReserva';
import '../styles/MisReservas.css';

const MisReservasScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { misReservas, misReservasStatus, error } = useSelector((state) => state.reservas);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [query, setQuery] = useState("");
    const [filterActive, setFilterActive] = useState(false);

    // Efecto para cargar las reservas y proteger la ruta
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            if (misReservasStatus === 'idle' || misReservasStatus === 'failed') {
                dispatch(fetchMisReservas());
            }
        }
    }, [isAuthenticated, misReservasStatus, dispatch, navigate]);

    const normalizarTexto = (text = '') =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    // Lógica de filtrado
    const reservasFiltradas = useMemo(() => {
        if (!misReservas) return [];

        if (!query.trim()) {
            return misReservas;
        }

        const queryNormalizada = normalizarTexto(query);

        return misReservas.filter(reserva =>
            reserva.salon && normalizarTexto(reserva.salon.nombre).includes(queryNormalizada)
        );
    }, [misReservas, query]);

    const handleApplyFilter = () => {
        // El filtro ya se aplica en tiempo real, pero podemos agregar lógica adicional si es necesario
        setFilterActive(false);
    };

    const renderContent = () => {
        if (misReservasStatus === 'loading') {
            return <p className="status-message">Cargando tus reservas...</p>;
        }
        if (misReservasStatus === 'failed') {
            return <p className="status-message error">Error al cargar tus reservas: {error}</p>;
        }
        if (misReservasStatus === 'succeeded' && reservasFiltradas.length === 0) {
             if (misReservas.length === 0) {
                 return <p className="status-message">Aún no tienes ninguna reserva.</p>;
             } else {
                 return <p className="status-message">No se encontraron reservas que coincidan con tu búsqueda.</p>;
             }
        }
        return (
            <div className="lista-reservas">
                {reservasFiltradas.map((reserva) => (
                    <ItemReserva key={reserva.id_reserva} reserva={reserva} />
                ))}
            </div>
        );
    };

    return (
        <div className="mis-reservas-layout">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Contenido principal */}
            <div className="mis-reservas-content">
                <div className="mis-reservas-header">
                    <h1 className="mis-reservas-titulo">MIS RESERVAS</h1>
                    
                    {/* Searchbar con diseño de admin */}
                    <SearchbarReservas
                        filterValue={query}
                        onFilterChange={setQuery}
                        onApplyFilter={handleApplyFilter}
                        totalResultados={reservasFiltradas.length}
                        isActive={filterActive}
                        setIsActive={setFilterActive}
                    />
                </div>

                {renderContent()}
            </div>
        </div>
    );
};

export default MisReservasScreen;