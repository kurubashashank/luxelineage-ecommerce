import User from '../models/User.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart');
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
      await user.save();
    }

    res.json({ message: 'Product added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(id => id.toString() !== productId);
    await user.save();

    res.json({ message: 'Product removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from cart' });
  }
};
