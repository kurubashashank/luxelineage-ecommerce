import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import Header from '../components/Header';
import { MdAdd } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import { IoHomeOutline } from "react-icons/io5";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="admin-navigation">
  <button onClick={() => navigate('/admin-products')}><MdAdd /> Add Products</button>
  <button onClick={() => navigate('/signup-users-data')}><FaUsers /> Track Users</button>
  <button onClick={() => navigate('/admin-orders')}><LiaMoneyBillWaveAltSolid /> View Orders</button>
  <button onClick={() => navigate('/')}><IoHomeOutline /> Back to Home</button>
</div>

    </div>
  );
};

export default Admin;