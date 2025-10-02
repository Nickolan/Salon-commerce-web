import React, { useRef } from 'react';
import './General.css'
import { FaPlus } from "react-icons/fa";

const General = ({ salon, photos, handleChange, handlePhotoChange, removePhoto }) => {

  const inputRef = useRef();
  // Generamos URLs locales para previsualizar las imágenes seleccionadas sin subirlas al servidor.
  const photoPreviews = photos.map(file => URL.createObjectURL(file));

  const handleFocusClick = () => {
    // Access the DOM element through inputRef.current
    if (inputRef.current) {
      inputRef.current.click(); // Call the focus method on the input element
    }
  };

  return (
    <div className='form-zone'>
      {/* --- Sección de Nombre --- */}
      <div className='section-zone'>
        <h3 htmlFor="nombre">Nombre Salón</h3>
        {/* Se añade el atributo 'name' para que `handleChange` identifique este campo. */}
        <input 
          id="nombre"
          name="nombre" 
          value={salon.nombre} 
          onChange={handleChange} 
          type="text" 
          placeholder="Ej: Salón de Fiestas Alegría"
        />
      </div>

      {/* --- Sección de Descripción --- */}
      <div className='section-zone'>
        <h3 htmlFor="descripcion">Descripción</h3>
        {/* Se añaden 'name' y 'value' para que sea un componente controlado. */}
        <textarea 
          id="descripcion"
          name="descripcion"
          value={salon.descripcion}
          onChange={handleChange} 
          placeholder="Check and Home – Study Room es un salón de estudio privado ubicado en Méjico 2234, Godoy Cruz, Mendoza, ideal para grupos de hasta 15 personas que buscan comodidad   y concentración."
        ></textarea>
      </div>

      {/* --- Sección de Fotos --- */}
      <div className='section-zone'>
        <h3 htmlFor="fotos">Fotos {photos.length}/5</h3>
        <input 
          ref={inputRef}
          id="fotos"
          type="file" 
          style={{display: "none"}}
          multiple // Permite seleccionar varios archivos a la vez.
          accept="image/*" // Limita la selección a archivos de imagen.
          onChange={handlePhotoChange} 
          // Opcional: puedes ocultar el input y estilizar el h3 como un botón.
        />
        
        {/* Contenedor para la previsualización de imágenes */}
        <div className='photo-previews'>
          {photoPreviews.map((previewUrl, index) => (
            <div key={index} className='image-container'>
              <img 
                src={previewUrl}
                alt={`Previsualización ${index + 1}`} 
                // Liberamos la memoria del objeto URL cuando el componente se desmonte.
                onLoad={() => URL.revokeObjectURL(previewUrl)}
              />
              <button 
                type="button" // Evita que el botón envíe el formulario.
                onClick={() => removePhoto(index)}
              >
                &times; {/* Símbolo de una X */}
              </button>
            </div>
          ))}
          <div onClick={handleFocusClick} className='image-container-ref'>
            <FaPlus color='var(--primary-color)'/>
          </div>
        </div>
        {photos.length > 0 && <p style={{fontSize: '0.9em', color: '#555'}}>Has seleccionado {photos.length} de 5 fotos.</p>}
      </div>
    </div>
  );
};

export default General;