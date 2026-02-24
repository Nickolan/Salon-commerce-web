import axios from 'axios';
import React, { useState } from 'react';
// 1. Importa FaLink y FaSpinner para el estado de carga
import { FaDollarSign, FaLink, FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
// 2. Importa el nuevo archivo de estilos
import './VistaMP.css'; // o './VistaMP.scss' si usas SASS

const VistaMP = ({ usuario }) => {
    const [mpAuthUrl, setMpAuthUrl] = useState('');
    const [loadingMpUrl, setLoadingMpUrl] = useState(false);
    const token = localStorage.getItem('accessToken');

    const handleVincularMP = async () => {
        setLoadingMpUrl(true);
        try {
            console.log("ejecutando vinculacion con mp");
            
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`https://salon-commerce-server.onrender.com/pagos/connect/mp`, config);
            console.log(response.data);
            
            //window.location.href = response.data.authUrl;
        } catch (error) {
            console.error("Error al obtener URL de MP", error);
            Swal.fire('Error', 'No se pudo iniciar la vinculación con Mercado Pago.', 'error');
            setLoadingMpUrl(false);
        }
    };

    return (
        <div className="extra-data-item mp-card"> {/* Añadimos una clase 'mp-card' */}
            <h3 className="mp-title">Pagos (Mercado Pago)</h3>
            
            {usuario.mpUserId ? (
                // Estado "Vinculado" (Ahora es un "pill" verde)
                <div className="mp-vinculado">
                    <FaDollarSign color="inherit" size={16} />
                    <span>Cuenta Vinculada</span>
                </div>
            ) : (
                // Estado "No Vinculado" (Botón de acción)
                <button
                    className="button-vincular-mp"
                    onClick={handleVincularMP}
                    disabled={loadingMpUrl}
                >
                    {loadingMpUrl ? (
                        // Icono de carga animado
                        <FaSpinner className="spinner-icon" size={20} />
                    ) : (
                        <FaLink size={18} />
                    )}
                    {loadingMpUrl ? "Cargando..." : "Vincular mi cuenta"}
                </button>
            )}
            
            <p className="mp-info-text">
                Vincula tu cuenta para recibir el pago de tus viajes directamente.
            </p>
        </div>
    )
}

export default VistaMP;