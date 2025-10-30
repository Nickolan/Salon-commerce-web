import React, { Fragment, useMemo } from "react"; // Importar useMemo
import { useNavigate } from "react-router-dom";
import "./ItemSalonDetallado.css"
import { FaMap } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
// import { FaShoppingCart } from 'react-icons/fa'; // No se usa
import BotonFavoritos from "../BotonFavoritos/BotonFavoritos";
import { FaStar } from "react-icons/fa"; // Para el ícono de estrella

function ItemSalonDetallado({ salon }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/salon/${salon.id_salon}`);
  };

  // --- 👇 CÁLCULO DEL PROMEDIO DE RESEÑAS CON useMemo ---
  const promedioRating = useMemo(() => {
    // Verificar si hay reservas y si es un array
    if (!salon || !Array.isArray(salon.reservas) || salon.reservas.length === 0) {
      return 0; // Si no hay reservas, no hay promedio
    }

    let sumaCalificaciones = 0;
    let cantidadResenias = 0;

    // Iterar sobre las reservas del salón
    salon.reservas.forEach(reserva => {
      // Verificar si la reserva tiene una reseña y si la calificación es un número válido
      if (reserva.resenia && typeof reserva.resenia.calificacion === 'number') {
        sumaCalificaciones += reserva.resenia.calificacion;
        cantidadResenias++;
      }
    });

    // Calcular el promedio solo si hay reseñas
    if (cantidadResenias === 0) {
      return 0;
    }

    // Devolver el promedio redondeado a un decimal
    return Math.round((sumaCalificaciones / cantidadResenias) * 10) / 10;
  }, [salon]); // Recalcular solo si el objeto 'salon' cambia
  // --- 👆 FIN DEL CÁLCULO ---

  const ratingFormateado = promedioRating > 0 ? promedioRating.toFixed(1) : "-";

  const calificacionTexto = (puntaje) => {
    if (!puntaje || puntaje <= 0) return "Sin valorar";
    if (puntaje >= 4.5) return "Excelente";
    if (puntaje >= 3.5) return "Muy bien";
    if (puntaje >= 2.5) return "Regular"; // Cambiado de "Mediana"
    if (puntaje >= 1.5) return "Mala";
    return "Muy Mala";
  };

  const textoRating = calificacionTexto(promedioRating);

  return (
    <Fragment>
      <div className="caja" onClick={handleClick} style={{ cursor: "pointer" }}>
        <div className="imagen-wrapper">
          <img src={salon.fotos?.length > 0 ? salon.fotos[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqEx41lmw6yMNksFVU2dPXYqdciHh9CaGlw&s"} alt={salon.nombre} className="imagen_salon" />
           {/* Badge de Rating sobre la imagen */}
           {promedioRating > 0 && (
             <div className="salon-card-rating item-detallado-rating"> {/* Asegúrate que esta clase exista en tu CSS si quieres estilos específicos */}
               <FaStar />
               <span>{ratingFormateado}</span>
             </div>
           )}
          <BotonFavoritos id_salon={salon.id_salon} isIconOnly={true}/>
        </div>

        <div className="info_principal">
          <h3 className="titulo">{salon.nombre || 'Nombre no disponible'}</h3>
          <p><FaMap /> {salon.direccion || 'Dirección no disponible'}</p>
          <p><FaUserGroup /> {salon.capacidad || '?'} personas</p>
        </div>

        <div className="info_extra">
          <div className="calificacion">
            {/* Mostrar el promedio calculado */}
            <span className="puntaje">
                <FaStar style={{ marginRight: '4px', marginBottom: '2px', fontSize: '1.1em' }} />
                {ratingFormateado}
            </span>
            {/* Mostrar el texto correspondiente al promedio */}
            <small>{textoRating}</small>
          </div>
          <div className="precio">
            {/* Formatear precio */}
            <span>${salon.precio_por_hora ? salon.precio_por_hora.toLocaleString('es-AR') : '-'}</span>
            <small>por hora</small>
          </div>
        </div>

      </div>
    </Fragment>
  );
}

export default ItemSalonDetallado;