import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Home.css';

import oversizedImg from '../assets/imgg1.avif';
import TailoredImg from '../assets/imgg2.avif';
import FurnishingImg from '../assets/imgg3.jpeg';
import HeavyImg from '../assets/imgg4.jpeg';
import formalImg from '../assets/imgg5.jpeg';
import sportsImg from '../assets/imgg6.webp';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'oversized', description: 'Relaxed-fit garments designed for comfort and a bold, modern aesthetic.', image: oversizedImg },
    { name: 'Tailored clothing', description: 'Elegant and structured garments for formal and professional wear.', image: TailoredImg },
    { name: 'Furnishing', description: 'Essential inner and layering pieces for everyday comfort and style.', image: FurnishingImg },
    { name: 'Heavy outerwear', description: 'Protective outer layers designed to keep you warm in harsh weather', image: HeavyImg },
    { name: 'formal dress', description: 'Durable apparel built for functionality and tough work environments.', image: formalImg },
    { name: 'Active sportswear', description: 'Performance-driven clothing and footwear for athletic and active lifestyles.', image: sportsImg }
  ];

  return (
    <div style={{ flex: 1, width: '100%', padding: '1rem' }}>
      <Header isLoggedIn={false} showSearch={false} />
      <div className="home-container">
        <h2 className="home-title">Welcome to Clothing Store</h2>
        <p className="home-subtitle">Elevate Your Style</p>

        <h3 className="featured-title">Categories</h3>
        <div className="featured-products-grid">
          {categories.map((cat, index) => (
            <div
              className="product-card clickable"
              key={index}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
            >
              <div className="image-overlay">
                <img src={cat.image} alt={cat.name} className="product-image"  />
                <div className="overlay-gradient" />
              </div>
              <h4>{cat.name}</h4>
              <p>{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
