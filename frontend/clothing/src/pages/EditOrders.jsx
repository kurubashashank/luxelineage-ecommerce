import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditOrder.css';
import { FaRegEdit } from "react-icons/fa";

const EditOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/orders/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const foundOrder = res.data.find(o => o._id === id);
        if (!foundOrder) return alert('Order not found');
        if (foundOrder.status !== 'Pending') {
          alert('Only pending orders can be edited.');
          return navigate('/orders');
        }
        setOrder(foundOrder);
      } catch (err) {
        console.error('Error fetching order:', err);
        alert('Failed to load order');
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const handleQtyChange = (index, value) => {
    const updatedItems = [...order.items];
    updatedItems[index].quantity = Number(value);
    setOrder({ ...order, items: updatedItems });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;

    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, {
        ...order,
        total: subtotal,
        gst,
        grandTotal,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Order updated!');
      navigate('/orders');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update order.');
    }
  };

  if (!order) return <p className="loading-text">Loading order...</p>;

  return (
    <div className="edit-order-container">
      <h2><FaRegEdit /> Edit Your Order</h2>
      <form onSubmit={handleUpdate} className="edit-order-form">
        {order.items.map((item, index) => (
          <div key={item._id} className="edit-item">
            <div className="item-name">
              {item.name} - ₹{item.price}
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => handleQtyChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="submit" className="update-btn">Update Order</button>
        <button type="button" className="cancel-btn" onClick={() => navigate('/orders')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditOrder;
