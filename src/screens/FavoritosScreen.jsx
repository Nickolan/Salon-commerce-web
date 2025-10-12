import React, { useState } from "react";
import BarraBusqueda from "../Components/BarraBusqueda/BarraBusqueda";
import ItemSalonDetallado from "../Components/Item-salon-detallado/ItemSalonDetallado";
import Favoritos from "../utils/Favoritos.json";
import Salones from "../utils/Salones.json";
import "../styles/FavoritosScreen.css";

const USUARIO_ACTUAL = 1; // simulamos usuario logueado (ej: Ana Gómez)

const FavoritosScreen = () => {
  const [query, setQuery] = useState("");

  // Función para normalizar texto (así la búsqueda ignora acentos/mayúsculas)
  const normalizarTexto = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  // 1. Filtrar favoritos del usuario actual
  const favoritosUsuario = Favoritos.filter(
    (f) => f.usuario.id_usuario === USUARIO_ACTUAL
  );

  // 2. Conseguir el objeto completo del salón (usando Salones.json)
  const salonesFavoritos = favoritosUsuario.map((fav) => {
    return Salones.find((s) => s.id_salon === fav.salon.id_salon);
  });

  // 3. Aplicar búsqueda sobre el nombre del salón
  const salonesFiltrados = salonesFavoritos.filter(
  (salon) => salon && normalizarTexto(salon.nombre).includes(normalizarTexto(query))
);


  return (
    <div className="pagina-favoritos">
      <h1 className="titulo-favoritos">Favoritos</h1>

      <BarraBusqueda
        placeholder="Buscar en favoritos..."
        onSearch={setQuery}
        totalSalones={salonesFiltrados.length}
      />

      <div className="listado-favoritos">
        {salonesFiltrados.length === 0 ? (
          <p className="sin-resultados-favoritos">No se encontraron favoritos.</p>
        ) : (
          salonesFiltrados.map((salon) => (
            <ItemSalonDetallado key={salon.id_salon} salon={salon} />
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritosScreen;
