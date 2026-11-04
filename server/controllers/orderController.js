// controllers/orderController.js
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');

// @desc  Get current user's orders
// @route GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.menuItem', 'name price imageUrl')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Get all orders (admin)
// @route GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Create a new order
// @route POST /api/orders
exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { items } = req.body; // [{ menuItem, quantity }]
  try {
    // Calculate total price by looking up each menu item
    let totalPrice = 0;
    for (const it of items) {
      const menu = await MenuItem.findById(it.menuItem);
      if (!menu) return res.status(404).json({ message: `Menu item ${it.menuItem} not found` });
      totalPrice += menu.price * it.quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    });

    const populated = await order.populate('items.menuItem', 'name price imageUrl');
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Update order status (admin)
// @route PATCH /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.menuItem', 'name price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
