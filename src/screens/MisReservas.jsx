import React, { useState, useEffect, useMemo } from 'react'; // 👈 Importar useState y useMemo
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMisReservas } from '../store/features/reservas/reservasSlice';

import BarraBusqueda from '../Components/BarraBusqueda/BarraBusqueda'; // 👈 Re-importar BarraBusqueda
import ItemReserva from '../Components/ItemReserva/ItemReserva';
import '../styles/MisReservas.css';

const MisReservasScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Obtener datos y estado desde Redux (sin cambios)
    const { misReservas, misReservasStatus, error } = useSelector((state) => state.reservas);
    const { isAuthenticated } = useSelector((state) => state.auth);

    // --- 👇 AÑADIR ESTADO PARA LA BÚSQUEDA ---
    const [query, setQuery] = useState("");
    // ----------------------------------------

    // Efecto para cargar las reservas y proteger la ruta (sin cambios)
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else {
            if (misReservasStatus === 'idle' || misReservasStatus === 'failed') {
                dispatch(fetchMisReservas());
            }
        }
    }, [isAuthenticated, misReservasStatus, dispatch, navigate]);

    // --- 👇 FUNCIÓN PARA NORMALIZAR TEXTO (para búsqueda insensible) ---
    const normalizarTexto = (text = '') =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    // -----------------------------------------------------------------

    // --- 👇 LÓGICA DE FILTRADO CON useMemo ---
    const reservasFiltradas = useMemo(() => {
        if (!misReservas) return []; // Seguridad si misReservas es undefined

        // Si no hay query, devolvemos todas las reservas
        if (!query.trim()) {
            return misReservas;
        }

        const queryNormalizada = normalizarTexto(query);

        // Filtramos buscando coincidencias en el nombre del salón
        return misReservas.filter(reserva =>
            reserva.salon && normalizarTexto(reserva.salon.nombre).includes(queryNormalizada)
        );
    }, [misReservas, query]); // Recalcular solo si cambian las reservas o la query
    // -----------------------------------------


    // Función para renderizar el contenido (ahora usa reservasFiltradas)
    const renderContent = () => {
        if (misReservasStatus === 'loading') {
            return <p className="status-message">Cargando tus reservas...</p>;
        }
        if (misReservasStatus === 'failed') {
            return <p className="status-message error">Error al cargar tus reservas: {error}</p>;
        }
        // Usamos reservasFiltradas para el conteo y el mapeo
        if (misReservasStatus === 'succeeded' && reservasFiltradas.length === 0) {
             // Distinguimos si no hay reservas o si el filtro no encontró nada
             if (misReservas.length === 0) {
                 return <p className="status-message">Aún no tienes ninguna reserva.</p>;
             } else {
                 return <p className="status-message">No se encontraron reservas que coincidan con tu búsqueda.</p>;
             }
        }
        return (
            <div className="lista-reservas">
                {reservasFiltradas.map((reserva) => ( // Mapeamos sobre reservasFiltradas
                    <ItemReserva key={reserva.id_reserva} reserva={reserva} />
                ))}
            </div>
        );
    };

    return (
        <div className="pagina-mis-reservas">
            <h1 className="titulo-mis-reservas">Mis Reservas</h1>

            {/* --- 👇 REINTEGRAMOS LA BARRA DE BÚSQUEDA --- */}
            <BarraBusqueda
                placeholder="Buscar por nombre de salón..."
                onSearch={setQuery} // Pasamos setQuery directamente
                totalSalones={reservasFiltradas.length} // Usamos el conteo filtrado
            />
            {/* ------------------------------------------- */}

            {renderContent()}
        </div>
    );
};

export default MisReservasScreen;