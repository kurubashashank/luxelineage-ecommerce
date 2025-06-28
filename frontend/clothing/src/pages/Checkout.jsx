import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { IoReturnDownBack } from "react-icons/io5";
import { FcViewDetails } from "react-icons/fc";
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;
  const { cartItems, clearCart } = useCart();

  const [userInfo, setUserInfo] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiId, setUpiId] = useState('');

  const items = orderData?.items || cartItems;
  const total = orderData?.total || cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = total * 0.18;
  const grandTotal = total + gst;

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to place an order.');
      navigate('/login');
      return;
    }

    if (!userInfo.fullName || !userInfo.phone || !userInfo.address) {
      alert('Please fill in all fields.');
      return;
    }

    if (paymentMethod === 'UPI' && !upiId) {
      alert('Please enter a valid UPI ID.');
      return;
    }

    try {
      const payload = {
        items,
        total,
        gst,
        grandTotal,
        shippingDetails: userInfo,
        paymentMethod,
        upiId: paymentMethod === 'UPI' ? upiId : null
      };

      const res = await axios.post('http://localhost:5000/api/orders/place', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 201) {
        alert('Order placed successfully!');
        if (!orderData) clearCart(); 
        navigate('/orders');
      }
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to place order.');
    }
  };

  return (
    <div className="details-container">
      <h2><FcViewDetails /> Enter Delivery Details</h2>
      <div className="details-form">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={userInfo.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={userInfo.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Shipping Address"
          value={userInfo.address}
          onChange={handleChange}
          required
        />

        <div className="payment-method">
          <label><strong>Payment Method:</strong></label>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setUpiId('');
                }}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>
          </div>

          {paymentMethod === 'UPI' && (
            <input
              type="text"
              name="upiId"
              placeholder="Enter your UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="upi-input"
              required
            />
          )}
        </div>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>
              {item.name} x {item.quantity} — ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>
        <p><strong>Subtotal:</strong> ₹{total.toFixed(2)}</p>
        <p><strong>GST (18%):</strong> ₹{gst.toFixed(2)}</p>
        <p><strong>Grand Total:</strong> ₹{grandTotal.toFixed(2)}</p>
      </div>

      <button className="place-order-btn" onClick={handlePlaceOrder}>
        Confirm Order
      </button>

      {!orderData && (
        <button className="back-to-cart-btn" onClick={() => navigate('/cart')}>
          <IoReturnDownBack /> Back to Cart
        </button>
      )}
    </div>
  );
};

export default Checkout;
