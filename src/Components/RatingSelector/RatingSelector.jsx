import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./RatingSelector.css";

export default function RatingSelector({
  value = 0,
  onChange = () => {},
  size = 22,
  readOnly = false,
  ariaLabel = "Seleccionar puntaje"
}) {
  const [rating, setRating] = useState(value); // valor confirmado
  const [hover, setHover] = useState(0);       // preview mientras hover/touch

  // sincronizar si el padre cambia 'value'
  useEffect(() => setRating(value), [value]);

  const display = hover || rating; // lo que mostramos: hover tiene prioridad

  // detectar posición del click/touch dentro de la estrella (mitad izquierda/derecha)
  const getIsHalf = (e, element) => {
    const rect = element.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    if (!clientX) return false;
    const x = clientX - rect.left;
    return x < rect.width / 2;
  };

  const handlePointerMove = (e, index) => {
    if (readOnly) return;
    const isHalf = getIsHalf(e, e.currentTarget);
    setHover(isHalf ? index + 0.5 : index + 1);
  };

  const handlePointerLeave = () => {
    if (readOnly) return;
    setHover(0);
  };

  const handleClick = (e, index) => {
    if (readOnly) return;
    const isHalf = getIsHalf(e, e.currentTarget);
    const newRating = isHalf ? index + 0.5 : index + 1;
    setRating(newRating);
    onChange(newRating);
  };

  // Soporte por teclado: flechas izquierda/derecha para -/+ 0.5
  const handleKeyDown = (e) => {
    if (readOnly) return;
    if (e.key === "ArrowLeft") {
      const newR = Math.max(0, rating - 0.5);
      setRating(newR);
      onChange(newR);
    } else if (e.key === "ArrowRight") {
      const newR = Math.min(5, rating + 0.5);
      setRating(newR);
      onChange(newR);
    } else if (e.key === "Home") {
      setRating(0);
      onChange(0);
    } else if (e.key === "End") {
      setRating(5);
      onChange(5);
    }
  };

  const renderStar = (i) => {
    if (display >= i + 1) return <FaStar className="rs-star filled" style={{ fontSize: size }} />;
    if (display >= i + 0.5) return <FaStarHalfAlt className="rs-star half" style={{ fontSize: size }} />;
    return <FaRegStar className="rs-star empty" style={{ fontSize: size }} />;
  };

  return (
    <div
      className="rating-selector"
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={rating}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rs-star-wrapper"
          onMouseMove={(e) => handlePointerMove(e, i)}
          onMouseLeave={handlePointerLeave}
          onClick={(e) => handleClick(e, i)}
          onTouchStart={(e) => handlePointerMove(e, i)}
          onTouchEnd={(e) => handleClick(e, i)}
          aria-hidden={readOnly}
        >
          {renderStar(i)}
        </div>
      ))}
    </div>
  );
}