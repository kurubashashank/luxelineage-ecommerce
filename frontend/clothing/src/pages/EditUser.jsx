import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TbArrowBackUp } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [preview, setPreview] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setName(res.data.name);
        setEmail(res.data.email);
        setPreview(res.data.profileImage?.startsWith('http') ? res.data.profileImage : `http://localhost:5000${res.data.profileImage}`);
      } catch (err) {
        console.error('Failed to load user:', err);
        alert('Failed to load user');
      }
    };
    fetchUser();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (profileImage) formData.append('profileImage', profileImage);

      await axios.put(`http://localhost:5000/api/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (newPassword) {
        await axios.put(`http://localhost:5000/api/users/${id}/reset-password`, {
          newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert('User updated successfully!');
      navigate('/signup-users-data');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update user');
    }
  };

  return (
    <div className="form-container">
      <h2><FaRegEdit /> Edit User</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Reset Password (optional)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: '80px', borderRadius: '50%', marginTop: '10px' }}
          />
        )}
        <button type="submit">Update</button>
      </form>
      <button onClick={() => navigate('/signup-users-data')}><TbArrowBackUp /> Back</button>
    </div>
  );
};

export default EditUser;
