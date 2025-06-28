import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css'; 
import { TbArrowBackUp } from "react-icons/tb";

const AdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/register', {
        name,   
        email,
        password,
      });

      alert(res.data.message || 'Admin registered successfully');
      navigate('/admin-login');
    } catch (err) {
      console.error('Signup Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <img
        src="/images/logo.png"
        alt="luxe & Lineage"
        className="admin-logo"
      />
      <Link to="/" className="back-home-link">
        <TbArrowBackUp /> Back to Home
      </Link>

      <form className="admin-login-form" onSubmit={handleAdminSignup}>
        <h2>Admin Signup</h2>

        <input
          type="text"
          placeholder="Admin Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <button type="submit">Register Admin</button>
      </form>
    </div>
  );
};

export default AdminSignup;
