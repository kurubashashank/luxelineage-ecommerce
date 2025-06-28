import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FcCancel } from 'react-icons/fc';
import { TbInvoice } from 'react-icons/tb';
import { FaVanShuttle } from 'react-icons/fa6';
import { FaRegEdit } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/orders/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirm = window.confirm('Are you sure you want to cancel this order?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order canceled successfully!');
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      console.error('Cancel failed:', err);
      alert('Failed to cancel order');
    }
  };

  const generatePDF = (order) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Your Order Invoice - Luxe & Lineage', 20, 20);

  doc.setFontSize(12);
  doc.text(`Order ID: ${order._id}`, 20, 30);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 40);

  doc.text('Items:', 20, 50);
  order.items.forEach((item, idx) => {
    doc.text(
      `${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`,
      25,
      60 + idx * 10
    );
  });

  const baseY = 60 + order.items.length * 10;
  doc.text(`Total: ₹${order.total.toFixed(2)}`, 20, baseY + 10);
  doc.text(`GST (18%): ₹${order.gst.toFixed(2)}`, 20, baseY + 20);
  doc.text(`Grand Total: ₹${order.grandTotal.toFixed(2)}`, 20, baseY + 30);
  doc.text(`Status: ${order.status}`, 20, baseY + 40);

  if (order.shippingDetails) {
    doc.text(`Shipping To: ${order.shippingDetails.fullName}`, 20, baseY + 50);
    doc.text(`Phone: ${order.shippingDetails.phone}`, 20, baseY + 60);
    doc.text(`Address: ${order.shippingDetails.address}`, 20, baseY + 70);
  }


  doc.text(`Payment Method: ${order.paymentMethod}`, 20, baseY + 80);
  if (order.paymentMethod === 'UPI' && order.upiId) {
    doc.text(`UPI ID: ${order.upiId}`, 20, baseY + 90);
  }

  doc.save(`invoice_${order._id}.pdf`);
};


  return (
    <div className="orders-container">
      <h2 className="orders-title">Your Orders</h2>

      <button
        className="back-products-btn"
        onClick={() => navigate('/products')}
      >
        <IoMdArrowRoundBack /> Back to Products
      </button>

      {orders.length === 0 ? (
        <p>No orders yet. Go to products to place one!</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h4>Order ID: {order._id}</h4>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Grand Total:</strong> ₹{order.grandTotal.toFixed(2)}</p>
            <ul className="order-items">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p><FaVanShuttle /> Status: <strong>{order.status}</strong></p>

            <button onClick={() => generatePDF(order)} className="download-btn">
              <TbInvoice /> Download Invoice
            </button>

            {order.status === 'Pending' && (
              <div className="order-actions">
                <button
                  className="edit-order-btn"
                  onClick={() => navigate(`/edit-order/${order._id}`)}
                >
                  <FaRegEdit /> Edit Order
                </button>
                <button
                  className="cancel-order-btn"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  <FcCancel /> Cancel Order
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
