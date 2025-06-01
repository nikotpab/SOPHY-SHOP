import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductView';
import ShoppingCart from './components/ShoppingCart';
import Dashboard from './components/Dashboard';
import { CartProvider } from './components/CartContext';
import Products from './components/Dashboard_products';
import { ProductProvider } from './components/ProductContext';
import DeliveryInfo from './components/DeliveryInfo';
import Users from './components/Users';
import Statics from './components/Statics'
import Category from './components/Category'
import Company from './components/Company'
import Account from './components/ConfigAccount'
import History from './components/History'
import Audit from './components/Audit'

function App() {
  return (
    <ProductProvider>
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/catalogo" element={<ProductCatalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<ShoppingCart />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/pago" element={<DeliveryInfo />} />
          <Route path="/admin/dashboard/productos" element={<Products />} />
          <Route path="/admin/dashboard/usuarios" element={<Users />} />
          <Route path="/admin/dashboard/ventas" element={<Statics />} />
          <Route path="/admin/dashboard/categoria" element={<Category />} />
          <Route path="/admin/dashboard/empresa" element={<Company />} />
          <Route path="/admin/dashboard/auditoria" element={<Audit />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/historial" element={<History />} />

        </Routes>
      </Router>
    </CartProvider>
    </ProductProvider>
  );
}

export default App;