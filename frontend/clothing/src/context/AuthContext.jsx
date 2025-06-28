import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    }
  }, []);

const login = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', res.data.username);
    return res.data;
  } catch (err) {
    console.error('Login failed:', err);
    throw err;
  }
};

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
