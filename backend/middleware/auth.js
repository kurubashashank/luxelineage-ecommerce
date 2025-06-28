import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const extractToken = (req) => req.headers.authorization?.split(' ')[1];

export const verifyToken = (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const verifyUser = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = {
      _id: user._id,
      name: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const verifyAdmin = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = {
      _id: user._id,
      name: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
