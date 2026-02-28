import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PanelUsuarios from '../PanelUsuarios/PanelUsuarios';
import PanelSalones from '../PanelSalones/PanelSalones';
import PanelReservas from '../PanelReservas/PanelReservas';
import PanelIngresos from '../PanelIngresos/PanelIngresos';
import PanelAdministrador from '../PanelAdmin/PanelAdministrador';
import TransaccionService from '../../../store/features/transaccion/transaccionService';
import { updateSalonStatusAdmin, deleteSalon } from '../../../store/features/salones/salonSlice'; // Importamos las acciones
import Swal from 'sweetalert2';
import './MainAdmin.css';

const MainAdmin = ({ activePanel, data, fullData, selectedMonth, onMonthChange }) => {
  const dispatch = useDispatch();
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  
  const handleReservaActualizada = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Función para manejar bloqueo de salones usando Redux
  const handleBloquearSalon = async (idSalon, nuevoEstado) => {
    console.log(`🔄 Intentando cambiar estado del salón ${idSalon} a: ${nuevoEstado}`);
    
    try {
      // Usamos el thunk de Redux en lugar de fetch
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

        // Forzar refresco
        setRefreshTrigger(prev => prev + 1);
      } else if (updateSalonStatusAdmin.rejected.match(resultAction)) {
        // Si la acción fue rechazada
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

  const reservasConTransacciones = useMemo(() => {
    return TransaccionService.combinarReservasConTransacciones(data?.reservas || [], data?.transacciones || []);
  }, [data?.reservas, data?.transacciones, refreshTrigger]);

  const renderPanel = () => {

    switch (activePanel) {
      case 'Usuarios':
        return <PanelUsuarios 
                  usuarios={data?.usuarios || []} 
                  selectedMonth={selectedMonth}
                  onUserDeleted={(userId) => {
                    console.log('🗑️ Usuario eliminado:', userId);
                  }}
                />;
      case 'Salones':
        const todasLasReseniasParaSalones = 
          fullData?.resenias ||
          fullData?.reservas?.flatMap(r => r.resenias || []) ||
          data?.resenias ||
          [];
        
        console.log('🏨 PanelSalones - Reseñas disponibles:', todasLasReseniasParaSalones.length);
        
        return <PanelSalones
          salones={data?.salones || []}
          reservas={data?.reservas || []}
          transacciones={data?.transacciones || []}
          resenias={todasLasReseniasParaSalones}  // 👈 Usar las reseñas obtenidas
          selectedMonth={selectedMonth}
          onEliminarSalon={handleEliminarSalon}
          onBloquearSalon={handleBloquearSalon}
        />;
        
      case 'Reservas':
        console.log('🎯 Preparando datos para panel de reservas');
        
        // Obtener todas las reseñas - AHORA DESDE fullData O data
        // Intenta de diferentes maneras
        const todasLasResenias = 
          fullData?.resenias || // Si fullData tiene resenias directamente
          fullData?.reservas?.flatMap(r => r.resenias || []) || // Si están anidadas en reservas
          data?.resenias || // Si data tiene resenias
          []; // Fallback a array vacío
        
        console.log('📊 Datos completos:', {
          reservas: data?.reservas?.length || 0,
          transacciones: data?.transacciones?.length || 0,
          salones: data?.salones?.length || 0,
          usuarios: data?.usuarios?.length || 0,
          resenias: todasLasResenias.length,
          fullDataKeys: fullData ? Object.keys(fullData) : 'no fullData',
          dataKeys: data ? Object.keys(data) : 'no data'
        });
        
        // Si todavía no hay reseñas, intenta hacer una petición aparte
        if (todasLasResenias.length === 0 && data?.reservas?.length > 0) {
          console.log('⚠️ No hay reseñas en los datos, verifica que el backend las esté enviando');
        }
        
        // Pasar TODOS los datos al servicio
        const reservasEnriquecidas = TransaccionService.combinarReservasConTransacciones(
          data?.reservas || [], 
          data?.transacciones || [],
          data?.salones || [],
          data?.usuarios || [],
          todasLasResenias
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
                  transacciones={data?.transacciones || []}
                  reservas={data?.reservas || []}        
                  salones={data?.salones || []}           
                  usuarios={data?.usuarios || []}         
                  selectedMonth={selectedMonth}
                />
      default:
         return <PanelAdministrador 
          data={data} 
          fullData={fullData} 
          selectedMonth={selectedMonth}
          onMonthChange={onMonthChange}  // ✅ Pasar la función
        />;
      }
  };

  return <main className="main-admin-content">{renderPanel()}</main>;
};

export default MainAdmin;