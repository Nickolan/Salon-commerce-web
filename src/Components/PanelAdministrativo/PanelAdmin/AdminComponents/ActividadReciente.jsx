// PanelAdmin/AdminComponents/ActividadReciente.jsx
import React, { useState, useMemo } from 'react';
import './ActividadReciente.css';

const ActividadReciente = ({ data, selectedMonth }) => {
  const [modoExpandido, setModoExpandido] = useState(false);
  
  // Función para formatear fecha relativa (hace X minutos, horas, días)
  const formatearFechaRelativa = (fecha) => {
    if (!fecha) return 'Fecha desconocida';
    
    const fechaEvento = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora - fechaEvento;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);
    
    if (diffMin < 1) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} h`;
    if (diffDias === 1) return 'Ayer';
    if (diffDias < 7) return `Hace ${diffDias} días`;
    if (diffDias < 30) return `Hace ${diffDias} días`;
    
    // Si es más de un mes, mostrar fecha corta
    return fechaEvento.toLocaleDateString('es-AR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Función para obtener iniciales del nombre
  const obtenerIniciales = (nombre, apellido) => {
    if (!nombre && !apellido) return '??';
    const inicialNombre = nombre ? nombre.charAt(0).toUpperCase() : '';
    const inicialApellido = apellido ? apellido.charAt(0).toUpperCase() : '';
    return inicialNombre + inicialApellido || '??';
  };

  // Función para truncar texto largo
  const truncarTexto = (texto, maxLength = 30) => {
    if (!texto) return '';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
  };

  // Función para verificar si una fecha pertenece al mes seleccionado
  const estaEnMesSeleccionado = (fecha) => {
    if (!fecha || !selectedMonth) return false;
    const fechaObj = new Date(fecha);
    const [year, month] = selectedMonth.split('-').map(Number);
    return fechaObj.getFullYear() === year && fechaObj.getMonth() + 1 === month;
  };

  // Generar actividades basadas en datos reales
  const actividades = useMemo(() => {
    const nuevasActividades = [];
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];
    
    console.log('📊 Datos recibidos en ActividadReciente:', {
      usuarios: data?.usuarios?.length || 0,
      salones: data?.salones?.length || 0,
      reservas: data?.reservas?.length || 0,
      transacciones: data?.transacciones?.length || 0,
      selectedMonth
    });

    // 1. Actividades de usuarios
    if (data?.usuarios && Array.isArray(data.usuarios)) {
      data.usuarios.forEach(usuario => {
        const fechaCreacion = usuario.fecha_creacion || usuario.createdAt || usuario.fecha_registro;
        if (fechaCreacion && estaEnMesSeleccionado(fechaCreacion)) {
          nuevasActividades.push({
            id: `user-${usuario.id_usuario || usuario.id}-${fechaCreacion}`,
            tipo: 'usuario',
            usuario: {
              nombre: usuario.nombre || '',
              apellido: usuario.apellido || '',
              iniciales: obtenerIniciales(usuario.nombre, usuario.apellido)
            },
            textoCompleto: `${usuario.nombre || ''} ${usuario.apellido || ''} se unió como usuario`.trim(),
            detalle: `ID: ${usuario.id_usuario || usuario.id}`,
            fecha: formatearFechaRelativa(fechaCreacion),
            timestamp: new Date(fechaCreacion).getTime(),
            fechaOriginal: fechaCreacion
          });
        }
      });
    }

    // 2. Actividades de nuevos salones
    if (data?.salones && Array.isArray(data.salones)) {
      data.salones.forEach(salon => {
        const fechaCreacion = salon.fecha_creacion || salon.createdAt || salon.fechaCreacion;
        if (fechaCreacion && estaEnMesSeleccionado(fechaCreacion)) {
          const publicador = salon.publicador || {};
          nuevasActividades.push({
            id: `salon-${salon.id_salon || salon.id}-${fechaCreacion}`,
            tipo: 'salon',
            usuario: {
              nombre: publicador.nombre || 'Usuario',
              apellido: publicador.apellido || '',
              iniciales: obtenerIniciales(publicador.nombre, publicador.apellido)
            },
            textoCompleto: truncarTexto(`${publicador.nombre || ''} ${publicador.apellido || ''} publicó ${salon.nombre || 'nuevo salón'}`, 35),
            detalle: `Salón #${salon.id_salon || salon.id}`,
            fecha: formatearFechaRelativa(fechaCreacion),
            timestamp: new Date(fechaCreacion).getTime(),
            fechaOriginal: fechaCreacion
          });
        }
      });
    }

    // 3. Actividades de nuevas reservas
    if (data?.reservas && Array.isArray(data.reservas)) {
      data.reservas.forEach(reserva => {
        const fechaCreacion = reserva.fecha_creacion || reserva.createdAt || reserva.fecha_reserva;
        if (fechaCreacion && estaEnMesSeleccionado(fechaCreacion)) {
          const arrendatario = reserva.arrendatario || {};
          const salon = reserva.salon || {};
          nuevasActividades.push({
            id: `reserva-${reserva.id_reserva || reserva.id}-${fechaCreacion}`,
            tipo: 'reserva',
            usuario: {
              nombre: arrendatario.nombre || 'Usuario',
              apellido: arrendatario.apellido || '',
              iniciales: obtenerIniciales(arrendatario.nombre, arrendatario.apellido)
            },
            textoCompleto: truncarTexto(`${arrendatario.nombre || ''} ${arrendatario.apellido || ''} reservó ${salon.nombre || 'un salón'}`, 35),
            detalle: `Reserva #${reserva.id_reserva || reserva.id}`,
            fecha: formatearFechaRelativa(fechaCreacion),
            timestamp: new Date(fechaCreacion).getTime(),
            fechaOriginal: fechaCreacion
          });
        }
      });
    }

    // 4. Actividades de transacciones
    if (data?.transacciones && Array.isArray(data.transacciones)) {
      data.transacciones.forEach(trans => {
        const fechaTrans = trans.fecha_transaccion || trans.createdAt;
        if (fechaTrans && estaEnMesSeleccionado(fechaTrans)) {
          const reserva = trans.reserva || {};
          const arrendatario = reserva.arrendatario || {};
          nuevasActividades.push({
            id: `trans-${trans.id_transaccion || trans.id}-${fechaTrans}`,
            tipo: 'transaccion',
            usuario: {
              nombre: arrendatario.nombre || 'Usuario',
              apellido: arrendatario.apellido || '',
              iniciales: obtenerIniciales(arrendatario.nombre, arrendatario.apellido)
            },
            textoCompleto: truncarTexto(`Pago de ${arrendatario.nombre || ''} ${arrendatario.apellido || ''} - $${(trans.monto_pagado || 0).toLocaleString()}`, 35),
            detalle: `Transacción #${trans.id_transaccion || trans.id}`,
            fecha: formatearFechaRelativa(fechaTrans),
            timestamp: new Date(fechaTrans).getTime(),
            fechaOriginal: fechaTrans
          });
        }
      });
    }

    // Ordenar por fecha (más reciente primero)
    const ordenadas = nuevasActividades.sort((a, b) => b.timestamp - a.timestamp);
    
    console.log(`📋 Actividades del mes ${selectedMonth} generadas:`, ordenadas.length);
    
    return ordenadas;
  }, [data, selectedMonth]);

  // Tomar solo los 10 más recientes
  const actividadesAMostrar = modoExpandido ? actividades : actividades.slice(0, 10);
  
  // Para el modo compacto, mostrar solo los 3 primeros
  const actividadesCompacto = actividades.slice(0, 3);

  const handleVerTodo = () => {
    setModoExpandido(!modoExpandido);
  };

  // Formatear el mes para mostrarlo bonito
  const formatearMesTitulo = (month) => {
    if (!month) return 'Actividad Reciente';
    const [year, monthNum] = month.split('-').map(Number);
    const fecha = new Date(year, monthNum - 1);
    return fecha.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  };

  // Si no hay actividades en el mes, mostrar mensaje
  if (actividades.length === 0) {
    return (
      <div className="actividad-reciente">
        <div className="actividad-header">
          <h3 className="actividad-titulo">Actividad Reciente - {formatearMesTitulo(selectedMonth)}</h3>
        </div>
        <div className="actividad-lista modo-compacto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Montserrat', fontSize: '12px', color: '#999', textAlign: 'center' }}>
            No hay actividad en {formatearMesTitulo(selectedMonth)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="actividad-reciente">
      <div className="actividad-header">
        <h3 className="actividad-titulo">
          Actividad Reciente - {formatearMesTitulo(selectedMonth)}
        </h3>
        {actividades.length > 3 && (
          <div className="actividad-ver-todo" onClick={handleVerTodo}>
            {modoExpandido ? 'Ver menos' : `Ver todo `}
          </div>
        )}
      </div>

      <div className={`actividad-lista ${modoExpandido ? 'modo-expandido' : 'modo-compacto'}`}>
        {(modoExpandido ? actividadesAMostrar : actividadesCompacto).map((actividad, index) => (
          <React.Fragment key={actividad.id}>
            <div className={`actividad-item ${modoExpandido ? 'modo-expandido' : ''}`}>
              {/* Avatar */}
              <div className="actividad-avatar">
                {actividad.usuario.iniciales}
              </div>
              
              {/* Texto principal */}
              <div className="actividad-texto-principal" title={actividad.textoCompleto}>
                {actividad.textoCompleto}
              </div>
              
              {/* Detalle y fecha */}
              {!modoExpandido && (
                <div className="actividad-detalle-linea">
                  <span className="actividad-detalle" title={actividad.detalle}>{actividad.detalle}</span>
                  <span className="actividad-fecha">{actividad.fecha}</span>
                </div>
              )}
            </div>
            
            {/* Modo expandido */}
            {modoExpandido && (
              <div className="actividad-item-expandido">
                <div className="actividad-avatar">
                  {actividad.usuario.iniciales}
                </div>
                <div className="actividad-contenido-expandido">
                  <div className="actividad-texto-principal" title={actividad.textoCompleto}>
                    {actividad.textoCompleto}
                  </div>
                  <div className="actividad-detalle-linea">
                    <span className="actividad-detalle" title={actividad.detalle}>{actividad.detalle}</span>
                  </div>
                  <div className="actividad-fecha-expandido">
                    {actividad.fecha}
                  </div>
                </div>
              </div>
            )}
            
            {index < (modoExpandido ? actividadesAMostrar.length : actividadesCompacto.length) - 1 && (
              <hr className="actividad-divisor" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ActividadReciente;