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

const generateChartData = () => {
  const now = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    const ventas = Math.floor(Math.random() * 1000) + 200;
    return {
      fecha: date.toLocaleDateString("es-CO", { day: "numeric", month: "short" }),
      ventas,
      ingresos: parseFloat((ventas * (Math.random() * 30 + 20)).toFixed(2)),
    };
  });
};

const generatePurchases = (ventas) => {
  const productos = [
    { id: 1, nombre: "Camisa", precio: 29.99 },
    { id: 2, nombre: "Pantalón", precio: 49.99 },
    { id: 3, nombre: "Zapatos", precio: 79.99 },
    { id: 4, nombre: "Gorra", precio: 19.99 },
  ];

  const compras = [];
  for (let i = 1; i <= Math.floor(ventas / 100); i++) {
    const prod = productos[Math.floor(Math.random() * productos.length)];
    compras.push({
      purchaseId: i,
      productoId: prod.id,
      nombreProducto: prod.nombre,
      correo: `cliente${i}@example.com`,
      valor: prod.precio,
    });
  }
  return compras;
};

export default function DashboardVentas() {
  document.title = 'Estadísticas';
  const navigate = useNavigate();
  
  const handleRegresar = () => {
    navigate(-1);
  };
  
  const [chartData, setChartData] = useState(generateChartData());
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const newChartData = generateChartData();
    setChartData(newChartData);
    setPurchases(generatePurchases(newChartData[newChartData.length - 1].ventas));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{label}</p>
          <p className="tooltip-ventas">
            <span className="label">Ventas:</span> {payload[0].value}
          </p>
          <p className="tooltip-ingresos">
            <span className="label">Ingresos:</span> ${payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

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

      {/* Estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sales-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Ventas Hoy</h3>
            <p className="stat-value sales-value">{chartData[chartData.length - 1].ventas}</p>
            <p className="stat-desc">unidades vendidas</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Ingresos Hoy</h3>
            <p className="stat-value revenue-value">${chartData[chartData.length - 1].ingresos.toLocaleString('es-CO')}</p>
            <p className="stat-desc">en moneda local</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orders-icon">
            <ShoppingBag size={24} />
          </div>
          <div className="stat-content">
            <h3>Pedidos</h3>
            <p className="stat-value orders-value">{purchases.length}</p>
            <p className="stat-desc">procesados hoy</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon customers-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>Clientes Únicos</h3>
            <p className="stat-value customers-value">{new Set(purchases.map(p => p.correo)).size}</p>
            <p className="stat-desc">compradores activos</p>
          </div>
        </div>
      </div>

      {/* Gráfica de líneas de ventas */}
      <div className="chart-container">
        <div className="chart-header">
          <h2>Ventas Última Semana</h2>
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

      {/* Tabla de compras */}
      <div className="purchases-table-container">
        <h2>Últimas Compras</h2>
        <div className="table-wrapper">
          <table className="purchases-table">
            <thead>
              <tr>
                <th>ID Compra</th>
                <th>ID Producto</th>
                <th>Producto</th>
                <th>Correo Comprador</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.purchaseId}>
                  <td>#{p.purchaseId}</td>
                  <td>#{p.productoId}</td>
                  <td>{p.nombreProducto}</td>
                  <td>{p.correo}</td>
                  <td className="price-cell">${p.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}