import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  total: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  },
  shippingDetails: {
    fullName: String,
    phone: String,
    address: String
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'UPI'],
    required: true
  },
  upiId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
