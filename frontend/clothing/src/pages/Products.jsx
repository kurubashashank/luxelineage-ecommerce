import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Products.css';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import { MdAddShoppingCart } from "react-icons/md";

import o1 from '../assets/o1.jpeg';
import o2 from '../assets/o2.webp';
import t1 from '../assets/t1.jpeg';
import t2 from '../assets/t2.jpeg';
import f1 from '../assets/f1.jpeg';
import f2 from '../assets/f2.jpg';
import h1 from '../assets/h1.jpeg';
import h2 from '../assets/h2.jpeg';
import w1 from '../assets/w1.jpg';
import s1 from '../assets/s1.jpg';

const predefinedProducts = [
  { _id: 'pre1', name: 'Oversized Shirt', price: 1990, description: 'Relaxed-fit shirt for casual comfort and bold styling.', image: o1 },
  { _id: 'pre2', name: 'Oversized Pant', price: 999, description: 'Loose-fitting pant offering ultimate ease and streetwear flair.', image: o2 },
  { _id: 'pre3', name: 'Tailored Shirt', price: 2199, description: 'Sharp and structured shirt designed for a polished look.', image: t1 },
  { _id: 'pre4', name: 'Tailored Pant', price: 2050, description: 'Elegant trousers with a custom-fit feel for formal wear.', image: t2 },
  { _id: 'pre5', name: 'Furnishing Shirt', price: 1500, description: 'Classic everyday shirt ideal for layering and comfort.', image: f1 },
  { _id: 'pre6', name: 'Furnishing Pant', price: 1209, description: 'Soft, breathable pant perfect for home or casual outings.', image: f2 },
  { _id: 'pre7', name: 'Outerwear Coat', price: 1999, description: 'Warm and stylish coat built to protect from harsh weather.', image: h1 },
  { _id: 'pre8', name: 'Trench Coat', price: 4999, description: 'Sophisticated outerwear with a timeless silhouette.', image: h2 },
  { _id: 'pre9', name: 'Formal Shirt', price: 999, description: 'Smart shirt tailored for office wear and formal events.', image: w1 },
  { _id: 'pre10', name: 'Sportswear', price: 799, description: 'Lightweight and flexible wear ideal for workouts or lounging.', image: s1 }
];

const Products = () => {
  const [search, setSearch] = useState('');
  const [adminProducts, setAdminProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setAdminProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  const processedAdminProducts = useMemo(() => {
    return adminProducts.map(product => {
      let imageUrl = product.image || '';

      if (imageUrl.startsWith('data:image') || imageUrl.startsWith('http')) {
        return { ...product, image: imageUrl };
      }
      if (imageUrl.startsWith('/uploads')) {
        imageUrl = `http://localhost:5000${imageUrl.replace(/\\/g, '/')}`;
      }

      return {
        ...product,
        image: imageUrl || '/images/fallback.png'
      };
    });
  }, [adminProducts]);

  const combinedProducts = useMemo(
    () => [...predefinedProducts, ...processedAdminProducts],
    [processedAdminProducts]
  );

  const filteredProducts = useMemo(
    () => combinedProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [combinedProducts, search]
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const username = localStorage.getItem('username') || 'User';

  return (
    <div className="products-container">
      <Header
        showSearch
        search={search}
        setSearch={setSearch}
        isLoggedIn={true}
        username={username}
        onLogout={handleLogout}
      />

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
            const key = product._id || product.name;
            return (
              <div key={key} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`product-image ${loadedImages[key] ? 'loaded' : ''}`}
                  loading="lazy"
                  onLoad={() =>
                    setLoadedImages(prev => ({ ...prev, [key]: true }))
                  }
                  onError={(e) => {
                    e.target.src = '/images/fallback.png';
                  }}
                />
                <h4>{product.name}</h4>
                <p>₹{product.price}</p>
                <p>{product.description}</p>
                <div className="product-actions">
                  <button className="add-to-cart" onClick={() => addToCart(product)}>
                    <MdAddShoppingCart /> Add to Cart
                  </button>
                  <button className="buy-now" onClick={() => navigate(`/buy/${product._id}`)}>
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
