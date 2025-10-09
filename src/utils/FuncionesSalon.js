import Salones from './Salones.json'

export async function AgregarSalon(salon, photos, reglas, equipamiento, disponibilidad) {
    const { nombre, descripcion, precio_por_hora, capacidad, ...restoSalon } = salon;

    // 1. Filtrar solo los días que están marcados como disponibles.
    const disponibilidadesActivas = disponibilidad
        .filter(d => d.disponible)
        .map(d => ({
            dia_semana: d.dia, // Asegúrate que el nombre coincida con el Enum del backend
            hora_inicio: d.desde,
            hora_fin: d.hasta,
        }));

    // 2. Construir el objeto final que se enviará al backend.
    const salonPayload = {
        ...restoSalon,
        nombre,
        descripcion,
        precio_por_hora: parseFloat(precio_por_hora),
        capacidad: parseInt(capacidad, 10),
        reglas,
        equipamientos: equipamiento,
        disponibilidades: disponibilidadesActivas, // <-- Array de disponibilidades activas
    };

    // 3. Simulación de la llamada a la API con fetch (reemplaza esto con tu lógica real)
    try {
        console.log("Enviando al backend:", JSON.stringify(salonPayload, null, 2));

        // const response = await fetch(`${API_URL}/salones`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(salonPayload),
        // });

        // if (!response.ok) {
        //     throw new Error('La respuesta del servidor no fue exitosa');
        // }

        // const salonCreado = await response.json();
        // console.log('Salón creado con éxito:', salonCreado);
        alert("¡Salón publicado con éxito! (Simulación)");
        
        // Aquí podrías redirigir al usuario, por ejemplo:
        // window.location.href = '/mis-salones';

    } catch (error) {
        console.error("Error al publicar el salón:", error);
        alert("Hubo un error al publicar el salón. Inténtalo de nuevo.");
    }
}