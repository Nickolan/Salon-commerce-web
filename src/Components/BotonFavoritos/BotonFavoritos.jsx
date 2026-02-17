import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addFavorito, removeFavorito } from "../../store/features/favoritos/favoritosSlice";
import "./BotonFavoritos.css"; 

const BotonFavoritos = ({ id_salon, showText = false, text = "Guardar", isIconOnly = false, customClass = "" }) => {
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const favoritosState = useSelector((state) => state.favoritos);
    
    // ✅ SOLO mostramos el botón si el usuario está autenticado
    if (!isAuthenticated || !user) {
        return null; // No mostrar nada si no hay usuario
    }
    
    // ✅ Buscamos si este salón está en favoritos del usuario actual
    const favorito = favoritosState?.favoritos?.find(fav => 
        fav.salon?.id_salon === id_salon && 
        fav.usuarioIdUsuario === user.id_usuario // Verificamos que sea del usuario actual
    );
    const esFavorito = !!favorito;
    
    const isLoading = favoritosState?.status === 'loading';

    const handleToggleFavorito = (e) => {
        e.stopPropagation();
        
        // Ya sabemos que está autenticado por el if de arriba, pero lo verificamos por seguridad
        if (!isAuthenticated || !user) {
            alert("Debes iniciar sesión para agregar a favoritos.");
            return;
        }
        
        if (esFavorito) {
            // Pasamos el id_favorito correcto para eliminar
            dispatch(removeFavorito({ 
                id_favorito: favorito.id_favorito, 
                id_salon: id_salon 
            }));
        } else {
            // Agregamos con el id_salon y el usuario actual se toma del token en el backend
            dispatch(addFavorito(id_salon));
        }
    };

    const buttonClass = `boton-favorito ${esFavorito ? 'es-favorito' : ''} ${isIconOnly ? 'icon-only' : ''} ${customClass} ${isLoading ? 'cargando' : ''}`.trim();

    return (
        <div
            className={buttonClass}
            onClick={handleToggleFavorito}
            role="button"
            tabIndex={0}
            aria-label={esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleToggleFavorito(e);
                }
            }}
        >
            {esFavorito ? <FaHeart className="fav-icon" /> : <FaRegHeart className="fav-icon" />}
            {showText && <span className="fav-text">{esFavorito ? 'Guardado' : text}</span>}
        </div>
    );
};

export default BotonFavoritos;