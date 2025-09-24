import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./ItemSalonSimple.css"
import { useNavigate } from "react-router-dom";
import Favoritos from "../../utils/Favoritos.json"

const USUARIO_ACTUAL = 2; 

const ItemSalonSimple = ({ id_salon, nombre, precio, imagen, reservas, resenias }) => {

    const [esFavorito, setEsFavorito] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { 

        //useEffect ejecuta código después de la renderización del componente, en este caso siempre que id_salon cambien (2do parámetro) se va a ejecutar el useEffect

        const favoritosGuardados = JSON.parse(localStorage.getItem("favoritos")) || []; 
        //lee los favoritos guardados y los convierte en un array, si no hay nada es un array vacio
        if (favoritosGuardados.length === 0) {
            const inicial = Favoritos.filter(f => f.id_usuario === USUARIO_ACTUAL).map(f => f.id_salon);
            localStorage.setItem("favoritos", JSON.stringify(inicial));
            setEsFavorito(inicial.includes(id_salon));
            // si el array es vacio inicializa Favoritos.json y son agregados al localStorage, luego si el id del salón está dentro de favoritos se setea "true" esFavorito.
        } else {
            setEsFavorito(favoritosGuardados.includes(id_salon));
            // si no está vacío significa que el usuario ya interactuó previamente, por ende, ya sus favoritos están guardados en el localStorage, solo se setea false o true esFavorito según como esté guardado
        }
    }, [id_salon]);

    const handleCardClick = () => {
        navigate(`/detalle-salon/${id_salon}`);
    }

    const handleToggleFavorito = (e) => {
        e.stopPropagation();
        const favoritosGuardados = JSON.parse(localStorage.getItem("favoritos")) || [];
        let nuevosFavoritos;
        if (esFavorito) {
            nuevosFavoritos = favoritosGuardados.filter(favId => favId !== id_salon);
        } else {
            nuevosFavoritos = [...favoritosGuardados, id_salon];
        }
        localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
        setEsFavorito(!esFavorito)
    } //uso de localStorage para simular persistencia que en un futuro la BD nos dará

    const calcularPromedio = (salonId) => {
        const reservasDelSalon = reservas.filter(r => r.id_salon === salonId);
        const idsReservas = reservasDelSalon.map(r => r.id_reserva);
        const reseniasDelSalon = resenias.filter(res => idsReservas.includes(res.id_reserva));
        return reseniasDelSalon.length > 0
            ? (reseniasDelSalon.reduce((acc, r) => acc + r.calificacion, 0) / reseniasDelSalon.length).toFixed(1) : "0.0";
    };

    return (
        <div className="salon-card" onClick={handleCardClick}>
            <div className="salon-card-wrapper-img">
                <img src={imagen} alt={nombre} className="salon-card-img" />
                <button 
                className={`salon-card-fav-btn ${esFavorito ? "-true" : "-false"}`}
                onClick={handleToggleFavorito}
                >
                    {esFavorito ? <FaHeart/> : <FaRegHeart/>}
                </button>
            </div>
            <div className="salon-card-info-izq">
                <p className="salon-card-info-nombre">{nombre}</p>
                <p className="salon-card-info-precio">$ {precio} / hora</p>
            </div>
            <div className="salon-card-info-der">
                {calcularPromedio(id_salon)}
            </div>
        </div>
    )
}

export default ItemSalonSimple;