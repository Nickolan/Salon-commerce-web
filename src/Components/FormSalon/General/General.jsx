// src/Components/FormSalon/General/General.jsx
import React, { useRef } from 'react';
import './General.css';
import { FaPlus, FaTimes } from "react-icons/fa";

// Accept all potential props: salon, photos, currentPhotos, newPhotos, handleChange, handlePhotoChange, removePhoto
const General = ({
    salon,
    photos = [], // Default to empty array (for Create mode)
    currentPhotos = [], // Default to empty array (relevant for Edit mode)
    newPhotos = [], // Default to empty array (relevant for Edit mode)
    handleChange,
    handlePhotoChange,
    removePhoto
}) => {

    const inputRef = useRef();

    const handleAddPhotoClick = () => { //
        if (inputRef.current) { //
            inputRef.current.click(); //
        } //
    }; //

    // --- 👇 DETERMINE WHICH PHOTOS TO DISPLAY ---
    // If newPhotos/currentPhotos are explicitly passed (Edit mode), use them.
    // Otherwise, assume 'photos' contains the files (Create mode).
    const isEditMode = currentPhotos.length > 0 || newPhotos.length > 0;
    const existingPhotosToDisplay = isEditMode ? currentPhotos : []; // Array of {url, public_id}
    // In create mode, 'photos' holds the files. In edit mode, 'newPhotos' holds them.
    const newFilesToDisplay = isEditMode ? newPhotos : photos; // Array of File objects
    // ------------------------------------------

    // Calculate total photos shown for the counter
    const totalPhotosCount = existingPhotosToDisplay.length + newFilesToDisplay.length; //

    return (
        <div className='form-zone'> {/* */}
            {/* --- Sección de Nombre --- */}
            <div className='section-zone'> {/* */}
                <h3 htmlFor="nombre">Nombre Salón</h3> {/* */}
                <input //
                    id="nombre" //
                    name="nombre" //
                    value={salon.nombre} //
                    onChange={handleChange} //
                    type="text" //
                    placeholder="Ej: Salón de Fiestas Alegría" //
                /> {/* */}
            </div>

            {/* --- Sección de Descripción --- */}
            <div className='section-zone'> {/* */}
                <h3 htmlFor="descripcion">Descripción</h3> {/* */}
                <textarea //
                    id="descripcion" //
                    name="descripcion" //
                    value={salon.descripcion} //
                    onChange={handleChange} //
                    placeholder="Describe tu salón..." //
                ></textarea> {/* */}
            </div>

            {/* --- Sección de Fotos --- */}
            <div className='section-zone'> {/* */}
                <h3 htmlFor="fotos">Fotos {totalPhotosCount}/5</h3> {/* */}
                <input //
                    ref={inputRef} //
                    id="fotos" //
                    type="file" //
                    style={{ display: "none" }} //
                    multiple //
                    accept="image/*" //
                    onChange={handlePhotoChange} //
                    disabled={totalPhotosCount >= 5} //
                /> {/* */}

                <div className='photo-previews'> {/* */}
                    {/* Renderizar fotos existentes (Edit mode) */}
                    {existingPhotosToDisplay.map((photo, index) => ( //
                        <div key={`current-${index}-${photo.url || index}`} className='image-container'> {/* */}
                            <img //
                                src={photo.url} //
                                alt={`Foto existente ${index + 1}`} //
                            /> {/* */}
                            <button //
                                type="button" //
                                onClick={() => removePhoto(index, true)} // Pass true for existing
                                aria-label="Eliminar foto existente" //
                            > {/* */}
                                <FaTimes /> {/* */}
                            </button> {/* */}
                        </div> //
                    ))}

                    {/* Renderizar previsualización de fotos nuevas (Create and Edit mode) */}
                    {newFilesToDisplay.map((file, index) => { // Iterate over the correct array
                        const previewUrl = URL.createObjectURL(file); // Create preview
                        // Determine the correct index for removal based on mode
                        const removalIndex = isEditMode ? index : index; // In create mode, index is direct
                        const isExistingFlag = false; // These are always new files

                        return ( //
                            <div key={`new-${index}-${file.name}`} className='image-container'> {/* */}
                                <img //
                                    src={previewUrl} //
                                    alt={`Nueva foto ${index + 1}`} //
                                    // Liberar memoria del objeto URL
                                    onLoad={() => URL.revokeObjectURL(previewUrl)} //
                                    onError={(e) => { e.target.style.display='none'; URL.revokeObjectURL(previewUrl)}} // Also revoke on error
                                /> {/* */}
                                <button //
                                    type="button" //
                                    // Pass the correct index and false (not existing)
                                    onClick={() => removePhoto(removalIndex, isExistingFlag)} //
                                    aria-label="Eliminar nueva foto" //
                                > {/* */}
                                    <FaTimes /> {/* */}
                                </button> {/* */}
                            </div> //
                        ); //
                    })}

                    {/* Botón para añadir más fotos */}
                    {totalPhotosCount < 5 && ( //
                        <div onClick={handleAddPhotoClick} className='image-container-ref' title="Añadir foto"> {/* */}
                            <FaPlus color='var(--primary-color)' /> {/* */}
                        </div> //
                    )} {/* */}
                </div> {/* */}
                {/* Mensajes informativos */}
                {totalPhotosCount > 0 && <p style={{ fontSize: '0.9em', color: '#555' }}>Tienes {totalPhotosCount} de 5 fotos.</p>} {/* */}
                {totalPhotosCount >= 5 && <p style={{ fontSize: '0.9em', color: 'orange' }}>Has alcanzado el límite de 5 fotos.</p>} {/* */}
            </div> {/* */}
        </div> //
    ); //
}; //

export default General;