import React, { useState, useEffect } from 'react';
import SearchbarSalones from './ComponenteSalonesAdmin/SearchbarSalones';
import ItemSalonAdmin from './ComponenteSalonesAdmin/ItemSalonAdmin';
import './PanelSalones.css';

const PanelSalones = ({ 
  salones, 
  reservas = [],
  transacciones = [],
  resenias = [],
  selectedMonth,
  onEliminarSalon,
  onBloquearSalon
}) => {
  const [filterValue, setFilterValue] = useState('');
  const [expandedSalonId, setExpandedSalonId] = useState(null);
  const [filteredSalones, setFilteredSalones] = useState(salones || []);

  useEffect(() => {
    console.log('📦 PanelSalones - Datos recibidos:', {
      salones: salones?.length,
      reservas: reservas?.length,
      transacciones: transacciones?.length,
      resenias: resenias?.length,
      selectedMonth
    });

    // 🔍 LOG DETALLADO de la primera transacción
    if (transacciones.length > 0) {
      console.log('🔍 PRIMERA TRANSACCIÓN (completa):', transacciones[0]);
      console.log('🔍 CAMPOS en transacción:', Object.keys(transacciones[0]));
      console.log('🔍 VALOR de monto_pagado:', transacciones[0].monto_pagado);
      console.log('🔍 TIPO de monto_pagado:', typeof transacciones[0].monto_pagado);
    }
  }, [salones, reservas, transacciones, resenias, selectedMonth]);

  useEffect(() => {
    if (!salones) return;
    
    if (!filterValue.trim()) {
      setFilteredSalones(salones);
    } else {
      const filtered = salones.filter(salon =>
        salon.nombre?.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredSalones(filtered);
    }
  }, [salones, filterValue]);

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  const handleApplyFilter = () => {
    // Filtrado ya aplicado
  };

  const handleToggleExpand = (salonId) => {
    setExpandedSalonId(expandedSalonId === salonId ? null : salonId);
  };

  // Función para filtrar reservas del mes seleccionado
  const filtrarReservasDelMes = (reservasList) => {
    if (!selectedMonth || !reservasList) return reservasList;
    
    const [year, month] = selectedMonth.split('-').map(Number);
    
    return reservasList.filter(reserva => {
      if (!reserva.fecha_reserva) return false;
      
      const fechaReserva = new Date(reserva.fecha_reserva);
      return fechaReserva.getFullYear() === year && 
             fechaReserva.getMonth() + 1 === month;
    });
  };

  // Función para obtener el ID de reserva de una transacción (MANEJA TODOS LOS CASOS)
  const getReservaIdFromTransaccion = (transaccion) => {
    if (!transaccion) return null;
    
    // Lista de TODOS los posibles nombres de campo para el ID de reserva
    const posiblesCampos = [
      'id_reserva',
      'reservaIdReserva',
      'reserva_id_reserva',
      'reservalldReserva',  // Este es el que vi en tu tabla
      'reservaId',
      'reserva_id',
      'reserva'
    ];
    
    for (const campo of posiblesCampos) {
      if (transaccion[campo] !== undefined && transaccion[campo] !== null) {
        // Si el campo es un objeto (como { id_reserva: 1 }), extraemos el ID
        if (typeof transaccion[campo] === 'object' && transaccion[campo] !== null) {
          return transaccion[campo].id_reserva || transaccion[campo].id;
        }
        // Si es un número o string, lo devolvemos
        return transaccion[campo];
      }
    }
    
    return null;
  };

  const calcularEstadisticasSalon = (salon) => {
    // 1. Filtrar reservas de este salón
    const todasReservasSalon = reservas.filter(r => r.salon?.id_salon === salon.id_salon);
    
    // 2. Filtrar SOLO las reservas del mes seleccionado
    const reservasSalonDelMes = filtrarReservasDelMes(todasReservasSalon);
    
    // 3. Crear un Set con los IDs de reservas del mes para búsqueda rápida
    const reservasIdsDelMes = new Set(reservasSalonDelMes.map(r => r.id_reserva));
    
    // 4. Filtrar transacciones que pertenezcan a estas reservas
    const transaccionesSalon = transacciones.filter(t => {
      const reservaId = getReservaIdFromTransaccion(t);
      const pertenece = reservaId && reservasIdsDelMes.has(Number(reservaId));
      
      // 🔍 LOG para ver cada transacción y si pertenece
      if (transacciones.length > 0 && reservaId) {
        console.log(`🔄 Transacción ${t.id_transaccion}: reservaId=${reservaId}, pertenece a salón ${salon.id_salon}? ${pertenece}`);
      }
      
      return pertenece;
    });
    
    // 5. Filtrar reseñas de este salón
    const reseniasSalon = resenias.filter(r => r.salon?.id_salon === salon.id_salon);
    
    // 6. Calcular rating promedio
    const rating = reseniasSalon.length > 0 
      ? reseniasSalon.reduce((sum, r) => sum + r.calificacion, 0) / reseniasSalon.length 
      : 0;
    
    // 7. Encontrar última reserva del mes
    const ultimaReserva = reservasSalonDelMes.length > 0 
      ? reservasSalonDelMes.sort((a, b) => new Date(b.fecha_reserva) - new Date(a.fecha_reserva))[0]
      : null;
    
    // 8. Calcular último ingreso del mes
    const transaccionesOrdenadas = [...transaccionesSalon].sort(
      (a, b) => new Date(b.fecha_transaccion || b.fecha_creacion) - new Date(a.fecha_transaccion || a.fecha_creacion)
    );
    const ultimaTransaccion = transaccionesOrdenadas[0];
    
    // 9. Función para obtener el monto (VERSIÓN MEJORADA)
    const obtenerMonto = (transaccion) => {
      if (!transaccion) return 0;
      
      console.log(`💰 Extrayendo monto de transacción ${transaccion.id_transaccion}:`, {
        monto_pagado: transaccion.monto_pagado,
        monto: transaccion.monto,
        total: transaccion.total
      });
      
      // Intentar diferentes campos, CONVIRTIENDO A NÚMERO
      if (transaccion.monto_pagado !== undefined && transaccion.monto_pagado !== null) {
        return Number(transaccion.monto_pagado) || 0;
      }
      if (transaccion.monto !== undefined && transaccion.monto !== null) {
        return Number(transaccion.monto) || 0;
      }
      if (transaccion.total !== undefined && transaccion.total !== null) {
        return Number(transaccion.total) || 0;
      }
      if (transaccion.amount !== undefined && transaccion.amount !== null) {
        return Number(transaccion.amount) || 0;
      }
      
      // Si es un string, intentar parsearlo
      if (transaccion.monto_pagado_str) {
        return Number(transaccion.monto_pagado_str) || 0;
      }
      
      return 0;
    };

    const ultimoIngreso = obtenerMonto(ultimaTransaccion);
    
    // 🔍 LOG FINAL para este salón
    console.log(`📊 Estadísticas para salón ${salon.id_salon} (${salon.nombre}):`, {
      reservasDelMes: reservasSalonDelMes.length,
      transaccionesDelMes: transaccionesSalon.length,
      idsReservasDelMes: Array.from(reservasIdsDelMes),
      ultimoIngreso,
      ultimaTransaccion: ultimaTransaccion ? {
        id: ultimaTransaccion.id_transaccion,
        monto_pagado: ultimaTransaccion.monto_pagado,
        monto_convertido: ultimoIngreso
      } : null
    });

    return {
      rating: rating,
      totalReservas: reservasSalonDelMes.length,
      totalResenias: reseniasSalon.length,
      transaccionesCount: transaccionesSalon.length,
      ultimoIngreso: ultimoIngreso,
      ultimaReservaFecha: ultimaReserva?.fecha_reserva || null
    };
  };

  return (
    <div className="panel-salones">
      <SearchbarSalones
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        onApplyFilter={handleApplyFilter}
        totalResultados={filteredSalones?.length || 0}
      />

      <div className="salones-list">
        {filteredSalones?.length > 0 ? (
          filteredSalones.map(salon => (
            <ItemSalonAdmin
              key={salon.id_salon}
              salon={salon}
              isExpanded={expandedSalonId === salon.id_salon}
              onToggleExpand={() => handleToggleExpand(salon.id_salon)}
              onEliminar={onEliminarSalon}
              onBloquear={onBloquearSalon}
              estadisticas={calcularEstadisticasSalon(salon)}
            />
          ))
        ) : (
          <div className="no-resultados">
            <p>No se encontraron salones</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelSalones;