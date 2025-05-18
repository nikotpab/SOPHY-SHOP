import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CatalogPage from './CatalogPage';
import Layout from './Layout';

const HomePage = () => (
  <div className="home-container">
    <h1>Bienvenido a nuestra tienda</h1>
    <p>Descubre nuestros productos destacados</p>
    <div className="featured-categories">
      <div className="category-card">
        <img src="/api/placeholder/400/300" alt="Categoría Hombres" />
        <h2>Hombres</h2>
        <a href="/catalogo/hombres">Ver colección</a>
      </div>
      <div className="category-card">
        <img src="/api/placeholder/400/300" alt="Categoría Mujeres" />
        <h2>Mujeres</h2>
        <a href="/catalogo/mujeres">Ver colección</a>
      </div>
    </div>
  </div>
);

// Componente Layout que incluye encabezado y pie de página
const MainLayout = ({ children }) => (
  <Layout>
    {children}
  </Layout>
);

// Configuración de las rutas
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/catalogo/:categorySlug" element={
          <MainLayout>
            {/* Usamos un componente intermedio para pasar los parámetros de la URL al componente CatalogPage */}
            <RouteWithCategory />
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
};

// Componente para pasar los parámetros de la URL a CatalogPage
const RouteWithCategory = () => {
  // En una aplicación real, usarías useParams de react-router-dom
  const categorySlug = window.location.pathname.split('/').pop();
  return <CatalogPage categorySlug={categorySlug} />;
};

export default AppRoutes;