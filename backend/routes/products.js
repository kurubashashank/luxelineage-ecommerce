import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import path from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/Product.js';
import { verifyAdmin } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `products/${uuidv4()}${ext}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (!file) {
      cb(null, true);
      return;
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png','image/avif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      image: req.file.location,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

router.put('/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const updatedFields = {
      name,
      price,
      description,
      category,
    };

    if (req.file) {
      updatedFields.image = req.file.location; 
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

export default router;
