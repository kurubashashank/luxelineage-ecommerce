import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import { IoReturnDownBackOutline } from "react-icons/io5";
import { FaBox } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaFileInvoiceDollar } from "react-icons/fa";
import './AdminOrders.css';

const AdminOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [emailFilter, setEmailFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchOrders();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {

        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      console.error('Deletion error:', err);
    }
  };

  const generatePDF = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Invoice - Luxe & Lineage', 20, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 20, 30);
    doc.text(`Customer: ${order.user?.name || 'N/A'} (${order.user?.email})`, 20, 40);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 50);
    doc.text('Items:', 20, 60);

    order.items.forEach((item, idx) => {
      doc.text(`${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`, 25, 70 + idx * 10);
    });

    doc.text(`Total: ₹${order.grandTotal.toFixed(2)}`, 20, 80 + order.items.length * 10);
    doc.text(`Status: ${order.status}`, 20, 90 + order.items.length * 10);
    doc.save(`invoice_${order._id}.pdf`);
  };

  const filteredOrders = allOrders.filter((order) => {
    const matchEmail = emailFilter === '' || (order.user?.email ?? '').includes(emailFilter);
    const matchDate = dateFilter === '' || new Date(order.createdAt).toISOString().split('T')[0] === dateFilter;
    return matchEmail && matchDate;
  });

  return (
    <div className="admin-orders-container">
      <h2><FaBox /> Admin - All Orders</h2>

      <button className="back-btn" onClick={() => navigate('/admin')}>
        <IoReturnDownBackOutline /> Back to Dashboard
      </button>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filter by email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button onClick={fetchOrders}>Search</button>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div key={order._id} className="admin-order-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>User:</strong> {order.user?.name || 'Unknown'} ({order.user?.email})</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <ul className="order-items-list">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity} — ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ₹{order.grandTotal.toFixed(2)}</p>

              <div className="order-actions">
                <label>Status:
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <button className="invoice-btn" onClick={() => generatePDF(order)}><FaFileInvoiceDollar /> Invoice</button>
                <button className="delete-btn" onClick={() => handleDelete(order._id)}><RiDeleteBinFill /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
