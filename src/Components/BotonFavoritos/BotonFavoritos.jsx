import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./BotonFavoritos.css"; 
import Favoritos from "../../utils/Favoritos.json";

const USUARIO_ACTUAL = 2; 

const BotonFavoritos = ({id_salon}) => {

    const [esFavorito, setEsFavorito] = useState(false);

    useEffect(() => { 
            //useEffect ejecuta código después de la renderización del componente, en este caso siempre que id_salon cambien (2do parámetro) se va a ejecutar el useEffect
            const inicial = Favoritos.filter(f => f.id_usuario === USUARIO_ACTUAL).map(f => f.id_salon);
            setEsFavorito(inicial.includes(id_salon));
    
        }, [id_salon]);

    const handleToggleFavorito = (e) => {
        e.stopPropagation();
        setEsFavorito(prev => !prev); 
    } 

    return (
        <button
            className={`salon-card-fav-btn ${esFavorito ? "-true" : "-false"}`}
            onClick={(e) => handleToggleFavorito(e)}
        >
            {esFavorito ? <FaHeart /> : <FaRegHeart />}
        </button>
    );
};

export default BotonFavoritos;
