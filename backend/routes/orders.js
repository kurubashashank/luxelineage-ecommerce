import express from 'express';
import { verifyAdmin, verifyUser } from '../middleware/auth.js';
import Order from '../models/Order.js';

const router = express.Router();

router.post('/place', verifyUser, async (req, res) => {
  const {
    items,
    total,
    gst,
    grandTotal,
    shippingDetails,
    paymentMethod,
    upiId
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Order must have at least one item.' });
  }

  if (!shippingDetails || !paymentMethod) {
    return res.status(400).json({ message: 'Shipping and payment details required.' });
  }

  try {
    const newOrder = new Order({
      user: req.user._id,
      items,
      total,
      gst,
      grandTotal,
      shippingDetails,
      paymentMethod,
      upiId: paymentMethod === 'UPI' ? upiId : null
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});
router.delete('/:id', verifyUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log('Order not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Order not found' });
    }

    const isAdmin = req.user.isAdmin;
    const isOwner = order.user.toString() === req.user._id.toString();

    console.log('Requesting user:', req.user._id);
    console.log('Order belongs to:', order.user.toString());
    console.log('Is owner?', isOwner);
    console.log('Is admin?', isAdmin);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized user' });
    }

    if (!isAdmin && order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be canceled' });
    }

    await order.deleteOne();
    res.json({
      message: isAdmin ? 'Order deleted by admin' : 'Order canceled successfully',
    });

  } catch (err) {
    console.error('Cancel/Delete Error:', err.message);
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
});
router.put('/:id', verifyUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized or order not found' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be updated' });
    }

    order.items = req.body.items || order.items;
    order.total = req.body.total || order.total;
    order.gst = req.body.gst || order.gst;
    order.grandTotal = req.body.grandTotal || order.grandTotal;

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
});

router.get('/', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

router.get('/user', verifyUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your orders', error: err.message });
  }
});

router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

export default router;
