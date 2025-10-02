import Salones from './Salones.json'

export async function AgregarSalon(salon, photos, reglas, equipamientoSeleccionado, disponibilidad) {
    // verificacion
    const {nombre, descripcion, precio_por_hora, capacidad, direccion, latitud, longitud} = salon

    if (!nombre || !descripcion || !precio_por_hora || !capacidad || photos.length < 1 ) {
        alert("Debes completar todos los campos")
        return;
    }
    
    Salones.push(salon)
}
