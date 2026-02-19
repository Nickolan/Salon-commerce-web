// src/mocks/chatMocks.js
export const mockConversaciones = [
  {
    id: 1,
    cliente_id: 10,
    publicante_id: 101,
    publicante: {
      nombre: "Juan Pérez - Salón Abasto",
      foto: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    mensajes: [
      { id: 1, contenido: "Hola, ¿está disponible el sábado?", remitente_id: 10, created_at: "2024-03-20T10:00:00Z" },
      { id: 2, contenido: "¡Hola! Sí, aún tenemos disponibilidad.", remitente_id: 101, created_at: "2024-03-20T10:05:00Z" }
    ],
    updated_at: "2024-03-20T10:05:00Z"
  },
  {
    id: 2,
    cliente_id: 10,
    publicante_id: 202,
    publicante: {
      nombre: "María García - Eventos Mendoza",
      foto: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    mensajes: [
      { id: 3, contenido: "El precio incluye el catering?", remitente_id: 10, created_at: "2024-03-19T15:00:00Z" },
      { id: 4, contenido: "No, el catering es un servicio adicional.", remitente_id: 202, created_at: "2024-03-19T15:30:00Z" }
    ],
    updated_at: "2024-03-19T15:30:00Z"
  }
];