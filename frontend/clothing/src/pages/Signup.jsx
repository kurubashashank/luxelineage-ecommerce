
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { login } = useAuth() || {}; 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name); 
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (profilePic) data.append('profileImage', profilePic);

      const res = await axios.post('http://localhost:5000/api/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (login) login(res.data); 
      navigate('/');
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Signup failed. Try again.');
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label className="file-label">Upload Profile Image:</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '10px' }}
            />
          )}

          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
