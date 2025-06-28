import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css'


import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminProducts from './pages/AdminProducts';
import TrackUsers from './pages/TrackUsers';
import AdminSignup from './pages/AdminSignup';
import AdminOrders from './pages/AdminOrders';
import BuyNow from './pages/BuyNow';
import EditUser from './pages/EditUser';
import EditOrder from './pages/EditOrders';
import Checkout from './pages/Checkout'; 


const App = () => {
  
  return (
    <main style={{ padding: '1rem' }}>
       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-products" element={<AdminProducts />} />
         <Route path="/checkout" element={<Checkout />} />
        <Route path="/signup-users-data" element={<TrackUsers />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
          <Route path="/buy/:id" element={<BuyNow />} />

          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/edit-order/:id" element={<EditOrder />} />

      </Routes>
      </div>
    </main>
    
  );
};

export default App;

