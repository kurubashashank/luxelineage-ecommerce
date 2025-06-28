import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BuyNow.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { IoMdPricetag } from "react-icons/io";

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

const localProducts = [
  { _id: 'pre1', name: 'Oversized Shirt', price: 1990, description: 'Relaxed-fit shirt.', image: o1 },
  { _id: 'pre2', name: 'Oversized Pant', price: 999, description: 'Loose pant.', image: o2 },
  { _id: 'pre3', name: 'Tailored Shirt', price: 2199, description: 'Polished shirt.', image: t1 },
  { _id: 'pre4', name: 'Tailored Pant', price: 2050, description: 'Formal pant.', image: t2 },
  { _id: 'pre5', name: 'Furnishing Shirt', price: 1500, description: 'Everyday shirt.', image: f1 },
  { _id: 'pre6', name: 'Furnishing Pant', price: 1209, description: 'Casual pant.', image: f2 },
  { _id: 'pre7', name: 'Outerwear Coat', price: 1999, description: 'Winter coat.', image: h1 },
  { _id: 'pre8', name: 'Trench Coat', price: 4999, description: 'Timeless coat.', image: h2 },
  { _id: 'pre9', name: 'Formal Shirt', price: 999, description: 'Office shirt.', image: w1 },
  { _id: 'pre10', name: 'Sportswear', price: 799, description: 'Workout wear.', image: s1 }
];

const BuyNow = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (id.startsWith('pre')) {
        const found = localProducts.find(p => p._id === id);
        if (found && isMounted) setProduct(found);
        else navigate('/products');
      } else {
        try {
          const res = await axios.get(`http://localhost:5000/api/products/${id}`);
          if (isMounted && res.data) {
            const product = res.data;
            if (product.image && product.image.startsWith('/uploads')) {
              product.image = `http://localhost:5000${product.image.replace(/\\/g, '/')}`;
            }
            setProduct(product);
          }
        } catch (err) {
          console.error('Product fetch error:', err);
          navigate('/products');
        }
      }
    };

    fetchProduct();
    return () => { isMounted = false };
  }, [id, navigate]);

const handleBuyNow = () => {
  const gst = product.price * 0.18;
  const grandTotal = product.price + gst;

  const orderData = {
    items: [{
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: typeof product.image === 'string' ? product.image : product.image?.src || '',
    }],
    total: product.price,
    gst,
    grandTotal
  };


  navigate('/checkout', { state: { orderData } });
};



  if (!product) return <p>Loading product...</p>;

  const imageToDisplay =
    typeof product.image === 'string'
      ? product.image
      : product.image?.src || '/images/fallback.png';

  return (
    <div className="buy-now-container">
      <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
        <h2><PiShoppingCartSimpleFill /> Buy Now</h2>
        <img
          src={imageToDisplay}
          alt={product.name}
          style={{
            width: '100%',
            maxHeight: '300px',
            objectFit: 'cover',
            borderRadius: '10px'
          }}
          onError={(e) => {
            if (!e.target.src.includes('fallback.png')) {
              e.target.src = '/images/fallback.png';
            }
          }}
        />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p><strong><IoMdPricetag /> Price:</strong> ₹{product.price}</p>
        <button
          onClick={handleBuyNow}
          style={{
            padding: '10px 20px',
            marginRight: '1rem',
            backgroundColor: '#0D5EA6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Checkout
        </button>
        <button
          onClick={() => navigate('/products')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #999'
          }}
        >
          <IoMdArrowRoundBack /> Back
        </button>
      </div>
    </div>
  );
};

export default BuyNow;
