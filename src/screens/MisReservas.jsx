import React, { useState } from 'react';
import { Link } from "react-router-dom";
import BarraBusqueda from '../Components/BarraBusqueda/BarraBusqueda';
import Salones from "../utils/Salones.json";
import Reservas from "../utils/Reservas.json";
import Transacciones from "../utils/Transacciones.json";
import ItemReserva from '../components/ItemReserva/ItemReserva';
import "../styles/MisReservas.css";

const USUARIO_ACTUAL = 2;

const MisReservas = () => {
    const [reservas, setReservas] = useState(Reservas);
    const [salones, setSalones] = useState(Salones);
    const [salonBuscado, setSalonBuscado] = useState("");

    const normalizarTexto = (text) =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    // Función para formatear la fecha
    const formatearFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const opciones = { day: 'numeric', month: 'long' };
        return fechaObj.toLocaleDateString('es-ES', opciones);
    };

    const formatearHora = (hora) => {
        return hora.slice(0, 5);
    };

    const obtenerEstadoReserva = (reserva) => {
        const hoy = new Date();
        const fechaReserva = new Date(reserva.fecha_reserva);
        return fechaReserva > hoy ? "Por realizar" : "Completado";
    };

    const handleSearch = (query) => {
        setSalonBuscado(query);
    };
    const reservasConTransacciones = Transacciones.map(transaccion => transaccion.reserva.id_reserva);
    const reservasFiltradas = reservas.filter(reserva => 
        reservasConTransacciones.includes(reserva.id_reserva)
    );

    const reservasUnicas = [...new Map(reservasFiltradas.map(reserva =>
        [reserva.id_reserva, reserva]
    )).values()];

    const reservasFiltradasPorBusqueda = reservasUnicas.filter(reserva => {
        const salon = salones.find(s => s.id_salon === reserva.id_salon);
        return salon && normalizarTexto(salon.nombre).includes(normalizarTexto(salonBuscado));
    });

    const reservasAMostrar = salonBuscado ? reservasFiltradasPorBusqueda : reservasUnicas;

    return (
        <div className='pagina-misReservas'>
            <h1 className='titulo'>Mis Reservas</h1>
            <BarraBusqueda
                placeholder='Buscar reservas...'
                onSearch={handleSearch}
                totalSalones={reservasAMostrar.length}
            />
            <div className='listado-reservas'>
                {reservasAMostrar.length === 0 ? (
                    <p className='sin-resultados'>No se encontraron reservas.</p>
                ) : (
                    reservasAMostrar.map(reserva => {
                        const salon = salones.find(s => s.id_salon === reserva.id_salon);
                        const estado = obtenerEstadoReserva(reserva);
                        return (
                            <ItemReserva
                                key={reserva.id_reserva}
                                reserva={reserva}
                                salon={salon}
                                estado={estado}
                                formatearFecha={formatearFecha}
                                formatearHora={formatearHora}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MisReservas;