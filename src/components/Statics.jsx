import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useNavigate } from "react-router";
import { ArrowLeft, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import '../css/Statics.css';

export default function DashboardVentas() {
  document.title = 'Estadísticas';
  const navigate = useNavigate();

  const handleRegresar = () => {
    navigate(-1);
  };

  const [ventasData, setVentasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVentasData = async () => {
      try {
        const response = await fetch('http://localhost:8181/detalleVenta/getAll');
        if (!response.ok) {
          throw new Error('Error al obtener los datos de ventas');
        }
        const data = await response.json();
        setVentasData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVentasData();
  }, []);

  const processStats = (data) => {
    const totalVentas = data.reduce((sum, v) => sum + (v.cant_comp || v.cantComp || 0), 0);
    
    const ingresosTotal = data.reduce((sum, v) => {
      const cantidad = v.cant_comp || v.cantComp || 0;
      const valorUnit = v.valor_unit || v.valorUnit || 0;
      return sum + (cantidad * valorUnit);
    }, 0);

    const pedidosUnicos = [...new Set(data.map(v => v.id_venta || v.idVenta))].length;

    const clientesUnicos = [...new Set(data.map(v => v.cliente_id || v.clienteId))].length;

    return {
      totalVentas,
      ingresosTotal,
      pedidosUnicos,
      clientesUnicos,
      ventasRecientes: data.slice(-10)
    };
  };

  const generateChartData = (data) => {
    const now = new Date();
    const chartData = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      
      const factor = Math.random() * 0.5 + 0.5;
      const ventasSimuladas = Math.floor(data.length * factor / 7);
      const ingresosSimulados = data.slice(0, ventasSimuladas).reduce((sum, v) => {
        const cantidad = v.cant_comp || v.cantComp || 0;
        const valorUnit = v.valor_unit || v.valorUnit || 0;
        return sum + (cantidad * valorUnit * factor);
      }, 0);

      return {
        fecha: date.toLocaleDateString("es-CO", { day: "numeric", month: "short" }),
        ventas: ventasSimuladas,
        ingresos: parseFloat(ingresosSimulados.toFixed(2))
      };
    });

    return chartData;
  };

  const stats = ventasData.length > 0 ? processStats(ventasData) : {
    totalVentas: 0,
    ingresosTotal: 0,
    pedidosUnicos: 0,
    clientesUnicos: 0,
    ventasRecientes: []
  };

  const chartData = ventasData.length > 0 ? generateChartData(ventasData) : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{label}</p>
          <p className="tooltip-ventas">
            <span className="label">Ventas:</span> {payload[0]?.value || 0}
          </p>
          <p className="tooltip-ingresos">
            <span className="label">Ingresos:</span> ${(payload[1]?.value || 0).toLocaleString('es-CO')}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="dashboard-container">Cargando datos...</div>;
  }

  if (error) {
    return <div className="dashboard-container">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="title-section">
          <h1>Panel de Estadísticas</h1>
          <p className="subtitle">Resumen de ventas y actividad comercial</p>
        </div>
        <button className="btn-regresarr" onClick={handleRegresar}>
          <ArrowLeft size={18} />
          <span>Regresar</span>
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sales-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Ventas</h3>
            <p className="stat-value sales-value">{stats.totalVentas}</p>
            <p className="stat-desc">unidades vendidas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Ingresos Totales</h3>
            <p className="stat-value revenue-value">${stats.ingresosTotal.toLocaleString('es-CO')}</p>
            <p className="stat-desc">en moneda local</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-content">
            <h3>Pedidos Únicos</h3>
            <p className="stat-value orders-value">{stats.pedidosUnicos}</p>
            <p className="stat-desc">procesados</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon customers-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Clientes Únicos</h3>
            <p className="stat-value customers-value">{stats.clientesUnicos}</p>
            <p className="stat-desc">compradores activos</p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h2>Ventas Última Semana (Simulado)</h2>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color ventas-color"></span>
              <span>Ventas</span>
            </div>
            <div className="legend-item">
              <span className="legend-color ingresos-color"></span>
              <span>Ingresos</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="fecha"
              axisLine={{ stroke: "#e0e0e0" }}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={{ stroke: "#e0e0e0" }}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={{ stroke: "#e0e0e0" }}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ventas"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ stroke: '#4f46e5', strokeWidth: 2, r: 4, fill: '#fff' }}
              activeDot={{ stroke: '#4f46e5', strokeWidth: 2, r: 6, fill: '#fff' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="ingresos"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#fff' }}
              activeDot={{ stroke: '#10b981', strokeWidth: 2, r: 6, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="purchases-table-container">
        <h2>Registros de Ventas</h2>
        <div className="table-wrapper">
          <table className="purchases-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Producto</th>
                <th>Cantidad</th>
                <th>Valor Unitario</th>
                <th>Valor Total</th>
                <th>ID Cliente</th>
              </tr>
            </thead>
            <tbody>
              {stats.ventasRecientes.map((v, index) => {
                const cantidad = v.cant_comp || v.cantComp || 0;
                const valorUnit = v.valor_unit || v.valorUnit || 0;
                const valorTotal = cantidad * valorUnit;
                
                return (
                  <tr key={v.id || index}>
                    <td>#{v.id || 'N/A'}</td>
                    <td>#{v.id_producto || v.idProducto || 'N/A'}</td>
                    <td>{cantidad}</td>
                    <td>${valorUnit.toLocaleString('es-CO')}</td>
                    <td className="price-cell">${valorTotal.toLocaleString('es-CO')}</td>
                    <td>#{v.cliente_id || v.clienteId || 'N/A'}</td>
                  </tr>
                );
              })}
              {stats.ventasRecientes.length === 0 && (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                    No hay datos de ventas disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}