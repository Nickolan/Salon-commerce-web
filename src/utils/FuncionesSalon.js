import Salones from './Salones.json'
// La URL base de tu API de backend
const API_URL = 'http://localhost:3000'; // O el puerto que estés usando

export async function AgregarSalon(salon, photos, reglas, equipamiento, disponibilidad) {
    // Extraemos los datos del objeto 'salon' que viene del formulario
    const { 
        nombre, 
        descripcion, 
        precio_por_hora, 
        capacidad, 
        direccion, 
        latitud, 
        longitud, 
        granularidad_minutos, 
        horizonte_meses 
    } = salon;

    // 1. Validamos que los campos obligatorios no estén vacíos
    if (!nombre || !descripcion || !precio_por_hora || !capacidad || !direccion || photos.length < 1) {
        alert("Debes completar todos los campos obligatorios (Nombre, Descripción, Precio, Capacidad, Dirección y al menos una foto).");
        return; // Detenemos la ejecución si falta algo
    }
    
    // 2. Filtramos solo los días que el publicador marcó como disponibles.
    const disponibilidadesActivas = disponibilidad
        .filter(d => d.disponible)
        .map(d => ({
            dia_semana: d.dia, // Asegúrate que el nombre coincida con el Enum del backend
            hora_inicio: d.desde,
            hora_fin: d.hasta,
        }));

    // 3. Construimos el objeto final que se enviará al backend.
    const salonPayload = {
        nombre,
        descripcion,
        precio_por_hora: parseFloat(precio_por_hora),
        capacidad: parseInt(capacidad, 10),
        direccion,
        latitud,
        longitud,
        reglas,
        equipamientos: equipamiento,
        disponibilidades: disponibilidadesActivas,
        granularidad_minutos: parseInt(granularidad_minutos, 10),
        horizonte_meses: parseInt(horizonte_meses, 10),
        id_publicador: 1 // TEMPORAL: Debes obtener el ID del usuario logueado
        // 'fotos' se manejará por separado, usualmente como 'multipart/form-data'
    };

    // 4. Simulación de la llamada a la API con fetch
    try {
        console.log("Enviando al backend:", JSON.stringify(salonPayload, null, 2));

        // En un futuro, aquí harías la llamada real a tu API:
        /*
        const response = await fetch(`${API_URL}/salones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(salonPayload),
        });

        if (!response.ok) {
            throw new Error('La respuesta del servidor no fue exitosa');
        }

        const salonCreado = await response.json();
        console.log('Salón creado con éxito:', salonCreado);
        */

        alert("¡Salón publicado con éxito! (Simulación)");
        
        // Aquí podrías redirigir al usuario
        // window.location.href = '/mis-salones';

    } catch (error) {
        console.error("Error al publicar el salón:", error);
        alert("Hubo un error al publicar el salón. Inténtalo de nuevo.");
    }
}