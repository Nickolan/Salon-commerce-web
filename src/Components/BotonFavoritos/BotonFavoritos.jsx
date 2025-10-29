import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addFavorito, removeFavorito } from "../../store/features/favoritos/favoritosSlice";
import "./BotonFavoritos.css"; 

// Añadimos props para controlar el estilo y el texto
const BotonFavoritos = ({ id_salon, showText = false, text = "Guardar", isIconOnly = false }) => {
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { favoritos } = useSelector((state) => state.favoritos);

    const favorito = favoritos.find(fav => fav.salon.id_salon === id_salon);
    const esFavorito = !!favorito;

    const handleToggleFavorito = (e) => {
        e.stopPropagation();
        if (!isAuthenticated || !user) {
            alert("Debes iniciar sesión para agregar a favoritos.");
            return;
        }
        

        if (esFavorito) {
            dispatch(removeFavorito({ id_favorito: favorito.id_favorito, id_salon }));
        } else {
            dispatch(addFavorito(id_salon));
        }
    };

    if (!isAuthenticated) {
        return null; 
    }

    // Componemos las clases CSS dinámicamente
    const buttonClass = `boton-favorito ${esFavorito ? 'es-favorito' : ''} ${isIconOnly ? 'icon-only' : ''}`;

    return (
        <button
            className={buttonClass}
            onClick={handleToggleFavorito}
            aria-label={esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
            {esFavorito ? <FaHeart className="fav-icon" /> : <FaRegHeart className="fav-icon" />}
            {showText && <span className="fav-text">{esFavorito ? 'Guardado' : text}</span>}
        </button>
    );
};

export default BotonFavoritos;