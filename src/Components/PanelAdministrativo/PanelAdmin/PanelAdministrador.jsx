import React from 'react';
import './PanelAdministrador.css';
import StatCard from './AdminComponents/StatCard';
import RendimientoDiario from './AdminComponents/RendimientoDiario';
import ActividadReciente from './AdminComponents/ActividadReciente';
import useAdminStats from './hooks/useAdminStats';
import { FiUsers, FiHome } from 'react-icons/fi';
import { MdCreditCard } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';

const PanelAdministrador = ({ data, fullData, selectedMonth, onMonthChange }) => {
  const { stats, loading } = useAdminStats(selectedMonth);

  // Mapear iconos a los datos
  const statsWithIcons = {
    reservas: { ...stats.reservas, icono: FaLock },
    usuarios: { ...stats.usuarios, icono: FiUsers },
    salones: { ...stats.salones, icono: FiHome },
    ingresos: { ...stats.ingresos, icono: MdCreditCard }
  };

  if (loading) {
    return (
      <div className="panel-administrador">
        <div className="loading-spinner">Cargando datos para {selectedMonth}...</div>
      </div>
    );
  }

  return (
    <div className="panel-administrador">
      {/* Grid de 4 tarjetas estadísticas */}
      <div className="stats-grid">
        <StatCard data={statsWithIcons.reservas} />
        <StatCard data={statsWithIcons.usuarios} />
        <StatCard data={statsWithIcons.salones} />
        <StatCard data={statsWithIcons.ingresos} />
      </div>

      {/* Contenedores inferiores */}
      <div className="paneles-inferiores">
         <RendimientoDiario 
          selectedMonth={selectedMonth}
          onMonthChange={onMonthChange}  // ✅ Asegurar que se pasa
          data={data}
        />
        <ActividadReciente 
          data={fullData || data}
          selectedMonth={selectedMonth}
        />
      </div>
    </div>
  );
};

export default PanelAdministrador;