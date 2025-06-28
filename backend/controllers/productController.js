import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const image = req.file?.path;

    const product = new Product({
      name,
      price,
      description,
      category,
      image,
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: 1 });

    const enhanced = products.map((p) => {
      const imagePath = p.image;
      let imageBase64 = '';
      if (fs.existsSync(imagePath)) {
        const fileData = fs.readFileSync(imagePath);
        const ext = path.extname(imagePath).slice(1); 
        imageBase64 = `data:image/${ext};base64,${fileData.toString('base64')}`;
      }

      return {
        ...p.toObject(),
        image: imageBase64 || '',
      };
    });

    res.status(200).json(enhanced);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;

    if (req.file) {
      if (product.image && fs.existsSync(product.image)) {
        fs.unlinkSync(product.image);
      }
      product.image = req.file.path;
    }

    await product.save();
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.image && fs.existsSync(product.image)) {
      fs.unlinkSync(product.image);
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};
