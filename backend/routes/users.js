import express from 'express';
import User from '../models/User.js';
import verifyToken from '../middleware/verifyToken.js';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

router.get('/', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.put('/:id', verifyToken, upload.single('profileImage'), async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

  try {
    const { name, email } = req.body;
    const update = { name, email };

    if (req.file) {
      update.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.put('/:id/reset-password', verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashed });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

export default router;
