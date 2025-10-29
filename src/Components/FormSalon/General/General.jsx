import React, { useRef } from 'react';
import './General.css';
import { FaPlus, FaTimes } from "react-icons/fa"; // Import FaTimes for the remove button

// Accept new props: currentPhotos, newPhotos, and the updated removePhoto function
const General = ({ salon, currentPhotos = [], newPhotos = [], handleChange, handlePhotoChange, removePhoto }) => {

    const inputRef = useRef();

    const handleAddPhotoClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    // Calculate total photos shown for the counter
    const totalPhotosCount = currentPhotos.length + newPhotos.length;

    return (
        <div className='form-zone'>
            {/* --- Sección de Nombre (sin cambios) --- */}
            <div className='section-zone'>
                <h3 htmlFor="nombre">Nombre Salón</h3>
                <input
                    id="nombre"
                    name="nombre"
                    value={salon.nombre}
                    onChange={handleChange}
                    type="text"
                    placeholder="Ej: Salón de Fiestas Alegría"
                />
            </div>

            {/* --- Sección de Descripción (sin cambios) --- */}
            <div className='section-zone'>
                <h3 htmlFor="descripcion">Descripción</h3>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    value={salon.descripcion}
                    onChange={handleChange}
                    placeholder="Describe tu salón..."
                ></textarea>
            </div>

            {/* --- Sección de Fotos (MODIFICADA) --- */}
            <div className='section-zone'>
                {/* Muestra el contador actual vs. el límite */}
                <h3 htmlFor="fotos">Fotos {totalPhotosCount}/5</h3>
                <input
                    ref={inputRef}
                    id="fotos"
                    type="file"
                    style={{ display: "none" }}
                    multiple
                    accept="image/*"
                    onChange={handlePhotoChange}
                    // Limitar la selección en el input si ya se alcanzó el máximo (opcional, pero buena UX)
                    disabled={totalPhotosCount >= 5}
                />

                <div className='photo-previews'>
                    {/* Renderizar fotos existentes (currentPhotos) */}
                    {currentPhotos.map((photo, index) => (
                        <div key={`current-${index}-${photo.url}`} className='image-container'>
                            <img
                                src={photo.url} // Asume que photo es { url: string, public_id?: string }
                                alt={`Foto existente ${index + 1}`}
                            />
                            {/* Llama a removePhoto indicando que es existente (true) */}
                            <button
                                type="button"
                                onClick={() => removePhoto(index, true)} // Pasamos true
                                aria-label="Eliminar foto existente"
                            >
                                <FaTimes /> {/* Usar icono de X */}
                            </button>
                        </div>
                    ))}

                    {/* Renderizar previsualización de fotos nuevas (newPhotos) */}
                    {newPhotos.map((file, index) => {
                        const previewUrl = URL.createObjectURL(file);
                        // El índice real para la función removePhoto debe considerar las currentPhotos
                        const combinedIndex = currentPhotos.length + index;
                        return (
                            <div key={`new-${index}-${file.name}`} className='image-container'>
                                <img
                                    src={previewUrl}
                                    alt={`Nueva foto ${index + 1}`}
                                    // Liberar memoria del objeto URL
                                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                                />
                                {/* Llama a removePhoto indicando que NO es existente (false) */}
                                <button
                                    type="button"
                                    // Pasamos el índice del archivo dentro de newPhotos
                                    onClick={() => removePhoto(index, false)} // Pasamos false y el índice relativo a newPhotos
                                    aria-label="Eliminar nueva foto"
                                >
                                    <FaTimes /> {/* Usar icono de X */}
                                </button>
                            </div>
                        );
                    })}

                    {/* Botón para añadir más fotos (solo si no se ha alcanzado el límite) */}
                    {totalPhotosCount < 5 && (
                        <div onClick={handleAddPhotoClick} className='image-container-ref' title="Añadir foto">
                            <FaPlus color='var(--primary-color)' />
                        </div>
                    )}
                </div>
                {/* Mensaje informativo */}
                {totalPhotosCount > 0 && <p style={{ fontSize: '0.9em', color: '#555' }}>Tienes {totalPhotosCount} de 5 fotos.</p>}
                 {totalPhotosCount >= 5 && <p style={{ fontSize: '0.9em', color: 'orange' }}>Has alcanzado el límite de 5 fotos.</p>}
            </div>
        </div>
    );
};

export default General;