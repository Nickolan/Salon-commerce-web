import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarioReservas.css';

const locales = {
  'es': require('date-fns/locale/es'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarioReservas = ({ franjas }) => {
  // Transformamos las franjas de la API al formato que necesita el calendario
  const eventos = franjas.map(franja => ({
    title: franja.estado === 'disponible' ? `$${franja.precio}` : 'Reservado',
    start: new Date(franja.hora_inicio),
    end: new Date(franja.hora_fin),
    resource: { ...franja } // Guardamos la data original por si la necesitamos
  }));

  const eventStyleGetter = (event) => {
    const backgroundColor = event.resource.estado === 'disponible' ? '#A0E6A4' : '#F1948A';
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: '#333',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  const handleSelectEvent = (event) => {
    if (event.resource.estado === 'disponible') {
      alert(`Seleccionaste la franja de ${format(event.start, 'HH:mm')} a ${format(event.end, 'HH:mm')}. ¡Aquí iría la lógica de reserva!`);
    }
  };

  return (
    <div className="calendario-container">
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        culture="es"
        messages={{
          next: "Sig",
          previous: "Ant",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        view="week" // Vista por defecto
        views={['month', 'week', 'day']}
        min={new Date(0, 0, 0, 8, 0, 0)} // Hora mínima visible: 8:00 AM
        max={new Date(0, 0, 0, 23, 0, 0)} // Hora máxima visible: 11:00 PM
      />
    </div>
  );
};

export default CalendarioReservas;