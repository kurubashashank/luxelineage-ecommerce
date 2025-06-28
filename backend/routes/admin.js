import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { verifyAdmin } from '../middleware/auth.js'; 

dotenv.config();
const router = express.Router();

console.log('admin.js loaded');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; 

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name, 
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        isAdmin: newAdmin.isAdmin
      }
    });
  } catch (err) {
    console.error('Admin Register Error:', err);
    res.status(500).json({ message: 'Failed to register admin', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin) return res.status(401).json({ message: 'Not an admin' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name, 
        email: admin.email,
        isAdmin: true
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;
