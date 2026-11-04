// Comprehensive Data Store for Smart Cafeteria Web Platform
window.CafeteriaData = {
  // Categories
  categories: [
    { id: 'all', name: 'All Dishes', emoji: '🍱', description: 'Everything fresh from campus counters' },
    { id: 'breakfast', name: 'Breakfast', emoji: '🥞', description: 'Crispy dosas, idlis, sandwiches & poha' },
    { id: 'main-course', name: 'Main Course', emoji: '🍛', description: 'Royal thalis, rice bowls, pizzas & noodles' },
    { id: 'snacks', name: 'Snacks & Fast Food', emoji: '🍔', description: 'Burgers, loaded fries, samosas & wraps' },
    { id: 'healthy', name: 'Healthy & Diet', emoji: '🥗', description: 'Protein bowls, sprouts, fresh fruit salads' },
    { id: 'beverages', name: 'Beverages', emoji: '🥤', description: 'Cold coffees, mango smoothies, masala chai' },
    { id: 'desserts', name: 'Desserts & Bakery', emoji: '🍰', description: 'Fudge cakes, warm brownies & pastries' }
  ],

  // Comprehensive Food Items Catalog
  foodItems: [
    {
      id: 'item-1',
      name: 'Veg Burger',
      category: 'snacks',
      price: 65,
      rating: 4.6,
      reviews: 142,
      prepTime: '8-10 min',
      isPopular: true,
      isVeg: true,
      isChefSpecial: false,
      calories: 320,
      protein: 11,
      carbs: 42,
      fat: 12,
      allergens: ['Gluten', 'Dairy'],
      counter: 'Counter 1 (Fast Food)',
      image: 'assets/burger.jpg',
      description: 'Crispy golden potato & green peas patty layered with cheddar cheese, fresh iceberg lettuce, sliced tomatoes and signature house mayo in a toasted sesame bun.',
      customizations: [
        { name: 'Extra Cheddar Cheese Slice', price: 20 },
        { name: 'Double Veg Patty', price: 35 },
        { name: 'Jalapeno & Spicy Peri-Peri Mayo', price: 15 }
      ]
    },
    {
      id: 'item-2',
      name: 'Cold Coffee with Ice Cream',
      category: 'beverages',
      price: 60,
      rating: 4.5,
      reviews: 210,
      prepTime: '4-6 min',
      isPopular: true,
      isVeg: true,
      isChefSpecial: false,
      calories: 180,
      protein: 5,
      carbs: 26,
      fat: 6,
      allergens: ['Dairy'],
      counter: 'Counter 3 (Beverages & Juice)',
      image: 'assets/coffee.jpg',
      description: 'Frothy chilled espresso blended with pasteurized whole milk, a scoop of creamy vanilla bean ice cream and a swirl of dark Belgian chocolate fudge.',
      customizations: [
        { name: 'Extra Shot of Espresso', price: 15 },
        { name: 'Oat Milk Alternative', price: 25 },
        { name: 'Crushed Oreo Crumb Topping', price: 15 }
      ]
    },
    {
      id: 'item-3',
      name: 'French Fries',
      category: 'snacks',
      price: 70,
      rating: 4.5,
      reviews: 188,
      prepTime: '6-8 min',
      isPopular: true,
      isVeg: true,
      isChefSpecial: false,
      calories: 280,
      protein: 4,
      carbs: 38,
      fat: 13,
      allergens: [],
      counter: 'Counter 1 (Fast Food)',
      image: 'assets/fries.jpg',
      description: 'Thick hand-cut russet potato fries fried to golden perfection, seasoned with sea salt and served with tangy ketchup and garlic mayo dips.',
      customizations: [
        { name: 'Spicy Peri-Peri Seasoning', price: 10 },
        { name: 'Warm Liquid Cheese Dip', price: 25 },
        { name: 'Truffle Mayo Dip', price: 20 }
      ]
    },
    {
      id: 'item-4',
      name: 'Masala Dosa with Chutney',
      category: 'breakfast',
      price: 70,
      rating: 4.6,
      reviews: 320,
      prepTime: '10-12 min',
      isPopular: true,
      isVeg: true,
      isChefSpecial: true,
      calories: 260,
      protein: 7,
      carbs: 44,
      fat: 6,
      allergens: ['Mustard'],
      counter: 'Counter 2 (South Indian)',
      image: 'assets/dosa.jpg',
      description: 'Ultra-crispy fermented rice & lentil crepe stuffed with aromatic potato-onion tempered masala, served with piping hot sambar, fresh coconut chutney and tomato chutney.',
      customizations: [
        { name: 'Pure Desi Ghee Roast', price: 20 },
        { name: 'Extra Mysore Red Chutney Spread', price: 10 },
        { name: 'Extra Sambar Bowl', price: 15 }
      ]
    },
    {
      id: 'item-5',
      name: 'Grilled Paneer Sandwich',
      category: 'breakfast',
      price: 55,
      rating: 4.4,
      reviews: 95,
      prepTime: '6-8 min',
      isPopular: false,
      isVeg: true,
      isChefSpecial: false,
      calories: 240,
      protein: 12,
      carbs: 28,
      fat: 9,
      allergens: ['Dairy', 'Gluten'],
      counter: 'Counter 1 (Fast Food)',
      image: 'assets/sandwich.jpg',
      description: 'Whole wheat bread stuffed with fresh malai paneer cubes, chopped capsicum, sweet corn, zesty mint coriander chutney and grilled crisp.',
      customizations: [
        { name: 'Extra Mozzarella Cheese', price: 20 },
        { name: 'Brown Multigrain Bread', price: 10 }
      ]
    },
    {
      id: 'item-6',
      name: 'Farmhouse Veggie Pizza',
      category: 'main-course',
      price: 120,
      rating: 4.7,
      reviews: 164,
      prepTime: '12-15 min',
      isPopular: true,
      isVeg: true,
      isChefSpecial: true,
      calories: 450,
      protein: 16,
      carbs: 58,
      fat: 18,
      allergens: ['Dairy', 'Gluten'],
      counter: 'Counter 1 (Fast Food)',
      image: 'assets/pizza.jpg',
      description: 'Hand-stretched 8-inch artisan thin crust pizza topped with San Marzano marinara, 100% mozzarella, sweet corn, black olives, bell peppers, diced onions and oregano.',
      customizations: [
        { name: 'Cheese Burst Crust', price: 40 },
        { name: 'Paneer Tikka Topping', price: 30 },
        { name: 'Extra Jalapenos & Olives', price: 15 }
      ]
    },
    {
      id: 'item-7',
      name: 'Belgian Chocolate Fudge Cake',
      category: 'desserts',
      price: 60,
      rating: 4.8,
      reviews: 245,
      prepTime: '2-4 min',
      isPopular: false,
      isVeg: true,
      isChefSpecial: false,
      calories: 310,
      protein: 4,
      carbs: 45,
      fat: 13,
      allergens: ['Gluten', 'Dairy'],
      counter: 'Counter 3 (Beverages & Juice)',
      image: 'assets/cake.jpg',
      description: 'Moist dark chocolate sponge coated in rich Belgian chocolate ganache glaze and garnished with shaved dark chocolate curls.',
      customizations: [
        { name: 'Warm Chocolate Lava Center', price: 15 },
        { name: 'Vanilla Ice Cream Scoop', price: 20 }
      ]
    },
    {
      id: 'item-8',
      name: 'Veg Hakka Noodles',
      category: 'main-course',
      price: 80,
      rating: 4.6,
      reviews: 112,
      prepTime: '8-10 min',
      isPopular: false,
      isVeg: true,
      isChefSpecial: false,
      calories: 340,
      protein: 9,
      carbs: 52,
      fat: 11,
      allergens: ['Gluten', 'Soy'],
      counter: 'Counter 2 (Wok & Indian)',
      image: 'assets/noodles.jpg',
      description: 'Wok-tossed noodles with shredded cabbage, crunchy carrots, scallions, bell peppers, roasted garlic and dark soya Indo-Chinese seasoning.',
      customizations: [
        { name: 'Extra Veggies & Mushrooms', price: 20 },
        { name: 'Schezwan Style Spicy Sauce', price: 15 }
      ]
    },
    {
      id: 'item-9',
      name: 'Alphonso Mango Smoothie',
      category: 'beverages',
      price: 65,
      rating: 4.7,
      reviews: 84,
      prepTime: '4-5 min',
      isPopular: false,
      isVeg: true,
      isChefSpecial: false,
      calories: 190,
      protein: 6,
      carbs: 34,
      fat: 3,
      allergens: ['Dairy'],
      counter: 'Counter 3 (Beverages & Juice)',
      image: 'assets/smoothie.jpg',
      description: 'Fresh puree of Alphonso mangoes churned with low-fat Greek yogurt, organic raw honey and topped with chia seeds.',
      customizations: [
        { name: 'Add Whey Protein Scoop (24g)', price: 40 },
        { name: 'Almond Flakes & Pumpkin Seeds', price: 15 }
      ]
    },
    {
      id: 'item-10',
      name: 'Mediterranean Salad Bowl',
      category: 'healthy',
      price: 85,
      rating: 4.8,
      reviews: 98,
      prepTime: '5-7 min',
      isPopular: true,
      isVeg: true,
      isChefSpecial: true,
      calories: 210,
      protein: 14,
      carbs: 18,
      fat: 8,
      allergens: ['Dairy'],
      counter: 'Counter 2 (Salad & Diet)',
      image: 'assets/salad.jpg',
      description: 'Crisp romaine, cherry tomatoes, cucumbers, kalamata olives, marinated paneer cubes and herb vinaigrette dressing.',
      customizations: [
        { name: 'Boiled Chickpeas & Sprouts', price: 15 },
        { name: 'Avocado Slices', price: 30 }
      ]
    },
    {
      id: 'item-11',
      name: 'Crispy Samosa Chaat (2 Pcs)',
      category: 'snacks',
      price: 50,
      rating: 4.6,
      reviews: 230,
      prepTime: '4-6 min',
      isPopular: true,
      isVeg: true,
      isChefSpecial: false,
      calories: 290,
      protein: 6,
      carbs: 41,
      fat: 12,
      allergens: ['Gluten', 'Dairy'],
      counter: 'Counter 1 (Fast Food)',
      image: 'assets/samosa.jpg',
      description: 'Crushed flaky potato samosas layered with warm chole ragda, sweet tamarind chutney, spicy green mint sauce, chilled sweetened curd and crunchy sev.',
      customizations: [
        { name: 'Extra Sev & Pomegranate Seeds', price: 10 },
        { name: 'Extra Dahi (Curd)', price: 10 }
      ]
    },
    {
      id: 'item-12',
      name: 'Royal Campus Special Thali',
      category: 'main-course',
      price: 130,
      rating: 4.9,
      reviews: 410,
      prepTime: '8-10 min',
      isPopular: true,
      isVeg: true,
      isChefSpecial: true,
      calories: 580,
      protein: 22,
      carbs: 76,
      fat: 18,
      allergens: ['Dairy', 'Gluten'],
      counter: 'Counter 2 (Indian Meals)',
      image: 'assets/thali.jpg',
      description: 'Full wholesome meal including Paneer Butter Masala, Dal Makhani, Seasonal Dry Veggie, 3 Butter Phulkas, Fragrant Jeera Rice, Curd, Papad, Pickle & Gulab Jamun.',
      customizations: [
        { name: 'Upgrade to Butter Naan (2 pcs)', price: 20 },
        { name: 'Extra Gulab Jamun (1 pc)', price: 15 }
      ]
    }
  ],

  // Counters
  counters: [
    { id: 'counter-1', name: 'Counter 1 (Fast Food & Snacks)', location: 'Ground Floor, North Wing', waitTime: '6-8 min' },
    { id: 'counter-2', name: 'Counter 2 (Indian Meals & South Indian)', location: 'Ground Floor, Center', waitTime: '8-10 min' },
    { id: 'counter-3', name: 'Counter 3 (Beverages, Shakes & Desserts)', location: 'Ground Floor, East Wing', waitTime: '3-5 min' }
  ],

  // Pickup Slots
  pickupSlots: [
    { id: 'express', time: 'Express (~10 mins)', type: 'express' },
    { id: 'slot-1', time: '11:30 AM', type: 'scheduled' },
    { id: 'slot-2', time: '11:45 AM', type: 'scheduled' },
    { id: 'slot-3', time: '12:00 PM', type: 'scheduled' },
    { id: 'slot-4', time: '12:15 PM', type: 'scheduled' },
    { id: 'slot-5', time: '12:30 PM', type: 'scheduled' },
    { id: 'slot-6', time: '12:45 PM', type: 'scheduled' },
    { id: 'slot-7', time: '01:00 PM', type: 'scheduled' },
    { id: 'slot-8', time: '01:15 PM', type: 'scheduled' }
  ],

  // Default Cart matching the user's reference mockup!
  defaultCart: [
    { itemId: 'item-1', quantity: 1, selectedCustomizations: [] }, // Veg Burger @ 65
    { itemId: 'item-2', quantity: 1, selectedCustomizations: [] }, // Cold Coffee @ 60
    { itemId: 'item-3', quantity: 1, selectedCustomizations: [] }  // French Fries @ 70
    // Subtotal = 195, GST (5%) = 9.75, Total = 204.75!
  ],

  // Student Profile
  userProfile: {
    name: 'Kumud Negi',
    role: 'Student',
    department: 'CSE - 2nd Year',
    email: 'kumud.negi@college.edu',
    phone: '+91 98765 43210',
    studentId: 'STU-2024-8842',
    hostel: 'Block B - Room 304',
    avatar: 'assets/avatar.jpg',
    walletBalance: 480.00,
    rewardPoints: 1240,
    dietaryPreference: 'Vegetarian'
  },

  // Orders Store
  defaultOrders: [
    {
      id: 'ORD-10045',
      date: 'Today, 11:45 AM',
      pickupSlot: '12:15 PM',
      counter: 'Counter 1 (Fast Food)',
      itemsCount: 3,
      items: [
        { name: 'Veg Burger', qty: 1, price: 65 },
        { name: 'Cold Coffee with Ice Cream', qty: 1, price: 60 },
        { name: 'French Fries', qty: 1, price: 70 }
      ],
      subtotal: 195.00,
      gst: 9.75,
      packaging: 0.00,
      discount: 0.00,
      total: 204.75,
      status: 'preparing', // 'placed' | 'accepted' | 'preparing' | 'ready' | 'collected'
      specialInstructions: 'No onions in burger, extra ketchup packets please',
      paymentMethod: 'Campus Meal Card',
      verificationPin: '4829',
      timeline: [
        { title: 'Order Placed', time: '11:45 AM', done: true },
        { title: 'Order Accepted by Kitchen', time: '11:46 AM', done: true },
        { title: 'Cooking in Kitchen', time: '11:55 AM', done: true, current: true },
        { title: 'Ready at Counter 1', time: 'Est. 12:15 PM', done: false },
        { title: 'Collected by Student', time: 'Pending', done: false }
      ]
    },
    {
      id: 'ORD-10032',
      date: 'Yesterday, 12:30 PM',
      pickupSlot: '12:45 PM',
      counter: 'Counter 2 (South Indian)',
      itemsCount: 2,
      items: [
        { name: 'Masala Dosa with Chutney', qty: 1, price: 70 },
        { name: 'Cold Coffee with Ice Cream', qty: 1, price: 60 }
      ],
      subtotal: 130.00,
      gst: 6.50,
      packaging: 0.00,
      discount: 0.00,
      total: 136.50,
      status: 'completed',
      specialInstructions: 'Crispy dosa with extra sambar',
      paymentMethod: 'UPI / PhonePe',
      verificationPin: '9134',
      timeline: [
        { title: 'Order Placed', time: '12:30 PM', done: true },
        { title: 'Order Accepted', time: '12:31 PM', done: true },
        { title: 'Preparing', time: '12:35 PM', done: true },
        { title: 'Ready', time: '12:44 PM', done: true },
        { title: 'Collected', time: '12:46 PM', done: true }
      ]
    },
    {
      id: 'ORD-10028',
      date: '28 Oct 2026, 01:15 PM',
      pickupSlot: '01:30 PM',
      counter: 'Counter 2 (Indian Meals)',
      itemsCount: 1,
      items: [
        { name: 'Royal Campus Special Thali', qty: 1, price: 130 }
      ],
      subtotal: 130.00,
      gst: 6.50,
      packaging: 0.00,
      discount: 10.00,
      total: 126.50,
      status: 'completed',
      specialInstructions: 'Extra pickle',
      paymentMethod: 'Campus Meal Card',
      verificationPin: '2281',
      timeline: [
        { title: 'Order Placed', time: '01:15 PM', done: true },
        { title: 'Order Accepted', time: '01:16 PM', done: true },
        { title: 'Preparing', time: '01:20 PM', done: true },
        { title: 'Ready', time: '01:28 PM', done: true },
        { title: 'Collected', time: '01:31 PM', done: true }
      ]
    }
  ],

  // Notifications
  defaultNotifications: [
    {
      id: 'notif-1',
      title: 'Order ORD-10045 is now in kitchen (Cooking).',
      time: '3 mins ago',
      type: 'warning',
      orderId: 'ORD-10045',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Order ORD-10045 was Accepted by Counter 1.',
      time: '8 mins ago',
      type: 'success',
      orderId: 'ORD-10045',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Cashback of ₹10.25 credited to Campus Wallet.',
      time: '2 hours ago',
      type: 'info',
      read: true
    },
    {
      id: 'notif-4',
      title: 'Chef Special Pav Bhaji arriving this Friday! Vote now.',
      time: '1 day ago',
      type: 'purple',
      read: true
    }
  ],

  // Wallet Transactions
  walletTransactions: [
    { id: 'TXN-9021', date: 'Today, 11:45 AM', title: 'Food Order - ORD-10045', type: 'debit', amount: 204.75, status: 'Success', mode: 'Smart Cafeteria App' },
    { id: 'TXN-8840', date: '01 Nov 2026, 09:10 AM', title: 'Wallet Top-Up via UPI (GPay)', type: 'credit', amount: 500.00, status: 'Success', mode: 'UPI Gateway' },
    { id: 'TXN-8722', date: '31 Oct 2026, 12:30 PM', title: 'Food Order - ORD-10032', type: 'debit', amount: 136.50, status: 'Success', mode: 'Smart Cafeteria App' },
    { id: 'TXN-8651', date: '30 Oct 2026, 04:15 PM', title: 'Dining Reward Cashback (5%)', type: 'credit', amount: 18.25, status: 'Success', mode: 'Campus Rewards' },
    { id: 'TXN-8519', date: '28 Oct 2026, 01:15 PM', title: 'Food Order - ORD-10028', type: 'debit', amount: 126.50, status: 'Success', mode: 'Smart Cafeteria App' }
  ],

  // Meal Subscription Plans
  mealPlans: [
    {
      id: 'plan-1',
      title: 'Power Breakfast Pass',
      badge: 'Most Popular for Hostellers',
      price: 799,
      period: 'month',
      perMeal: '₹32 / meal',
      description: 'Daily hot breakfast + cup of tea or cold coffee delivered to counter without morning rush.',
      features: ['Choose from Dosa, Poha, Sandwich or Idli', 'Daily Morning Beverage Included', 'Skip peak 8:30-9:30 AM queue', 'Pause anytime on weekends']
    },
    {
      id: 'plan-2',
      title: 'Student Lunch Thali Pack',
      badge: 'Best Value Deal',
      price: 1499,
      period: 'month',
      perMeal: '₹60 / meal',
      description: 'Wholesome North/South Indian Lunch combos everyday for 25 college working days.',
      features: ['Royal Thali or Rice-Bowl Combo', 'Fresh Salad & Sweet Daily', 'Guaranteed hot food in 3 mins', 'Save up to 40% vs counter cash']
    },
    {
      id: 'plan-3',
      title: 'Athlete & High-Protein Diet Plan',
      badge: 'Gym & Sports Special',
      price: 1999,
      period: 'month',
      perMeal: '₹80 / meal',
      description: 'Formulated by college sports nutritionist for optimal energy and muscle recovery.',
      features: ['Daily Paneer/Tofu Bowls & Protein Smoothies', '35g+ Protein in every meal', 'Boiled Sprouts & Nut Mix snacks', 'Track macros automatically in app']
    }
  ],

  // Nutrition daily metrics
  nutritionStats: {
    calorieTarget: 2100,
    calorieConsumed: 1420,
    proteinTarget: 75,
    proteinConsumed: 54,
    carbsTarget: 250,
    carbsConsumed: 180,
    fatTarget: 60,
    fatConsumed: 42,
    waterLiters: 2.2,
    todayLoggedDishes: [
      { name: 'Veg Burger', cals: 320, p: 11, c: 42, f: 12 },
      { name: 'Cold Coffee', cals: 180, p: 5, c: 26, f: 6 },
      { name: 'French Fries', cals: 280, p: 4, c: 38, f: 13 },
      { name: 'Mediterranean Salad', cals: 210, p: 14, c: 18, f: 8 }
    ]
  },

  // Crowd Monitor Cafeteria Zones
  cafeteriaZones: [
    {
      id: 'zone-1',
      name: 'Main Dining Hall (Ground Floor)',
      status: 'Moderate Rush',
      occupancy: 62,
      tablesAvailable: 8,
      avgWaitTime: '6 mins',
      color: 'amber'
    },
    {
      id: 'zone-2',
      name: 'Express Kiosk & Coffee Bar (1st Floor)',
      status: 'High Peak Rush',
      occupancy: 88,
      tablesAvailable: 2,
      avgWaitTime: '12 mins',
      color: 'red'
    },
    {
      id: 'zone-3',
      name: 'Garden Terrace & Green Patio',
      status: 'Quiet & Calm',
      occupancy: 34,
      tablesAvailable: 16,
      avgWaitTime: '2 mins',
      color: 'emerald'
    }
  ],

  // Bulk Catering Packages
  cateringPackages: [
    {
      id: 'cat-1',
      name: 'Hackathon & Tech Fest Midnight Pack',
      minGuests: 25,
      pricePerHead: 140,
      items: ['Club Sandwiches', 'Crispy French Fries', 'Cold Coffee or Energy Soda', 'Chocolate Fudge Cake slice'],
      popularFor: 'Hackathons, Gaming Tournaments, Late Night Study Groups'
    },
    {
      id: 'cat-2',
      name: 'Seminar & Workshop High-Tea',
      minGuests: 15,
      pricePerHead: 95,
      items: ['Cocktail Samosas (2)', 'Paneer Cutlets', 'Assorted Cookies', 'Hot Masala Chai & Fresh Juice'],
      popularFor: 'Guest Lectures, Society Orientations, Faculty Meetings'
    },
    {
      id: 'cat-3',
      name: 'Grand Campus Event Buffet Dinner',
      minGuests: 50,
      pricePerHead: 220,
      items: ['Paneer Butter Masala', 'Dal Makhani', 'Jeera Pulao', 'Butter Naan / Roti', 'Green Salad', 'Raita', 'Gulab Jamun with Ice Cream'],
      popularFor: 'Farewells, College Cultural Fests, Alumni Meets'
    }
  ],

  // Community Reviews & Suggestion Box
  communityReviews: [
    {
      id: 'rev-1',
      studentName: 'Aarav Sharma',
      department: 'ECE, 3rd Year',
      dish: 'Veg Burger & Fries',
      rating: 5,
      date: '2 days ago',
      comment: 'The pre-order feature saved my life during the 15-minute exam break! Walked straight to Counter 1, scanned the QR, and got piping hot food without standing in the 40-person line.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
    },
    {
      id: 'rev-2',
      studentName: 'Rhea Sen',
      department: 'Biotechnology, 1st Year',
      dish: 'Masala Dosa with Chutney',
      rating: 5,
      date: '3 days ago',
      comment: 'Hands down the crispiest dosa in campus! Sambar is super authentic and the coconut chutney has that fresh curry leaf tadka.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      id: 'rev-3',
      studentName: 'Tanmay Verma',
      department: 'Mechanical Engg, 4th Year',
      dish: 'Cold Coffee with Ice Cream',
      rating: 4.8,
      date: '5 days ago',
      comment: 'Super thick and chocolatey. Great energy boost before lab sessions.',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100'
    }
  ],

  // Chef Dish Suggestions Voting Box
  dishSuggestions: [
    { id: 'sug-1', dishName: 'Mumbai Pav Bhaji with Extra Butter', proposer: 'Vikram R. (CSE)', votes: 142, userVoted: false },
    { id: 'sug-2', dishName: 'Peri-Peri Crusted Crispy Corn Bowls', proposer: 'Sneha P. (MBA)', votes: 118, userVoted: true },
    { id: 'sug-3', dishName: 'Authentic South Indian Filter Coffee', proposer: 'Karthik N. (Civil)', votes: 97, userVoted: false },
    { id: 'sug-4', dishName: 'Warm Brownie Sizzler with Hot Fudge', proposer: 'Ananya S. (Design)', votes: 85, userVoted: false }
  ],

  // FAQs
  faqs: [
    {
      q: 'How does the Cafeteria Pre-Order system work?',
      a: 'Browse the menu, select your food, choose your convenient pickup time slot (or Express 10-minute pickup), and pay online or via Campus Meal Card. You will instantly receive a live Order ID and a digital QR Token. Simply walk up to your assigned counter at the scheduled time and collect your ready-packed food without waiting in lines!'
    },
    {
      q: 'Can I cancel or modify my pre-order after placing it?',
      a: 'Orders can be cancelled with a 100% instant refund to your Campus Digital Wallet within 3 minutes of placement before the kitchen begins cooking (indicated by the Live Status tracker).'
    },
    {
      q: 'How do I pay with my Student ID Card or Campus Wallet?',
      a: 'Your student roll number STU-2024-8842 is pre-linked to your Campus RFID wallet. You can recharge your wallet via UPI, NetBanking, or Debit Card at 0% fees, and use it with 1-click at checkout with an additional 5% dining cashback!'
    },
    {
      q: 'What if I am running late for my pickup time slot?',
      a: 'No worries! Your order is kept securely packed inside heat-retaining food warmers at the counter for up to 30 minutes past your scheduled slot. When you arrive, just scan your QR code.'
    }
  ],

  // Operating Schedules
  counterSchedules: [
    { counter: 'Counter 1 (Fast Food, Burgers & Chaat)', hours: '10:00 AM – 09:30 PM', days: 'Monday – Saturday' },
    { counter: 'Counter 2 (South Indian, Rice & Thali)', hours: '07:30 AM – 04:00 PM & 07:00 PM – 10:00 PM', days: 'All Days (Mon – Sun)' },
    { counter: 'Counter 3 (Beverages, Juices & Bakery)', hours: '08:00 AM – 11:00 PM', days: 'All Days (Mon – Sun)' }
  ],

  // Kitchen KDS Orders for Staff Dashboard
  kitchenQueue: [
    { id: 'ORD-10045', customer: 'Kumud Negi (CSE)', items: '1x Veg Burger, 1x Cold Coffee, 1x French Fries', slot: '12:15 PM', status: 'cooking', elapsed: '4 mins' },
    { id: 'ORD-10046', customer: 'Rahul Mehta (Mech)', items: '2x Masala Dosa, 1x Mango Smoothie', slot: '12:20 PM', status: 'new', elapsed: '1 min' },
    { id: 'ORD-10044', customer: 'Divya Iyer (MBA)', items: '1x Farmhouse Veggie Pizza', slot: '12:10 PM', status: 'ready', elapsed: '11 mins' },
    { id: 'ORD-10043', customer: 'Harsh Gupta (Civil)', items: '1x Royal Campus Special Thali', slot: '12:05 PM', status: 'ready', elapsed: '14 mins' }
  ]
};
