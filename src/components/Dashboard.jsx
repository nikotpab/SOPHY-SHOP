import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import '../css/Dashboard.css';
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  document.title = 'Panel de administración';

  const [usuariosData, setUsuariosData] = useState([]);
  const [ventasData, setVentasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuariosResponse = await fetch('http://localhost:8181/usuario/getAll');
        if (!usuariosResponse.ok) {
          throw new Error('Error al obtener usuarios');
        }
        const usuarios = await usuariosResponse.json();

        const ventasResponse = await fetch('http://localhost:8181/venta/getAll');
        if (!ventasResponse.ok) {
          throw new Error('Error al obtener ventas');
        }
        const ventas = await ventasResponse.json();

        setUsuariosData(usuarios);
        setVentasData(ventas);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processUserStats = (usuarios) => {
    const activos = usuarios.filter(u => u.estado === 0).length;
    const bloqueados = usuarios.filter(u => u.estado === 1).length;
    return {
      usuariosActivos: activos,
      usuariosBloqueados: bloqueados,
      totalUsuarios: usuarios.length
    };
  };

  const processVentasStats = (ventas) => {
    const totalVentas = ventas.reduce((sum, v) => {
      const valor = v.valor_venta != null 
        ? parseFloat(v.valor_venta) 
        : (v.valorVenta != null ? parseFloat(v.valorVenta) : 0);
      return sum + valor;
    }, 0);

    const pedidosUnicos = ventas.length;

    return {
      totalVentas,
      totalUnidades: pedidosUnicos,
      pedidosUnicos
    };
  };

  const generateSalesData = (ventas) => {
    const mesesLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const salesByMonth = Array.from({ length: 12 }, () => ({ ventas: 0, pedidos: 0 }));

    ventas.forEach(v => {
      const fechaStr = v.fecha_venta || v.fechaVenta;
      if (!fechaStr) return;

      const fecha = new Date(fechaStr);
      if (isNaN(fecha.getTime())) return;

      const mesIndex = fecha.getMonth();

      const valor = v.valor_venta != null 
        ? parseFloat(v.valor_venta) 
        : (v.valorVenta != null ? parseFloat(v.valorVenta) : 0);

      salesByMonth[mesIndex].ventas += valor;
      salesByMonth[mesIndex].pedidos += 1;
    });

    const data = [
      ["Mes", "Ventas (COP)", "Pedidos"]
    ];

    mesesLabels.forEach((label, idx) => {
      const totalMes = salesByMonth[idx].ventas;
      const pedidosMes = salesByMonth[idx].pedidos;
      data.push([label, totalMes, pedidosMes]);
    });

    return data;
  };

  const generateUserData = (usuarios) => {
    const stats = processUserStats(usuarios);
    return [
      ["Estado", "Cantidad"],
      ["Activos", stats.usuariosActivos],
      ["Bloqueados", stats.usuariosBloqueados],
    ];
  };

  const userStats = usuariosData.length > 0 
    ? processUserStats(usuariosData) 
    : { usuariosActivos: 0, usuariosBloqueados: 0, totalUsuarios: 0 };

  const ventasStats = ventasData.length > 0 
    ? processVentasStats(ventasData) 
    : { totalVentas: 0, totalUnidades: 0, pedidosUnicos: 0 };

  const salesData = ventasData.length > 0 
    ? generateSalesData(ventasData) 
    : [
        ["Mes", "Ventas (COP)", "Pedidos"],
        ["Ene", 0, 0],
        ["Feb", 0, 0],
        ["Mar", 0, 0],
        ["Abr", 0, 0],
        ["May", 0, 0],
        ["Jun", 0, 0],
        ["Jul", 0, 0],
        ["Ago", 0, 0],
        ["Sep", 0, 0],
        ["Oct", 0, 0],
        ["Nov", 0, 0],
        ["Dic", 0, 0],
      ];

  const userData = usuariosData.length > 0 
    ? generateUserData(usuariosData) 
    : [
        ["Estado", "Cantidad"],
        ["Activos", 0],
        ["Bloqueados", 0]
      ];

  const tasaConversion = userStats.totalUsuarios > 0 
    ? ((ventasStats.pedidosUnicos / userStats.totalUsuarios) * 100).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'
        }}>
          Cargando datos del dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red'
        }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li>
              <Link to="/admin/dashboard/empresa">
                <span className="icon">⚒</span> Empresa
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/productos">
                <span className="icon">📦</span> Productos
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/categorias">
                <span className="icon">🏷</span> Categorías
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/usuarios">
                <span className="icon">👥</span> Usuarios
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/historial">
                <span className="icon">📋</span> Historial
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/auditoria">
                <span className="icon">📊</span> Auditoría
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/estadisticas">
                <span className="icon">📈</span> Estadísticas
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="header-cards">
          <div className="card">
            <h3>Total Usuarios</h3>
            <p>{userStats.totalUsuarios}</p>
            <div className="card-icon">👥</div>
          </div>
          <div className="card">
            <h3>Ventas Totales</h3>
            <p>${ventasStats.totalVentas.toLocaleString()}</p>
            <div className="card-icon">💰</div>
          </div>
          <div className="card">
            <h3>Pedidos Únicos</h3>
            <p>{ventasStats.pedidosUnicos}</p>
            <div className="card-icon">📦</div>
          </div>
          <div className="card">
            <h3>Tasa de Conversión</h3>
            <p>{tasaConversion}%</p>
            <div className="card-icon">📈</div>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h3>Ventas por Mes</h3>
            <Chart
              chartType="ComboChart"
              width="100%"
              height="400px"
              data={salesData}
              options={{
                title: 'Ventas y Pedidos por Mes',
                vAxis: { title: 'Valor' },
                hAxis: { title: 'Mes' },
                seriesType: 'bars',
                series: { 1: { type: 'line' } },
              }}
            />
          </div>

          <div className="chart-card">
            <h3>Distribución de Usuarios</h3>
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={userData}
              options={{
                title: 'Estado de Usuarios',
                pieHole: 0.4,
                colors: ['#2ecc71', '#e74c3c'],
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
