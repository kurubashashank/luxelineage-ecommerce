import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RiAdminFill } from "react-icons/ri";
import {FaUser } from "react-icons/fa";
import { IoLogInOutline } from "react-icons/io5";
import { SiGnuprivacyguard } from "react-icons/si";
import { IoMdHome } from "react-icons/io";
import { FaOpencart } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaVanShuttle } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import './Header.css';
import logo from '/images/logo1.png';

const Header = ({
  showSearch = false,
  search = '',
  setSearch = () => {},
  isLoggedIn = false,
  onLogout
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null);
  const { user } = useAuth();

  const handleUserClick = () => setMode('user');
  const handleAdminClick = () => setMode('admin');
  const handleBack = () => setMode(null);
  const handleUserSignup = () => navigate('/signup');
  const handleUserLogin = () => navigate('/login');
  const handleAdminSignup = () => navigate('/admin-signup');
  const handleAdminLogin = () => navigate('/admin-login');

  return (
    <header className="header">
      <div className="header-left" onClick={() => navigate('/')}>
        <img src={logo} alt="Logo" className="header-logo" />
        <h1 className="header-title">Luxe & Lineage</h1>
      </div>

      <div className="header-right">
        {isLoggedIn && (
          <div className="hello-user">Hello, {user?.name || 'User'}</div>
        )}

        <div className="home-buttons">
          {isLoggedIn ? (
            <>
              <button onClick={() => navigate('/')}><IoMdHome /> Home</button>
              <button onClick={() => navigate('/cart')}><FaOpencart /> Cart</button>
              <button onClick={() => navigate('/orders')}><FaVanShuttle /> Orders</button>
              <button onClick={onLogout}><BiLogOut /> Logout</button>
            </>
          ) : mode === 'user' ? (
            <>
              <button onClick={handleUserSignup}><SiGnuprivacyguard /> Signup</button>
              <button onClick={handleUserLogin}><IoLogInOutline /> Login</button>
              <button onClick={handleBack}><IoMdArrowRoundBack /> Back</button>
            </>
          ) : mode === 'admin' ? (
            <>
              <button onClick={handleAdminSignup}><SiGnuprivacyguard /> Admin Signup</button>
              <button onClick={handleAdminLogin}><IoLogInOutline /> Admin Login</button>
              <button onClick={handleBack}><IoMdArrowRoundBack /> Back</button>
            </>
          ) : (
            <>
              <button onClick={handleUserClick}><FaUser /> User</button>
              <button onClick={handleAdminClick}><RiAdminFill/> Admin</button>
            </>
          )}
        </div>

        {showSearch && (
          <input
            type="text"
            className="search-bar"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
