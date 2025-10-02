import React, { useState } from 'react';
import { Link } from "react-router-dom";
import BarraBusqueda from '../Components/BarraBusqueda/BarraBusqueda';
import "../styles/MisSalonesScreen.css";
import Salones from "../utils/Salones.json";
import { FiEdit, FiXCircle, FiUsers, FiMapPin, FiDollarSign } from "react-icons/fi";

const USUARIO_ACTUAL = 2; //simulación de un usuario

const MisSalonesScreen = () => {
    
    const [salones, setSalones] = useState(Salones);
    const [salonBuscado, setSalonBuscado] = useState("");

    const normalizarTexto = (text) =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); //para poder buscar sin importar espacios, acentos ni mayusculas

    const handleSearch = (query) => {
        setSalonBuscado(query);
    };

    const salonesFiltrados = salones
        .filter( salon => salon.id_publicador === USUARIO_ACTUAL)
        .filter(salon => normalizarTexto(salon.nombre).includes(normalizarTexto(salonBuscado))
    ); //para recorrer todos los salones y que retorne solo los que cumplan con la normalización del texto

    const handleCancelar = (id) => {
        if (window.confirm("¿Deseas cancelar este salón?")) {
            setSalones(prev => prev.filter(s => s.id_salon !== id));
        } //muestra un mensaje en pantalla, si confirmás, filtra la lista eliminando al salón con ese id y settea los salones
    }

    return (
        <div className='pagina-misSalones'>
            <h1 className='titulo'>Mis Salones</h1>

            <BarraBusqueda 
                placeholder='Buscar salón...' 
                onSearch={handleSearch} 
                totalSalones={salonesFiltrados.length} 
            />

            <div className='listado-salones'>
                {salonesFiltrados.length === 0 ? (
                    <p className='sin-resultados'>No se encontraron salones.</p>
                ) : (
                    salonesFiltrados.map(salon => (
                        <div key={salon.id_salon} className='card-salon'>
                            <div className='card-imagen-wrapper'>
                                <img 
                                    src={salon.fotos[0]} 
                                    alt={salon.nombre} 
                                    className='card-imagen' 
                                />
                            </div>

                            <div className='card-izquierda'>
                                <div className='salon-nombre-capacidad'>
                                    <p className='salon-nombre'>{salon.nombre}</p>
                                    <p className='salon-caracteristica'>
                                         - {salon.capacidad}
                                        <FiUsers className='icono'/>
                                    </p>
                                </div>
                                <p className='salon-caracteristica'>
                                    <FiMapPin className='icono' />
                                    {salon.ubicacion}
                                </p>
                                <p className='salon-caracteristica'>
                                    <FiDollarSign className='icono' />
                                    {salon.precio_por_hora} por hora
                                </p>
                            </div>

                            <div className='card-derecha'>
                                <div className='botones'>
                                    <Link to="/editar-salon">
                                        <button><FiEdit/></button>
                                    </Link>
                                    <button onClick={() => handleCancelar(salon.id_salon)}>
                                        <FiXCircle/>
                                    </button>
                                </div>
                                <div className='estado-publicacion'>
                                    <p>{salon.estado_publicacion}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MisSalonesScreen;