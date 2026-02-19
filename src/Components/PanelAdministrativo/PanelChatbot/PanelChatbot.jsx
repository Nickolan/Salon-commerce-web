import React, { useState, useMemo, useEffect } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';
import './PanelChatbot.css';
const PanelChatbot = () => {
    const conversacionData = [
        { session_id: 1, rol: 'usuario', mensaje: '¿Tienen stock de camisas?', util: null, fecha: '2026-02-16' },
        { session_id: 1, rol: 'ia', mensaje: 'Sí, tenemos en talle M y L', util: true, fecha: '2026-02-16' }, // Esta será VERDE
        { session_id: 2, rol: 'usuario', mensaje: '¿Dónde están ubicados?', util: null, fecha: '2026-02-16' },
        { session_id: 2, rol: 'ia', mensaje: 'No entiendo tu pregunta', util: false, fecha: '2026-02-16' }  // Esta será ROJA
    ];
    const sesiones = useMemo(() => {
        const grupos = {}
        conversacionData.forEach(item => {
            if (!grupos[item.session_id]) {
                grupos[item.session_id] = {
                    id: item.session_id,
                    ultimoMensaje: "",
                    fecha: item.fecha,
                    status: "neutral"
                }
            }
            grupos[item.session_id].ultimoMensaje = item.mensaje
            grupos[item.session_id].fecha = item.fecha
            if (item.rol === "ia" && item.util !== null) {
                grupos[item.session_id].status = item.util ? "verde" : "rojo"
            }


        })
        return Object.values(grupos)
    }, [conversacionData]);
    return (
        <div className='panel-chatbot-principal'>
            <div className='panel-chatbot-encabezado'>
                <h1>Conversaciones</h1>
                <h2>Total:</h2>
                {/* ACA VA EL FILTRO DE FECHA Y CANTIDAD TOTAL DE CONVERSACIONES ENCONTRADAS*/}
                <h2>fecha</h2>
            </div>
            <div className='panel-conversaciones'>
                <div className='panelizquierdo-conversaciones'>
                    <div className='panelizquierdo-conversaciones-titulo'>
                        <h2>Historial</h2>
                    </div>
                    {sesiones.map(sesion => (
                        <div key={sesion.id} className={`sesion-item ${sesion.status}`}>
                            <p className='sesion-item-msg'>{sesion.ultimoMensaje}</p>
                            <p>{sesion.fecha}</p>
                        </div>
                    ))}
                </div>
                <div className='panelderecho-conversaciones'>
                    <table className='tabla-conversacionpuntual'>
                        <thead className='head-tablaconversacionpuntual'>
                            <tr>
                                <th>Rol</th>
                                <th>Mensaje</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Usuario</td>
                                <td className='td-mensaje'>Hola</td>
                                <td>12:20</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default PanelChatbot;

