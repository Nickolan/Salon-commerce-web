import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './RendimientoDiario.css';
import AdminStatsService from '../hooks/adminStatsService';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RendimientoDiario = ({ selectedMonth, onMonthChange, data }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ingresosActual, setIngresosActual] = useState(0);

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    console.log('📅 Calendario RendimientoDiario - Mes seleccionado:', newMonth);
    if (onMonthChange) {
      onMonthChange(newMonth);
    }
  };

  // Función para agrupar ingresos por semana
  const agruparPorSemana = (transacciones, month) => {
    if (!transacciones || transacciones.length === 0) return [0, 0, 0, 0, 0];
    
    const [year, monthNum] = month.split('-').map(Number);
    const ultimoDia = new Date(year, monthNum, 0).getDate();
    
    // Inicializar array para 5 semanas
    const semanas = [0, 0, 0, 0, 0];
    
    transacciones.forEach(trans => {
      const fecha = new Date(trans.fecha_transaccion);
      const dia = fecha.getDate();
      
      // Calcular número de semana (0-4)
      let semana = Math.floor((dia - 1) / 7);
      if (semana > 4) semana = 4;
      
      const monto = trans.monto_pagado || trans.monto || 0;
      semanas[semana] += Number(monto);
    });
    
    // Si el mes tiene menos de 5 semanas, truncar el array
    const semanasReales = Math.ceil(ultimoDia / 7);
    return semanas.slice(0, semanasReales);
  };

  // Función para obtener las etiquetas de las semanas
  const obtenerSemanas = (month) => {
    const [year, monthNum] = month.split('-').map(Number);
    const ultimoDia = new Date(year, monthNum, 0).getDate();
    
    const semanas = [];
    const numSemanas = Math.ceil(ultimoDia / 7);
    
    for (let i = 0; i < numSemanas; i++) {
      const inicio = i * 7 + 1;
      const fin = Math.min((i + 1) * 7, ultimoDia);
      semanas.push(`${i + 1}° Semana (${inicio}-${fin})`);
    }
    return semanas;
  };

  // Cargar datos cuando cambia el mes
  useEffect(() => {
    const cargarDatosGrafico = async () => {
      if (!selectedMonth) return;
      
      setLoading(true);
      
      try {
        // Obtener solo transacciones del mes actual
        const token = AdminStatsService.getToken();
        const response = await fetch(`http://localhost:3000/transacciones/admin?month=${selectedMonth}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const transaccionesActual = await response.json();
        
        // Calcular ingreso total del mes
        const totalActual = transaccionesActual.reduce((sum, t) => 
          sum + (t.monto_pagado || t.monto || 0), 0);
        setIngresosActual(totalActual);
        
        // Agrupar por semana
        const semanasActual = agruparPorSemana(transaccionesActual, selectedMonth);
        const etiquetas = obtenerSemanas(selectedMonth);
        
        setChartData({
          labels: etiquetas,
          datasets: [
            {
              label: `Ingresos ${selectedMonth}`,
              data: semanasActual,
              borderColor: '#C8AD7F',
              backgroundColor: 'rgba(200, 173, 127, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#C8AD7F',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            }
          ]
        });
        
      } catch (error) {
        console.error('Error cargando datos del gráfico:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatosGrafico();
  }, [selectedMonth]);

  // Opciones del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ocultar leyenda porque solo tenemos una línea
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.parsed.y !== null) {
              return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return `$${value/1000}K`;
          },
          stepSize: 5000,
          font: {
            family: 'Montserrat',
            size: 11
          }
        },
        title: {
          display: true,
          text: 'Ingresos (en miles)',
          font: {
            family: 'Montserrat',
            size: 12,
            weight: '500'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Montserrat',
            size: 11
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3 // Línea más gruesa para destacar
      }
    }
  };

  return (
    <div className="rendimiento-diario">
      <div className="rendimiento-header">
        <h2 className="rendimiento-titulo">Rendimiento Diario</h2>
        <div className="month-selector-wrapper">
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="month-selector-input"
          />
        </div>
      </div>

      {/* Resumen simplificado - solo el total del mes */}
      <div className="rendimiento-resumen">
        <div className="resumen-item">
          <span className="resumen-label">Total {selectedMonth}:</span>
          <span className="resumen-valor actual">
            ${(ingresosActual / 1000).toFixed(1)}K
          </span>
        </div>
      </div>

      {/* Contenedor del gráfico */}
      <div className="grafico-contenedor">
        {loading ? (
          <div className="grafico-loading">Cargando datos...</div>
        ) : chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="grafico-placeholder">
            <p>No hay datos disponibles para {selectedMonth}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RendimientoDiario;