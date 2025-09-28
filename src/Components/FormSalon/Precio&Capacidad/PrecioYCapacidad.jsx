import React, { useEffect, useState } from 'react'
import { MdOutlineAttachMoney } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import './PrecioYCapacidad.css'

const PrecioYCapacidad = ({ salon, handleChange }) => {

    const [totalaRecibir, setTotalaRecibir] = useState(null);
    const cobroGestion = 10

    function calcularGestion() {
        var total = salon.precio_por_hora * (1 - 1/cobroGestion);

        setTotalaRecibir(total)
    }

    useEffect(() => {
        calcularGestion();
    },[salon.precio_por_hora])
    
    return (
        <div className='form-zone   zone-row'>

            <div className='section-zone'>
                <h3>Precio x Hora</h3>
                <div>

                    <input
                        id="nombre"
                        name="precio_por_hora"
                        value={salon.precio_por_hora}
                        onChange={handleChange}
                        type="number"
                        placeholder="Ej: 5000"
                    />
                    <MdOutlineAttachMoney />
                </div>

                <div className='cobro-gestion'>

                {
                    totalaRecibir && <span>Recibes {totalaRecibir}</span>
                }
                
                <span >{cobroGestion}% Cobro de gestion</span>
                </div>
            </div>

            <div className='section-zone'>
                <h3>Capacidad</h3>
                <div>

                    <input
                        id="nombre"
                        name="capacidad"
                        value={salon.capacidad}
                        onChange={handleChange}
                        type="number"
                        placeholder="Ej: 5"
                        min={1}
                    />
                    <GoPeople />
                </div>

            </div>

        </div>
    )
}

export default PrecioYCapacidad
