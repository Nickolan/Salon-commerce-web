import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PanelUsuarios from '../PanelUsuarios/PanelUsuarios';
import PanelSalones from '../PanelSalones/PanelSalones';
import PanelReservas from '../PanelReservas/PanelReservas';
import PanelIngresos from '../PanelIngresos/PanelIngresos';
import PanelAdministrador from '../PanelAdmin/PanelAdministrador';
import TransaccionService from '../../../store/features/transaccion/transaccionService';
import AdminStatsService from '../PanelAdmin/hooks/adminStatsService';
import { updateSalonStatusAdmin, deleteSalon } from '../../../store/features/salones/salonSlice';
import Swal from 'sweetalert2';
import './MainAdmin.css';

const MainAdmin = ({ activePanel, data, fullData, selectedMonth, onMonthChange }) => {
  const dispatch = useDispatch();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [transaccionesData, setTransaccionesData] = useState({ current: [], previous: [] });
  const [reservasData, setReservasData] = useState({ current: [], previous: [] });
  
  // Cargar datos adicionales usando AdminStatsService
  useEffect(() => {
    const cargarDatosAdicionales = async () => {
      if (!selectedMonth) return;
      
      console.log('📥 Cargando datos adicionales con AdminStatsService para:', selectedMonth);
      
      try {
        // Cargar transacciones comparativas
        const transacciones = await AdminStatsService.fetchTransaccionesComparativa(selectedMonth);
        setTransaccionesData(transacciones);
        
        // Cargar reservas comparativas
        const reservas = await AdminStatsService.fetchReservasComparativa(selectedMonth);
        setReservasData(reservas);
        
        console.log('✅ Datos adicionales cargados:', {
          transacciones: transacciones.current.length,
          reservas: reservas.current.length
        });
      } catch (error) {
        console.error('❌ Error cargando datos adicionales:', error);
      }
    };
    
    cargarDatosAdicionales();
  }, [selectedMonth]);
  
  const handleReservaActualizada = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Función para manejar bloqueo de salones usando Redux
  const handleBloquearSalon = async (idSalon, nuevoEstado) => {
    console.log(`🔄 Intentando cambiar estado del salón ${idSalon} a: ${nuevoEstado}`);
    
    try {
      const resultAction = await dispatch(updateSalonStatusAdmin({ 
        salonId: idSalon, 
        nuevoEstado: nuevoEstado 
      }));

      if (updateSalonStatusAdmin.fulfilled.match(resultAction)) {
        console.log('✅ Estado actualizado correctamente:', resultAction.payload);
        
        Swal.fire({
          title: '¡Éxito!',
          text: `Salón ${nuevoEstado === 'oculta' ? 'bloqueado' : 'desbloqueado'} correctamente`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#FFFFFF'
        });

        setRefreshTrigger(prev => prev + 1);
      } else if (updateSalonStatusAdmin.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Error al actualizar el estado');
      }
    } catch (error) {
      console.error('❌ Error en handleBloquearSalon:', error);
      
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo cambiar el estado del salón',
        icon: 'error',
        confirmButtonColor: '#AD1519',
        background: '#FFFFFF'
      });
    }
  };

  // Función para eliminar salón usando Redux
  const handleEliminarSalon = async (idSalon) => {
    console.log('🗑️ Eliminar salón:', idSalon);
    
    try {
      const resultAction = await dispatch(deleteSalon(idSalon));

      if (deleteSalon.fulfilled.match(resultAction)) {
        Swal.fire({
          title: 'Eliminado',
          text: 'Salón eliminado correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        setRefreshTrigger(prev => prev + 1);
      } else if (deleteSalon.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Error al eliminar el salón');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#AD1519'
      });
    }
  };

  const todasLasResenias = useMemo(() => {
    // Asegurarse de que data?.reservas existe y es un array
    const reservas = data?.reservas || [];
    
    // 🔍 LOG PARA VER LAS RESERVAS CRUDAS
    console.log('🔍 RESERVAS CRUDAS RECIBIDAS:', reservas);
    
    // Verificar cada reserva individualmente
    reservas.forEach((reserva, index) => {
      console.log(`Reserva ${index}:`, {
        id: reserva.id_reserva,
        tieneResenia: !!reserva.resenia,
        resenia: reserva.resenia
      });
    });
    
    // Mapear cada reserva para extraer su reseña si existe
    const reseniasExtraidas = reservas
      .map(reserva => reserva.resenia)
      .filter(resenia => resenia != null);

    console.log('📝 Reseñas extraídas de las reservas:', reseniasExtraidas.length);
    console.log('📝 DETALLE DE RESEÑAS EXTRAÍDAS:', reseniasExtraidas);
    
    return reseniasExtraidas;
  }, [data?.reservas, data?.resenias]);

  // Enriquecer usuarios con sus reservas y transacciones
  const usuariosConDatos = useMemo(() => {
    if (!data?.usuarios) return [];
    
    console.log('👥 Enriqueciendo usuarios con datos de transacciones y reservas');
    
    return data.usuarios.map(usuario => {
      // Encontrar todas las reservas del usuario
      const reservasUsuario = (reservasData.current || []).filter(
        reserva => reserva.arrendatario?.id_usuario === usuario.id_usuario
      );

      return {
        ...usuario,
        reservas: reservasUsuario
      };
    });
  }, [data?.usuarios, reservasData.current]);

  // Enriquecer salones con sus reservas
  const salonesConDatos = useMemo(() => {
    if (!data?.salones) return [];
    
    return data.salones.map(salon => {
      const reservasSalon = (reservasData.current || []).filter(
        reserva => reserva.salon?.id_salon === salon.id_salon
      );
      
      return {
        ...salon,
        reservas: reservasSalon
      };
    });
  }, [data?.salones, reservasData.current]);

  // Transacciones enriquecidas para el panel de ingresos
  const transaccionesEnriquecidas = useMemo(() => {
    if (!transaccionesData.current?.length) return [];
    
    console.log('💰 Enriqueciendo transacciones con datos de reservas');
    
    return transaccionesData.current.map(transaccion => {
      // Buscar la reserva completa en reservasData.current
      const reservaCompleta = reservasData.current?.find(
        r => r.id_reserva === transaccion.reservaIdReserva
      );
      
      if (reservaCompleta) {
        return {
          ...transaccion,
          reserva: reservaCompleta
        };
      }
      return transaccion;
    });
  }, [transaccionesData.current, reservasData.current]);

  const renderPanel = () => {
    switch (activePanel) {
      case 'Usuarios':
        console.log('👥 PanelUsuarios - Datos enriquecidos:', {
          usuariosOriginales: data?.usuarios?.length || 0,
          usuariosEnriquecidos: usuariosConDatos.length,
          reservasDisponibles: reservasData.current?.length || 0,
          transaccionesDisponibles: transaccionesData.current?.length || 0
        });
        
        return <PanelUsuarios 
                  usuarios={usuariosConDatos} 
                  reservas={reservasData.current || []}       
                  transacciones={transaccionesData.current || []} 
                  selectedMonth={selectedMonth}
                  onUserDeleted={(userId) => {
                    console.log('🗑️ Usuario eliminado:', userId);
                  }}
                />;
                
      case 'Salones':
        console.log('🏨 PanelSalones - Reseñas disponibles:', todasLasResenias.length);
        
        return <PanelSalones
          salones={salonesConDatos}
          reservas={reservasData.current || []}
          transacciones={transaccionesData.current || []}
          resenias={todasLasResenias}
          selectedMonth={selectedMonth}
          onEliminarSalon={handleEliminarSalon}
          onBloquearSalon={handleBloquearSalon}
        />;
        
      case 'Reservas':
        console.log('🎯 Preparando datos para panel de reservas');
        
        // Pasar TODOS los datos al servicio como en la versión que funciona
        const reservasEnriquecidas = TransaccionService.combinarReservasConTransacciones(
          reservasData.current || [],      // Reservas del mes actual
          transaccionesData.current || [], // Transacciones del mes actual
          data?.salones || [],              // Salones completos (con imágenes)
          data?.usuarios || [],             // Usuarios completos
          todasLasResenias                   // Reseñas
        );
        
        console.log('📸 Reservas enriquecidas - verificando imágenes:', 
          reservasEnriquecidas.slice(0, 3).map(r => ({
            id: r.id_reserva,
            tieneSalon: !!r.salon,
            salonNombre: r.salon?.nombre,
            tieneFotos: !!(r.salon?.fotos?.length),
            primeraFoto: r.salon?.fotos?.[0]
          }))
        );
        
        return <PanelReservas 
          reservas={reservasEnriquecidas}
          salones={data?.salones || []} 
          usuarios={data?.usuarios || []} 
          selectedMonth={selectedMonth}
          onReservaActualizada={handleReservaActualizada} 
        />;

      case 'Ingresos':
        return <PanelIngresos
                  transacciones={transaccionesEnriquecidas}
                  reservas={reservasData.current || []}        
                  salones={salonesConDatos}           
                  usuarios={data?.usuarios || []}         
                  selectedMonth={selectedMonth}
                />
      default:
         return <PanelAdministrador 
          data={{
            ...data,
            reservas: reservasData.current,
            transacciones: transaccionesData.current
          }} 
          fullData={fullData} 
          selectedMonth={selectedMonth}
          onMonthChange={onMonthChange}
        />;
      }
  };

  return <main className="main-admin-content">{renderPanel()}</main>;
};

export default MainAdmin;