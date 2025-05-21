import { Chart } from "react-google-charts";
import '../css/Dashboard.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {

  const navigate = useNavigate();
  document.title='Panel de administración'
  const salesData = [
    ["Mes", "Ventas", "Gastos"],
    ["Ene", 1000, 400],
    ["Feb", 1170, 460],
    ["Mar", 660, 1120],
    ["Abr", 1030, 540],
    ["May", 1890, 620],
  ];

  const productsData = [
    ["Producto", "Popularidad"],
    ["CD's", 11],
    ["Vinilos", 2],
    ["Cassettes", 2],
    ["Camisetas", 2],
    ["Otros", 7],
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li>
  <Link to="/admin/dashboard/productos">
    <span className="icon">📊</span> Productos
  </Link>
</li>
<li>
  <Link to="/admin/dashboard/usuarios">
    <span className="icon">👤</span> Usuarios
  </Link>
</li>
<li>
  <Link to="/admin/dashboard/ventas">
    <span className="icon">💰</span> Ventas
  </Link>
</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="header-cards">
          <div className="card">
            <h3>Usuarios Activos</h3>
            <p>2,543</p>
            <span className="card-icon">👥</span>
          </div>
          <div className="card">
            <h3>Ventas Totales</h3>
            <p>$45,234</p>
            <span className="card-icon">💰</span>
          </div>
          <div className="card">
            <h3>Conversión</h3>
            <p>3.6%</p>
            <span className="card-icon">📈</span>
          </div>
        </div>
        <button className="btn-logout" onClick={() => navigate('/')}>
      <span>Cerrar sesión</span>
    </button>
        <div className="charts-container">
          <div className="chart-card">
            <h3>Ventas Mensuales</h3>
            <Chart
              width={'100%'}
              height={'300px'}
              chartType="Line"
              loader={<div>Cargando gráfica...</div>}
              data={salesData}
              options={{
                colors: ['#4CAF50', '#FF5252'],
                backgroundColor: 'transparent',
              }}
            />
          </div>

          <div className="chart-card">
            <h3>Distribución de Productos</h3>
            <Chart
              width={'100%'}
              height={'300px'}
              chartType="PieChart"
              loader={<div>Cargando gráfica...</div>}
              data={productsData}
              options={{
                colors: ['#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'],
                backgroundColor: 'transparent',
                pieHole: 0.4,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;