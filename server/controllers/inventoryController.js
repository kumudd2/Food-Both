// controllers/inventoryController.js
const Inventory = require('../models/Inventory');
const { validationResult } = require('express-validator');

// @desc  Get all inventory (admin)
// @route GET /api/inventory
exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().populate('menuItem', 'name category price');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Upsert inventory for a menu item (admin)
// @route POST /api/inventory
exports.upsertInventory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { menuItem, quantity, threshold } = req.body;
  try {
    const inv = await Inventory.findOneAndUpdate(
      { menuItem },
      { quantity, threshold },
      { upsert: true, new: true }
    ).populate('menuItem', 'name category price');
    res.json(inv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc  Update stock quantity (admin)
// @route PATCH /api/inventory/:id
exports.updateStock = async (req, res) => {
  const { quantity } = req.body;
  try {
    const inv = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    ).populate('menuItem', 'name');
    if (!inv) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(inv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
