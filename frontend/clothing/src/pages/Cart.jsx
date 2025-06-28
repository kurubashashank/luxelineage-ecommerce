import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  const handleCheckout = () => {
    if (!cartItems.length) {
      alert('Your cart is empty.');
      return;
    }
    navigate('/Checkout');
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Shopping Cart</h2>
      <button className="back-btn" onClick={() => navigate('/products')}>← Back to Products</button>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-card">
                <img src={item.image} alt={item.name} className="cart-img" />
                <div className="cart-details">
                  <h4>{item.name}</h4>
                  <p>Price: ₹{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button className="remove-cart-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-section">
            <h3>Checkout Summary</h3>
            <p className="checkout-summary-line"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></p>
            <p className="checkout-summary-line"><span>GST (18%)</span><span>₹{gst.toFixed(2)}</span></p>
            <div className="checkout-total">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
            <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
