import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TiArrowBack } from "react-icons/ti";
import { IoMdPricetag } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import './AdminProducts.css';

const AdminProducts = () => {
  const navigate = useNavigate();

  const defaultForm = {
    name: '',
    price: '',
    description: '',
    category: '',
    image: null,
  };

  const [formData, setFormData] = useState(defaultForm);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? '', 
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file || null }));
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('category', formData.category);
    if (formData.image) {
      data.append('image', formData.image);
    }

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, data, { headers });
        alert('Product updated!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/products', data, { headers });
        alert('Product added!');
      }

      setFormData(defaultForm);
      setImagePreview(null);
      fetchProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Save failed:', err.response?.data || err);
      alert('Failed to save product.');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      category: product.category || '',
      image: null, 
    });
    setImagePreview(product.image || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="admin-products-container">
      <h2>Admin Product Management</h2>
      <button className="back-home-btn" onClick={() => navigate('/admin')}>
        <TiArrowBack /> Back to Dashboard
      </button>

      <form className="admin-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name || ''}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price || ''}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description || ''}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category || ''}
          onChange={handleInputChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="image-preview"
            style={{ width: '120px', margin: '10px 0' }}
          />
        )}
        <button type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
      </form>

      <h3>All Products</h3>
      <div className="admin-products-grid">
        {products.map((product) => (
          <div key={product._id} className="admin-product-card">
            <img
              src={product.image || '/images/fallback.png'}
              alt={product.name}
              className="product-image"
              onError={(e) => (e.target.src = '/images/fallback.png')}
            />
            <h4>{product.name}</h4>
            <p><IoMdPricetag /> ₹{product.price}</p>
            <p>{product.description}</p>
            <p>Category: {product.category || 'N/A'}</p>
            <div className="product-actions">
              <button onClick={() => handleEdit(product)}><FaRegEdit /> Edit</button>
              <button onClick={() => handleDelete(product._id)}><RiDeleteBin2Line /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
