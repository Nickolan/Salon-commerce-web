import React, { useState, useMemo } from 'react';
import SearchbarIngresos from './IngresosComponentes/SearchbarIngresos';
import ItemTransaccion from './IngresosComponentes/ItemTransaccion';
import ComprobanteView from '../../ItemReserva/ComprobanteView';
import './PanelIngresos.css';

const PanelIngresos = ({ 
  transacciones = [], 
  reservas = [], 
  salones = [], 
  usuarios = [], 
  selectedMonth 
}) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [expandedTransaccionId, setExpandedTransaccionId] = useState(null);
  const [comprobanteVisible, setComprobanteVisible] = useState(null);

  // Filtrar transacciones del mes seleccionado
  const transaccionesDelMes = useMemo(() => {
    if (!transacciones || !selectedMonth) return [];
    
    const [year, month] = selectedMonth.split('-').map(Number);
    
    return transacciones.filter(t => {
      if (!t.fecha_transaccion) return false;
      const fecha = new Date(t.fecha_transaccion);
      return fecha.getFullYear() === year && fecha.getMonth() + 1 === month;
    });
  }, [transacciones, selectedMonth]);

  // Aplicar filtros
  const transaccionesFiltradas = useMemo(() => {
    let filtradas = [...transaccionesDelMes];

    if (activeFilter && filterValue) {
      switch(activeFilter) {
        case 'fecha':
          filtradas = filtradas.filter(t => 
            t.fecha_transaccion?.includes(filterValue)
          );
          break;
        case 'metodo':
          filtradas = filtradas.filter(t => 
            t.metodo_pago?.toLowerCase().includes(filterValue.toLowerCase())
          );
          break;
      }
    }

    return filtradas;
  }, [transaccionesDelMes, activeFilter, filterValue]);

  // Función para obtener datos relacionados a una transacción
  const getDatosRelacionados = (transaccion) => {
    console.log('🔍 Transacción completa:', {
      id: transaccion.id_transaccion,
      tieneReserva: !!transaccion.reserva,
      reservaId: transaccion.reserva?.id_reserva,
      tieneSalon: !!transaccion.reserva?.salon,
      salonNombre: transaccion.reserva?.salon?.nombre,
      tieneVendedor: !!transaccion.reserva?.salon?.publicador,
      vendedorNombre: transaccion.reserva?.salon?.publicador ? 
        `${transaccion.reserva.salon.publicador.nombre} ${transaccion.reserva.salon.publicador.apellido}` : null,
      tieneCliente: !!transaccion.reserva?.arrendatario,
      clienteNombre: transaccion.reserva?.arrendatario ? 
        `${transaccion.reserva.arrendatario.nombre} ${transaccion.reserva.arrendatario.apellido}` : null
    });

    // Si la transacción ya viene con reserva y sus relaciones, usamos eso directamente
    if (transaccion.reserva) {
      const reserva = transaccion.reserva;
      const salon = reserva.salon || null;
      const vendedor = salon?.publicador || null;
      const cliente = reserva.arrendatario || null;

      return { reserva, salon, vendedor, cliente };
    }

    // FALLBACK: Si no viene con relaciones, intentamos con los arrays separados
    console.warn('⚠️ Transacción sin reserva anidada, usando fallback');
    
    const idReserva = transaccion.reservaIdReserva;
    if (!idReserva) return { reserva: null, salon: null, vendedor: null, cliente: null };

    const reserva = reservas.find(r => r?.id_reserva === Number(idReserva));
    if (!reserva) return { reserva: null, salon: null, vendedor: null, cliente: null };

    const salon = reserva.salon || null;
    const vendedor = salon?.publicador || null;
    const cliente = reserva.arrendatario || null;

    return { reserva, salon, vendedor, cliente };
  };

  const handleFilterClick = (filter) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      setFilterValue("");
    } else {
      setActiveFilter(filter);
      setFilterValue("");
    }
  };

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  const handleApplyFilter = () => {
    console.log('Filtro aplicado:', activeFilter, filterValue);
  };

  const handleToggleExpand = (transaccionId) => {
    setExpandedTransaccionId(expandedTransaccionId === transaccionId ? null : transaccionId);
  };

  const handleVerComprobante = (transaccion, reserva) => {
    setComprobanteVisible({ transaccion, reserva });
  };

  console.log('📦 TRANSACCIONES CON DATOS COMPLETOS:', 
    transaccionesFiltradas.map(t => ({
      id: t.id_transaccion,
      monto: t.monto_pagado,
      // Esto es lo CRUCIAL - ver si viene la reserva con todo
      reserva: t.reserva ? {
        id: t.reserva.id_reserva,
        salon: t.reserva.salon ? {
          id: t.reserva.salon.id_salon,
          nombre: t.reserva.salon.nombre,
          publicador: t.reserva.salon.publicador ? {
            nombre: t.reserva.salon.publicador.nombre,
            apellido: t.reserva.salon.publicador.apellido
          } : null
        } : null,
        arrendatario: t.reserva.arrendatario ? {
          nombre: t.reserva.arrendatario.nombre,
          apellido: t.reserva.arrendatario.apellido
        } : null
      } : null
    }))
  );

  return (
    <div className="panel-ingresos">
      <SearchbarIngresos
        activeFilter={activeFilter}
        filterValue={filterValue}
        onFilterClick={handleFilterClick}
        onFilterChange={handleFilterChange}
        onApplyFilter={handleApplyFilter}
        totalResultados={transaccionesFiltradas.length}
      />

      <div className="transacciones-list">
        {transaccionesFiltradas.length > 0 ? (
          transaccionesFiltradas.map(transaccion => {
            const { reserva, salon, vendedor, cliente } = getDatosRelacionados(transaccion);

            return (
              <ItemTransaccion
                key={transaccion.id_transaccion}
                transaccion={transaccion}
                reserva={reserva}
                salon={salon}
                vendedor={vendedor}
                cliente={cliente}
                isExpanded={expandedTransaccionId === transaccion.id_transaccion}
                onToggleExpand={() => handleToggleExpand(transaccion.id_transaccion)}
                onVerComprobante={() => handleVerComprobante(transaccion, reserva)}
              />
            );
          })
        ) : (
          <div className="no-resultados">
            <p>No se encontraron transacciones para el mes seleccionado.</p>
          </div>
        )}
      </div>

      {/* Modal de comprobante completo */}
      {comprobanteVisible && (
        <ComprobanteView
          reserva={comprobanteVisible.reserva}
          transaccion={comprobanteVisible.transaccion}
          onClose={() => setComprobanteVisible(null)}
        />
      )}
    </div>
  );
};

export default PanelIngresos;