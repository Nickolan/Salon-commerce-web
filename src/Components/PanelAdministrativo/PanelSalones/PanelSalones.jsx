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
    
    // 🔍 LOG DETALLADO DE RESEÑAS
    if (resenias?.length > 0) {
      console.log('🔍 PRIMERA RESEÑA (completa):', resenias[0]);
      console.log('🔍 CAMPOS en reseña:', Object.keys(resenias[0]));
      console.log('🔍 RELACIÓN con reserva:', resenias[0].reserva);
    } else {
      console.log('❌ NO HAY RESEÑAS en PanelSalones');
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

  // Función para obtener el ID de reserva de una transacción
  const getReservaIdFromTransaccion = (transaccion) => {
    if (!transaccion) return null;
    
    const posiblesCampos = [
      'id_reserva',
      'reservaIdReserva',
      'reserva_id_reserva',
      'reservalldReserva',
      'reservaId',
      'reserva_id',
      'reserva'
    ];
    
    for (const campo of posiblesCampos) {
      if (transaccion[campo] !== undefined && transaccion[campo] !== null) {
        if (typeof transaccion[campo] === 'object' && transaccion[campo] !== null) {
          return transaccion[campo].id_reserva || transaccion[campo].id;
        }
        return transaccion[campo];
      }
    }
    
    return null;
  };

  const calcularEstadisticasSalon = (salon) => {
    console.log(`📊 Calculando estadísticas para salón ${salon.id_salon} - ${salon.nombre}`);
    
    // Filtrar reseñas de este salón
    const reseniasSalon = resenias.filter(r => {
      const coincide = r.reserva?.salon?.id_salon === salon.id_salon;
      if (coincide) {
        console.log(`🎯 Encontrada reseña para salón ${salon.id_salon}:`, r);
      }
      return coincide;
    });
    
    console.log(`📝 Reseñas encontradas para salón ${salon.id_salon}:`, reseniasSalon.length);
    
    // Filtrar reservas de este salón
    const todasReservasSalon = reservas.filter(r => r.salon?.id_salon === salon.id_salon);
    
    // Filtrar SOLO las reservas del mes seleccionado
    const reservasSalonDelMes = filtrarReservasDelMes(todasReservasSalon);
    
    // Crear un Set con los IDs de reservas del mes para búsqueda rápida
    const reservasIdsDelMes = new Set(reservasSalonDelMes.map(r => r.id_reserva));
    
    // Filtrar transacciones que pertenezcan a estas reservas
    const transaccionesSalon = transacciones.filter(t => {
      const reservaId = getReservaIdFromTransaccion(t);
      return reservaId && reservasIdsDelMes.has(Number(reservaId));
    });
    
    // Calcular rating promedio
    const rating = reseniasSalon.length > 0 
      ? reseniasSalon.reduce((sum, r) => sum + r.calificacion, 0) / reseniasSalon.length 
      : 0;
    
    // Encontrar última reserva del mes
    const ultimaReserva = reservasSalonDelMes.length > 0 
      ? reservasSalonDelMes.sort((a, b) => new Date(b.fecha_reserva) - new Date(a.fecha_reserva))[0]
      : null;
    
    // Calcular último ingreso del mes
    const transaccionesOrdenadas = [...transaccionesSalon].sort(
      (a, b) => new Date(b.fecha_transaccion || b.fecha_creacion) - new Date(a.fecha_transaccion || a.fecha_creacion)
    );
    const ultimaTransaccion = transaccionesOrdenadas[0];
    
    const obtenerMonto = (transaccion) => {
      if (!transaccion) return 0;
      
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
      
      return 0;
    };

    const ultimoIngreso = obtenerMonto(ultimaTransaccion);

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
          filteredSalones.map(salon => {
            // Filtrar reseñas para este salón - CON MÁS LOGS
            console.log(`🔍 Buscando reseñas para salón ID ${salon.id_salon} - ${salon.nombre}`);
            console.log('  📝 Total reseñas disponibles:', resenias.length);
            
            const reseniasDelSalon = resenias.filter(r => {
              console.log('  Revisando reseña:', r.id_resenia, 'reserva:', r.reserva);
              const coincide = r.reserva?.salon?.id_salon === salon.id_salon;
              if (coincide) {
                console.log('  ✅ COINCIDE!', r);
              }
              return coincide;
            });
            
            console.log(`📊 Resultado: ${reseniasDelSalon.length} reseñas para salón ${salon.id_salon}`);

            return (
              <ItemSalonAdmin
                key={salon.id_salon}
                salon={salon}
                isExpanded={expandedSalonId === salon.id_salon}
                onToggleExpand={() => handleToggleExpand(salon.id_salon)}
                onEliminar={onEliminarSalon}
                onBloquear={onBloquearSalon}
                estadisticas={calcularEstadisticasSalon(salon)}
                reseniasDelSalon={reseniasDelSalon}
              />
            );
          })
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