import React from 'react';
import './General.css'

const General = ({ salon, photos, handleChange, handlePhotoChange, removePhoto }) => {

  // Generamos URLs locales para previsualizar las imágenes seleccionadas sin subirlas al servidor.
  const photoPreviews = photos.map(file => URL.createObjectURL(file));

  return (
    <div className='form-zone'>
      {/* --- Sección de Nombre --- */}
      <div className='section-zone'>
        <label htmlFor="nombre">Nombre Salón</label>
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
        <label htmlFor="descripcion">Descripción</label>
        {/* Se añaden 'name' y 'value' para que sea un componente controlado. */}
        <textarea 
          id="descripcion"
          name="descripcion"
          value={salon.descripcion}
          onChange={handleChange} 
          placeholder="Describe las características principales del salón..."
        ></textarea>
      </div>

      {/* --- Sección de Fotos --- */}
      <div className='section-zone'>
        <label htmlFor="fotos">Fotos (1 a 5 imágenes)</label>
        <input 
          id="fotos"
          type="file" 
          multiple // Permite seleccionar varios archivos a la vez.
          accept="image/*" // Limita la selección a archivos de imagen.
          onChange={handlePhotoChange} 
          // Opcional: puedes ocultar el input y estilizar el label como un botón.
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
        </div>
        {photos.length > 0 && <p style={{fontSize: '0.9em', color: '#555'}}>Has seleccionado {photos.length} de 5 fotos.</p>}
      </div>
    </div>
  );
};

export default General;