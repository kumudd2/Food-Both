// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
      unique: true,
    },
    quantity: { type: Number, required: true, min: 0 },
    threshold: { type: Number, default: 10 }, // low-stock alert level
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
