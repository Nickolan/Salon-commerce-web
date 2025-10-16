import React from 'react';

// 1. Importar los componentes y módulos necesarios de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

// 2. Importar los estilos base de Swiper y tus estilos personalizados
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Carrusel.css';

/**
 * Un componente de carrusel reutilizable.
 * @param {Array} items - El array de datos a mostrar.
 * @param {Function} renderItem - Una función que recibe un item y devuelve el JSX para renderizarlo.
 */
const Carrusel = ({ items, renderItem }) => {
  // No renderizar nada si no hay items para mostrar.
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="carrusel-wrapper">
      <Swiper
        // Instalar los módulos que vamos a usar
        modules={[Navigation, Pagination, A11y]}
        
        // Configuración del carrusel
        spaceBetween={20} // Espacio entre cada slide
        slidesPerView={1}  // Por defecto, mostrar 1 slide (para móviles)
        navigation={true} // Activa las flechas de navegación
        pagination={{ clickable: true }} // Activa los puntos de paginación
        loop={items.length > 4} // El carrusel se repite solo si hay suficientes items
        
        // Configuración responsiva
        breakpoints={{
          // a partir de 576px de ancho de pantalla
          576: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          // a partir de 992px
          992: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // a partir de 1200px
          1200: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
        }}
        className="mi-carrusel"
      >
        {/* Mapeamos los datos y usamos SwiperSlide para cada elemento */}
        {items.map((item) => (
          <SwiperSlide key={item.id_salon}>
            {/* La función renderItem se encarga de dibujar el componente específico */}
            {renderItem(item)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carrusel;