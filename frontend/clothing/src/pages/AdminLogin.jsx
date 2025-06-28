import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';
import { IoReturnDownBackOutline } from "react-icons/io5";

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@luxe.com');
  const [password, setPassword] = useState('admin@123');
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password,
      });

      const { token, admin } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(admin));

      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Invalid admin credentials.');
    }
  };

  return (
    <div className="admin-login-container">
      <img
        src="/images/logo.png"
        alt="Luxe & Lineage"
        className="admin-logo"
      />
      <Link to="/" className="back-home-link"><IoReturnDownBackOutline /> Back to Home</Link>

      <form className="admin-login-form" onSubmit={handleAdminLogin}>
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
};

export default AdminLogin;
