// seed/seedData.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');
const Inventory = require('../models/Inventory');

const seed = async () => {
  await connectDB();

  // Clear all collections
  await Promise.all([
    MenuItem.deleteMany(),
    User.deleteMany(),
    Order.deleteMany(),
    Feedback.deleteMany(),
    Inventory.deleteMany(),
  ]);

  console.log('🗑️  Cleared existing data...');

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@foodbooth.edu',
    password: 'admin123',
    role: 'admin',
  });

  // Create student user
  const student = await User.create({
    name: 'John Doe',
    email: 'jdoe24@university.edu',
    password: 'student123',
    role: 'student',
  });

  console.log('👤  Users created...');

  // Create menu items
  const menuItems = await MenuItem.insertMany([
    {
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, cheese and special sauce',
      price: 4.99,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      category: 'Main',
    },
    {
      name: 'Grain Bowl',
      description: 'Quinoa, roasted veggies, avocado and lemon vinaigrette',
      price: 5.99,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      category: 'Healthy',
    },
    {
      name: 'Crispy Fries',
      description: 'Golden french fries with sea salt',
      price: 2.49,
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
      category: 'Sides',
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic tomato, fresh mozzarella, basil',
      price: 6.99,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      category: 'Main',
    },
    {
      name: 'Caesar Salad',
      description: 'Romaine lettuce, croutons, parmesan, caesar dressing',
      price: 4.49,
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      category: 'Healthy',
    },
    {
      name: 'Mango Smoothie',
      description: 'Fresh mango, yogurt, honey blend',
      price: 3.49,
      imageUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400',
      category: 'Drinks',
    },
  ]);

  console.log('🍔  Menu items created...');

  // Create inventory for each menu item
  await Inventory.insertMany(
    menuItems.map((item) => ({
      menuItem: item._id,
      quantity: Math.floor(Math.random() * 90) + 20,
      threshold: 10,
    }))
  );

  console.log('📦  Inventory created...');

  // Create sample orders
  const order1 = await Order.create({
    user: student._id,
    items: [
      { menuItem: menuItems[0]._id, quantity: 2 },
      { menuItem: menuItems[2]._id, quantity: 1 },
    ],
    totalPrice: 12.47,
    status: 'completed',
  });

  const order2 = await Order.create({
    user: student._id,
    items: [{ menuItem: menuItems[1]._id, quantity: 1 }],
    totalPrice: 5.99,
    status: 'preparing',
  });

  const order3 = await Order.create({
    user: student._id,
    items: [
      { menuItem: menuItems[3]._id, quantity: 1 },
      { menuItem: menuItems[5]._id, quantity: 2 },
    ],
    totalPrice: 13.97,
    status: 'pending',
  });

  console.log('📋  Orders created...');

  // Create feedback
  await Feedback.insertMany([
    { user: student._id, rating: 5, comment: 'Amazing burger! Will order again.' },
    { user: admin._id, rating: 4, comment: 'Great grain bowl, very fresh.' },
    { user: student._id, rating: 5, comment: 'Fast service and hot food. Love it!' },
  ]);

  console.log('⭐  Feedback created...');

  console.log('\n✅ Seed complete!');
  console.log('----------------------------');
  console.log('🔑 Admin login:   admin@foodbooth.edu  /  admin123');
  console.log('🎓 Student login: jdoe24@university.edu  /  student123');
  console.log('----------------------------\n');

  mongoose.disconnect();
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
