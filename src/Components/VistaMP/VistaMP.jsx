import axios from 'axios';
import React, { useState } from 'react';
import { FaDollarSign, FaLink, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './VistaMP.css'; 

const VistaMP = ({ usuario }) => {
    // Ya no necesitas guardar mpAuthUrl en el estado, lo usamos directamente
    const [loadingMpUrl, setLoadingMpUrl] = useState(false);
    const token = localStorage.getItem('accessToken');

    const handleVincularMP = async () => {
        setLoadingMpUrl(true);
        try {
            console.log("Solicitando URL de vinculación a MP...");
            
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            
            const response = await axios.get(`https://salon-commerce-server.onrender.com/pagos/connect/mp`, config);
            
            // Verificamos que el backend nos devuelva la URL
            if (response.data && response.data.url) {
                // Redirigimos la ventana completa hacia Mercado Pago
                window.location.href = response.data.url;
            } else {
                throw new Error("La respuesta del servidor no contiene la URL.");
            }
            
        } catch (error) {
            console.error("Error al obtener URL de MP", error);
            Swal.fire('Error', 'No se pudo iniciar la vinculación con Mercado Pago.', 'error');
            setLoadingMpUrl(false); // Liberamos el estado de carga en caso de error
        }
        // Nota: no hacemos setLoadingMpUrl(false) en el caso de éxito porque 
        // la página se recargará hacia Mercado Pago.
    };

    // Asegúrate de que tu objeto usuario tenga la propiedad correcta (ej. mp_access_token o mp_connected)
    // En tu backend guardas "mp_access_token", así que evalúa qué te devuelve tu API al cargar el perfil.
    const estaVinculado = !!usuario.mpUserId; // Cambia esto si en tu DB es usuario.mp_access_token

    return (
        <div className="extra-data-item mp-card">
            <h3 className="mp-title">Pagos (Mercado Pago)</h3>
            
            {estaVinculado ? (
                <div className="mp-vinculado">
                    <FaDollarSign color="inherit" size={16} />
                    <span>Cuenta Vinculada</span>
                </div>
            ) : (
                <button
                    className="button-vincular-mp"
                    onClick={handleVincularMP}
                    disabled={loadingMpUrl}
                >
                    {loadingMpUrl ? (
                        <FaSpinner className="spinner-icon" size={20} />
                    ) : (
                        <FaLink size={18} />
                    )}
                    {loadingMpUrl ? " Redirigiendo..." : " Vincular mi cuenta"}
                </button>
            )}
            
            <p className="mp-info-text">
                Vincula tu cuenta para recibir el pago del alquiler de tus salones directamente.
            </p>
        </div>
    );
}

export default VistaMP;