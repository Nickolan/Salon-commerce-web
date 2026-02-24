import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import SearchbarReservas from './ComponenteReservasAdmin/SearchbarReservas';
import ItemReservaAdmin from './ComponenteReservasAdmin/ItemReservaAdmin';
import TransaccionService from '../../../store/features/transaccion/transaccionService';
import { updateReservaStatus } from '../../../store/features/reservas/reservasSlice';
import Swal from 'sweetalert2';
import './PanelReservas.css';

console.log('📦 ItemReservaAdmin importado:', ItemReservaAdmin);

const PanelReservas = ({ reservas, salones, usuarios, selectedMonth, onReservaActualizada }) => {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [reservaExpandida, setReservaExpandida] = useState(null);

  // LOG 1: Ver qué reservas llegan al componente
  console.log('🔍 PANEL RESERVAS - PROPS RECIBIDAS:', {
    selectedMonth,
    totalReservas: reservas?.length || 0,
    reservasExisten: !!reservas,
    esArray: Array.isArray(reservas),
    primerasReservas: reservas?.slice(0, 3).map(r => ({
      id: r.id_reserva,
      fecha: r.fecha_reserva,
      estado: r.estado_reserva,
      tieneTransacciones: r.transacciones?.length || 0
    }))
  });

  // LOG 3: Análisis de meses disponibles
  const mesesDisponibles = useMemo(() => {
    if (!reservas || reservas.length === 0) return [];

    const meses = new Set();
    reservas.forEach(r => {
      if (r.fecha_reserva) {
        const [year, month] = r.fecha_reserva.split('-');
        meses.add(`${year}-${month}`);
      }
    });

    const mesesArray = Array.from(meses).sort();
    console.log('📅 MESES CON RESERVAS:', mesesArray);
    console.log('📅 MES SELECCIONADO ESTÁ EN LA LISTA?', mesesArray.includes(selectedMonth));

    return mesesArray;
  }, [reservas, selectedMonth]);

  // Filtrar reservas
  const reservasFiltradas = useMemo(() => {
    if (!reservas || reservas.length === 0) {
      console.log('⚠️ No hay reservas para filtrar');
      return [];
    }

    const [year, month] = selectedMonth.split('-').map(Number);
    console.log('📅 Filtrando por:', { year, month });

    let filtradas = reservas.filter(reserva => {
      // LOG 2: Ver cada reserva mientras se filtra
      console.log('🔎 Evaluando reserva:', {
        id: reserva.id_reserva,
        fechaOriginal: reserva.fecha_reserva,
        fechaParts: reserva.fecha_reserva?.split('-'),
        añoExtraido: parseInt(reserva.fecha_reserva?.split('-')[0]),
        mesExtraido: parseInt(reserva.fecha_reserva?.split('-')[1]),
        coincide: parseInt(reserva.fecha_reserva?.split('-')[0]) === year &&
                  parseInt(reserva.fecha_reserva?.split('-')[1]) === month
      });

      const fechaParts = reserva.fecha_reserva.split('-');
      const fechaYear = parseInt(fechaParts[0]);
      const fechaMonth = parseInt(fechaParts[1]);
      return fechaYear === year && fechaMonth === month;
    });

    console.log('📊 RESULTADO FILTRO:', {
      selectedMonth,
      totalReservas: reservas.length,
      filtradas: filtradas.length,
      porcentaje: ((filtradas.length / reservas.length) * 100).toFixed(1) + '%'
    });

    if (activeFilter && filterValue) {
      switch(activeFilter) {
        case 'fecha':
          filtradas = filtradas.filter(r => r.fecha_reserva === filterValue);
          break;
        case 'usuario':
          filtradas = filtradas.filter(r =>
            r.arrendatario?.id_usuario.toString() === filterValue ||
            `${r.arrendatario?.nombre} ${r.arrendatario?.apellido}`.toLowerCase().includes(filterValue.toLowerCase())
          );
          break;
        case 'salon':
          filtradas = filtradas.filter(r =>
            r.salon?.id_salon.toString() === filterValue ||
            r.salon?.nombre?.toLowerCase().includes(filterValue.toLowerCase())
          );
          break;
      }
    }
    return filtradas;
  }, [reservas, activeFilter, filterValue, selectedMonth]);

  // LOG 4: Verificar el origen de los datos
  useEffect(() => {
    console.log('🔄 useEffect - Datos actualizados:', {
      selectedMonth,
      cantidadReservas: reservas?.length,
      mesesDisponibles: mesesDisponibles
    });
  }, [reservas, selectedMonth, mesesDisponibles]);

  console.log('📅 PANEL RESERVAS - Verificación de fechas:');
  console.log('Mes seleccionado:', selectedMonth);
  console.log('Total reservas en store:', reservas.length);

  reservas?.slice(0, 5).forEach((r, i) => {
    console.log(`Reserva ${i+1}:`, {
      id: r.id_reserva,
      fecha: r.fecha_reserva,
      mes: new Date(r.fecha_reserva).getMonth() + 1,
      año: new Date(r.fecha_reserva).getFullYear()
    });
  });

  console.log('Reservas filtradas para el mes:', reservasFiltradas.length);

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

  const handleToggleExpand = (reservaId) => {
    setReservaExpandida(reservaExpandida === reservaId ? null : reservaId);
  };

  const handleCancelarReserva = async (reserva) => {
    console.log('🚀 INICIANDO CANCELACIÓN:', {
      id_reserva: reserva.id_reserva,
      estado_actual: reserva.estado_reserva,
      tieneTransacciones: reserva.transacciones?.length || 0,
      transacciones: reserva.transacciones?.map(t => ({
        id: t.id_transaccion,
        estado: t.estado_transaccion,
        monto: t.monto_pagado
      }))
    });

    const estadosNoModificables = ['completada', 'cancelada', 'rechazada'];
    if (estadosNoModificables.includes(reserva.estado_reserva?.toLowerCase())) {
      Swal.fire({
        title: 'Acción no permitida',
        text: `La reserva ya está ${reserva.estado_reserva}. No se puede modificar.`,
        icon: 'warning',
        confirmButtonColor: '#C8AD7F'
      });
      return;
    }

    const { value: motivo } = await Swal.fire({
      title: 'Motivo de cancelación',
      input: 'textarea',
      inputLabel: 'Por favor, indica el motivo de la cancelación',
      inputPlaceholder: 'Escribe el motivo aquí...',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#C8AD7F',
      cancelButtonColor: '#787878',
      inputValidator: (value) => {
        if (!value) return 'Debes ingresar un motivo de cancelación';
      }
    });

    if (!motivo) return;

    const esReservaCreada = reserva.estado_reserva === 'creada';
    const mensajeAccion = esReservaCreada ? 'rechazar' : 'cancelar';

    const confirmar = await Swal.fire({
      title: '¿Confirmar acción?',
      text: `¿Estás seguro de ${mensajeAccion} esta reserva?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Sí, ${mensajeAccion}`,
      cancelButtonText: 'No, volver',
      confirmButtonColor: '#AD1519',
      cancelButtonColor: '#787878'
    });

    if (!confirmar.isConfirmed) return;

    try {
        const token = localStorage.getItem('accessToken');
        
        const esReservaCreada = reserva.estado_reserva === 'creada';
        const nuevoEstadoReserva = esReservaCreada ? 'rechazada' : 'cancelada';
        const nuevoEstadoTransaccion = esReservaCreada ? 'rechazado' : 'reembolso';

        console.log('📝 Estados a aplicar:', {
          reserva: nuevoEstadoReserva,
          transaccion: nuevoEstadoTransaccion,
          esReservaCreada
        });

        // PASO 1: Actualizar reserva
        console.log(`📡 PASO 1 - Actualizando reserva ${reserva.id_reserva}...`);
        const reservaResponse = await axios.patch(
          `http://localhost:3000/reservas/${reserva.id_reserva}`,
          { estado_reserva: nuevoEstadoReserva },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ PASO 1 - Reserva actualizada:', reservaResponse.data);

        // PASO 2: Verificar si hay transacción
        console.log('🔍 PASO 2 - Verificando transacciones:', {
          tienePropTransacciones: !!reserva.transacciones,
          longitud: reserva.transacciones?.length,
          transacciones: reserva.transacciones
        });

        // Buscar transacción de varias formas
        let transaccionExistente = null;
        
        if (reserva.transacciones && reserva.transacciones.length > 0) {
          transaccionExistente = reserva.transacciones[0];
          console.log('✅ Transacción encontrada en reserva.transacciones[0]:', transaccionExistente);
        } else if (reserva.transaccion) {
          transaccionExistente = reserva.transaccion;
          console.log('✅ Transacción encontrada en reserva.transaccion:', transaccionExistente);
        }

        if (transaccionExistente) {
          console.log(`📡 PASO 2 - Actualizando transacción para reserva ${reserva.id_reserva} a ${nuevoEstadoTransaccion}`);
          
          console.log('🔧 Llamando a TransaccionService.updateEstadoByReservaId con:', {
            id_reserva: reserva.id_reserva,
            nuevoEstado: nuevoEstadoTransaccion
          });

          const transaccionResponse = await TransaccionService.updateEstadoByReservaId(
            reserva.id_reserva,
            nuevoEstadoTransaccion
          );
          
          console.log('✅ PASO 2 - Transacción actualizada:', transaccionResponse);
        } else {
          console.log('⚠️ PASO 2 - No hay transacción para actualizar');
        }

        console.log('✅ PROCESO COMPLETADO EXITOSAMENTE');

        Swal.fire({
          title: '¡Éxito!',
          text: `La reserva ha sido ${mensajeAccion} correctamente.${
            !esReservaCreada ? ' Se ha iniciado el proceso de reembolso.' : ''
          }`,
          icon: 'success',
          timer: 2500,
          showConfirmButton: false
        });

        if (onReservaActualizada) {
          onReservaActualizada();
        }

      } catch (error) {
        console.error('❌ ERROR EN CANCELACIÓN:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data
          }
        });
        
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || error.message || `No se pudo ${mensajeAccion} la reserva.`,
          icon: 'error',
          confirmButtonColor: '#C8AD7F'
        });
      }
    };

  return (
    <div className="panel-reservas">
      <SearchbarReservas
        activeFilter={activeFilter}
        filterValue={filterValue}
        onFilterClick={handleFilterClick}
        onFilterChange={handleFilterChange}
        onApplyFilter={handleApplyFilter}
        totalResultados={reservasFiltradas.length}
      />

      <div className="reservas-list-admin">
        {reservasFiltradas.length > 0 ? (
          reservasFiltradas.map((reserva) => {
            let precio = 0;
            let estadoPago = '';

            if (reserva.transacciones && reserva.transacciones.length > 0) {
              const transaccionesOrdenadas = [...reserva.transacciones].sort(
                (a, b) => new Date(b.fecha_transaccion) - new Date(a.fecha_transaccion)
              );
              precio = transaccionesOrdenadas[0]?.monto_pagado || 0;
              estadoPago = transaccionesOrdenadas[0]?.estado_transaccion;
            } 

            const fechaReserva = new Date(reserva.fecha_reserva);
            const hoy = new Date();
            const esReservaFutura = fechaReserva > hoy;

            console.log(`Reserva ${reserva.id_reserva}:`, {
              fecha: reserva.fecha_reserva,
              esFutura: esReservaFutura,
              tieneTransacciones: reserva.transacciones?.length || 0,
              precio,
              estadoPago
            });

            return (
              <ItemReservaAdmin
                key={reserva.id_reserva}
                reserva={reserva}
                precio={precio}
                esReservaFutura={esReservaFutura}  // 👈 NUEVO PROP
                estadoPago={estadoPago}             // 👈 NUEVO PROP
                isExpanded={reservaExpandida === reserva.id_reserva}
                onToggleExpand={() => handleToggleExpand(reserva.id_reserva)}
                onCancelar={() => handleCancelarReserva(reserva)}
              />
            );
          })
        ) : (
          <p className="no-results">No se encontraron reservas para el mes seleccionado.</p>
        )}
      </div>
    </div>
  );
};

export default PanelReservas;
