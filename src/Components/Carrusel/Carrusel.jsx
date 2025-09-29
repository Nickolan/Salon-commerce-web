import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carrusel.css";

const Carrusel = ({ children }) => {

    const settings = {
        // dots: añade puntos de navegación debajo del carrusel
        dots: true, 
        // infinite: hace al carrusel infinito
        infinite: true,
        // speed: define la velocidad de animación al cambio del slide por milisegundos
        speed: 1000,
        // slidesToShow: cantidad de componentes visibles al mismo tiempo
        slidesToShow: 4,
        // slidesToScroll: cantidad de componentes que se mueven al scrollear
        slidesToScroll: 1,
        // draggable: permite arrastrar el carrusel con el mouse
        draggable: true,   
        // swipe: permite arrastrar el carrusel en dispositivos táctiles
        swipe: true, 
        // swipeToSlide: permite soltar el swipe en cualquier posición y que el carrusel se mueva al slide mas cercano      
        swipeToSlide: true,
        // toucheMove: permite que el carrusel responda al movimiento táctil
        touchMove: true,
        // define el cambio de algunos settings en base al tamaño de la pantalla (breakpoint) por px
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],

    }

    return (
        <div className="carrusel-container">
            <Slider {...settings}>
                {children.map((child, i) => (
                    <div key={i} className="carrusel-item">
                        {child}
                    </div>
                ))}
            </Slider>
        </div>
    )

}

export default Carrusel;