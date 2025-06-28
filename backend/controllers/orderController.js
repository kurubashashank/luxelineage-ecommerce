import Order from '../models/Order.js';

export const placeOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;
    const newOrder = new Order({
      userId: req.user.id,
      products,
      totalPrice,
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};