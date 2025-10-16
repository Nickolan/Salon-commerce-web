import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFavoritos } from '../store/features/favoritos/favoritosSlice';

import BarraBusqueda from '../Components/BarraBusqueda/BarraBusqueda';
import ItemSalonDetallado from '../Components/Item-salon-detallado/ItemSalonDetallado';
import "../styles/FavoritosScreen.css";

const FavoritosScreen = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Obtenemos los datos y el estado de la API desde Redux
  const { favoritos, status, error } = useSelector((state) => state.favoritos);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 2. Efecto para proteger la ruta y cargar los datos si es necesario
  useEffect(() => {
    // Si el usuario no está autenticado, lo redirigimos al login
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      // Si por alguna razón los favoritos no se cargaron al inicio, lo intentamos de nuevo
      if (status === 'idle') {
        dispatch(fetchFavoritos());
      }
    }
  }, [isAuthenticated, status, dispatch, navigate]);

  const normalizarTexto = (text = '') =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  console.log("favoritos: ",favoritos);
  

  // 3. La lógica de filtrado ahora es más simple
  // Mapeamos directamente desde `favoritos` y filtramos por el nombre del salón anidado
  const salonesFiltrados = (favoritos || [])
    .map(fav => fav.salon) // Extraemos solo el objeto del salón de cada favorito
    .filter(salon => salon && normalizarTexto(salon.nombre).includes(normalizarTexto(query)));

  // 4. Función para renderizar el contenido según el estado de la petición
  const renderContent = () => {
    if (status === 'loading') {
      return <p className="status-message">Cargando tus favoritos...</p>;
    }

    if (status === 'failed') {
      return <p className="status-message error">Error al cargar favoritos: {error}</p>;
    }

    if (salonesFiltrados.length === 0) {
      return <p className="status-message">No tienes salones guardados en favoritos o no hay coincidencias con tu búsqueda.</p>;
    }

    return salonesFiltrados.map((salon) => (
      <ItemSalonDetallado key={salon.id_salon} salon={salon} />
    ));
  };

  return (
    <div className="pagina-favoritos">
      <h1 className="titulo-favoritos">Mis Favoritos</h1>

      <BarraBusqueda
        placeholder="Buscar en favoritos..."
        onSearch={setQuery}
        totalSalones={salonesFiltrados.length}
      />

      <div className="listado-favoritos">
        {renderContent()}
      </div>
    </div>
  );
};

export default FavoritosScreen;