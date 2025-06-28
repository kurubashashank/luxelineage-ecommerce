import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');

    try {
      await axios.post('http://localhost:5000/api/users/cart', { productId: product._id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Added to cart!');
    } catch (err) {
      alert('Error adding to cart');
    }
  };

  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? `${product.image}?v=${product.updatedAt || product._id}`
      : `http://localhost:5000/${product.image.replace(/\\/g, '/')}?v=${product.updatedAt || product._id}`
    : '/images/fallback.png';

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={imageUrl}
          alt={product.name}
          className="product-img"
          onError={(e) => {
            console.error('Failed to load image:', e.target.src);
            e.target.onerror = null;
            e.target.src = '/images/fallback.png';
          }}
        />
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>
      <button className="cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
