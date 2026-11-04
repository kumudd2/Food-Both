// Pages 1 to 6: Home, Menu, Dish Detail, Cart, Checkout, Live Tracking

// 1. Home / Landing Page
function HomeScreen({ onNavigate, user, onAddToCart, cartItemsMap, onIncreaseQty, onDecreaseQty, onViewDetails, onCustomize }) {
  const popularDishes = window.CafeteriaData.foodItems.filter(i => i.isPopular);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-purple-500/20">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-purple-500/30 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-bold text-purple-200">
            <span>✨ Campus Pre-Order Dining Platform</span>
            <span>•</span>
            <span className="text-emerald-300 font-extrabold">Open Today till 11 PM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Pre-Order Your Food.<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-amber-300">
              Skip The Long Queues.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Order fresh breakfast, meal thalis, crunchy snacks and cold coffee directly from your lecture hall or hostel. Walk in and scan your QR token to collect your food instantly!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                window.SoundFX.play('click');
                onNavigate('menu');
              }}
              className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-600/40 active:scale-95 transition flex items-center space-x-2"
            >
              <span>Explore Food Menu</span>
              <window.Icons.ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                window.SoundFX.play('click');
                onNavigate('crowd-monitor');
              }}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 backdrop-blur-xs transition flex items-center space-x-2"
            >
              <span>Check Crowd & Tables</span>
              <span>👥</span>
            </button>
          </div>
        </div>

        {/* Decorative student illustration */}
        <div className="absolute right-2 -bottom-2 opacity-85 hidden md:block pointer-events-none">
          <window.Illustrations.SplashIllustration className="w-80 h-auto" />
        </div>
      </div>

      {/* Live Campus Cafeteria Real-Time Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Queue Wait', value: '6-8 mins', sub: 'Counter 1 & 2 Fast Track', icon: '⚡', color: 'text-amber-500' },
          { label: 'Active Kitchen Orders', value: '42 Orders', sub: 'Preparing in realtime', icon: '🍳', color: 'text-purple-600' },
          { label: 'Cafeteria Crowd', value: '58% Normal', sub: 'Tables available in Zone 3', icon: '👥', color: 'text-emerald-600' },
          { label: 'Student Wallet Deals', value: '5% Cashback', sub: 'On all campus food items', icon: '💳', color: 'text-blue-600' }
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shrink-0">
              {stat.icon}
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">{stat.label}</span>
              <span className={`text-lg font-black ${stat.color} block leading-tight`}>{stat.value}</span>
              <span className="text-[11px] text-slate-500 font-medium">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Browse By Category</h2>
            <p className="text-xs text-slate-500">Pick from our freshly prepared campus counters</p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <window.Icons.ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {window.CafeteriaData.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                window.SoundFX.play('click');
                onNavigate('menu', { category: cat.id });
              }}
              className="bg-white hover:bg-purple-50/50 p-4 rounded-2xl border border-slate-200/80 hover:border-purple-300 transition-all text-center group flex flex-col items-center justify-center space-y-1 shadow-2xs"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="font-bold text-xs text-slate-800 group-hover:text-purple-700 block truncate w-full">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Items Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <span>🔥 Popular Student Favorites</span>
            </h2>
            <p className="text-xs text-slate-500">Most ordered dishes this week with instant pre-order</p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-purple-600 hover:underline"
          >
            Explore Full Menu
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularDishes.slice(0, 4).map(item => (
            <FoodItemCard
              key={item.id}
              item={item}
              quantity={cartItemsMap[item.id] || 0}
              onAdd={onAddToCart}
              onIncrease={onIncreaseQty}
              onDecrease={onDecreaseQty}
              onViewDetails={onViewDetails}
              onCustomize={onCustomize}
            />
          ))}
        </div>
      </div>

      {/* How Pre-Order Works 4-Step Guide */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="text-center max-w-md mx-auto space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-purple-600">Zero Wait Time</span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">How Smart Cafeteria Works</h3>
          <p className="text-xs text-slate-500">4 simple steps to skip long lunch queues forever</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Pick Dishes & Customize', desc: 'Browse live menu with prices, calories & real preparation times.', icon: '📱' },
            { step: '02', title: 'Select Pickup Slot', desc: 'Choose Express 10-minute pickup or schedule around your lecture break.', icon: '⏰' },
            { step: '03', title: 'Pay with Campus Card', desc: 'Use linked Student RFID card, UPI or Campus Wallet with 5% cashback.', icon: '💳' },
            { step: '04', title: 'Scan QR & Grab Food', desc: 'Flash your digital QR token at the designated counter and enjoy dining!', icon: '✨' }
          ].map(s => (
            <div key={s.step} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2 relative">
              <span className="text-2xl font-black text-purple-200 absolute top-3 right-4">{s.step}</span>
              <span className="text-3xl block">{s.icon}</span>
              <h4 className="font-bold text-slate-900 text-sm">{s.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. Food Menu & Pre-Ordering Page
function MenuScreen({
  cartItemsMap,
  onAddToCart,
  onIncreaseQty,
  onDecreaseQty,
  onViewDetails,
  onCustomize,
  initialCategory = 'all'
}) {
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dietaryFilter, setDietaryFilter] = React.useState('all'); // 'all' | 'veg' | 'protein' | 'chef'
  const [sortBy, setSortBy] = React.useState('recommended');

  const filteredItems = window.CafeteriaData.foodItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet =
      dietaryFilter === 'all' ||
      (dietaryFilter === 'veg' && item.isVeg) ||
      (dietaryFilter === 'protein' && item.protein >= 12) ||
      (dietaryFilter === 'chef' && item.isChefSpecial);
    return matchesCat && matchesSearch && matchesDiet;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'calories') return a.calories - b.calories;
    return 0; // recommended
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Cafeteria Food Menu</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse all food items, check nutritional macros, and adjust quantities with live price calculation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[280px]">
          <span className="absolute left-3.5 top-3 text-slate-400">
            <window.Icons.Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search burgers, dosas, coffee..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter and Category Controls */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {window.CafeteriaData.categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  window.SoundFX.play('click');
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-2 shadow-2xs ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary filters (Dietary & Sort) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 text-xs">
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'veg', label: '🌱 Pure Veg' },
              { id: 'protein', label: '💪 High Protein (12g+)' },
              { id: 'chef', label: '⭐ Chef Specials' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => {
                  window.SoundFX.play('click');
                  setDietaryFilter(f.id);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  dietaryFilter === f.id
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-[11px] font-bold text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-purple-600"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="calories">Lowest Calories</option>
            </select>
          </div>
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-4xl mb-2">🍽️</p>
            <h3 className="text-base font-bold text-slate-800">No dishes match your criteria</h3>
            <p className="text-xs mt-1">Try resetting your filters or search for another food item.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setDietaryFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map(item => (
            <FoodItemCard
              key={item.id}
              item={item}
              quantity={cartItemsMap[item.id] || 0}
              onAdd={onAddToCart}
              onIncrease={onIncreaseQty}
              onDecrease={onDecreaseQty}
              onViewDetails={onViewDetails}
              onCustomize={onCustomize}
            />
          ))
        )}
      </div>
    </div>
  );
}

// 3. Dish Detail & Customization Page
function DishDetailScreen({ dish, onNavigate, onAddToCart, cartQuantity = 0, onIncreaseQty, onDecreaseQty }) {
  const [portion, setPortion] = React.useState('regular'); // 'regular' | 'large' | 'combo'
  const [selectedAddons, setSelectedAddons] = React.useState([]);
  const [cookingNote, setCookingNote] = React.useState('');

  if (!dish) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">No dish selected</p>
        <button onClick={() => onNavigate('menu')} className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs">
          Browse Menu
        </button>
      </div>
    );
  }

  // Portion multiplier
  const portionPriceAdd = portion === 'combo' ? 45 : portion === 'large' ? 25 : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const finalUnitPrice = dish.price + portionPriceAdd + addonsTotal;

  const toggleAddon = (addon) => {
    window.SoundFX.play('click');
    if (selectedAddons.some(a => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
        <button onClick={() => onNavigate('home')} className="hover:text-purple-600">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('menu')} className="hover:text-purple-600">Menu</button>
        <span>/</span>
        <span className="text-slate-700 font-bold">{dish.name}</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Column: Big Image & Badges */}
        <div className="relative bg-slate-100 aspect-square md:aspect-auto">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
            }}
          />
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
            <span>100% Vegetarian</span>
          </div>
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-xs text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center shadow-md">
            <window.Icons.Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1.5" />
            <span>{dish.rating} ({dish.reviews} ratings)</span>
          </div>
        </div>

        {/* Right Column: Dish Info, Portions, Addons & Cart */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                  {dish.counter}
                </span>
                <span className="text-xs text-slate-400 flex items-center">
                  <window.Icons.Clock className="w-3 h-3 mr-1" />
                  {dish.prepTime}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">{dish.name}</h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">{dish.description}</p>
            </div>

            {/* Nutrition facts breakdown */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Calories</span>
                <span className="text-sm font-black text-slate-800">{dish.calories} kcal</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Protein</span>
                <span className="text-sm font-black text-purple-700">{dish.protein}g</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Carbs</span>
                <span className="text-sm font-black text-slate-800">{dish.carbs}g</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Fats</span>
                <span className="text-sm font-black text-slate-800">{dish.fat}g</span>
              </div>
            </div>

            {/* Portion selection */}
            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2">Choose Portion Size:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'regular', label: 'Regular', extra: 'Base' },
                  { id: 'large', label: 'Large (1.5x)', extra: '+₹25' },
                  { id: 'combo', label: 'Meal Combo + Drink', extra: '+₹45' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPortion(p.id)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      portion === p.id
                        ? 'border-purple-600 bg-purple-50/60 text-purple-800 font-extrabold shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs block">{p.label}</span>
                    <span className="text-[10px] opacity-75">{p.extra}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional customizations/Addons */}
            {dish.customizations && dish.customizations.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">Optional Extra Add-Ons:</span>
                <div className="space-y-1.5">
                  {dish.customizations.map(addon => {
                    const isChecked = selectedAddons.some(a => a.name === addon.name);
                    return (
                      <label
                        key={addon.name}
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition ${
                          isChecked ? 'border-purple-600 bg-purple-50/40 text-purple-900 font-bold' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs">{addon.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-slate-700">+₹{addon.price}</span>
                          <input type="checkbox" checked={isChecked} onChange={() => {}} className="accent-purple-600" />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Total & Stepper */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Total Price</span>
              <span className="text-2xl font-black text-slate-900">₹{finalUnitPrice}</span>
            </div>

            <div className="flex items-center space-x-3">
              {cartQuantity > 0 ? (
                <QuantityControl
                  quantity={cartQuantity}
                  onIncrease={() => onIncreaseQty(dish.id)}
                  onDecrease={() => onDecreaseQty(dish.id)}
                  size="lg"
                />
              ) : (
                <button
                  onClick={() => {
                    window.SoundFX.play('add');
                    onAddToCart(dish.id);
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-purple-600/30 active:scale-95 transition flex items-center space-x-2"
                >
                  <window.Icons.Cart className="w-4 h-4" />
                  <span>Add To Tray</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. My Cart & Live Tray Page
function CartScreen({
  cartItems,
  onNavigate,
  onIncreaseQty,
  onDecreaseQty,
  onRemoveItem,
  onClearCart
}) {
  const [couponCode, setCouponCode] = React.useState('CAMPUS10');
  const [discountAmount, setDiscountAmount] = React.useState(10.00);
  const [staffTip, setStaffTip] = React.useState(0);
  const [ecoFriendly, setEcoFriendly] = React.useState(true);

  // Compute Bill Summary dynamically
  const subtotal = cartItems.reduce((acc, curr) => {
    const item = window.CafeteriaData.foodItems.find(f => f.id === curr.itemId);
    return acc + (item ? item.price * curr.quantity : 0);
  }, 0);
  const gst = subtotal * 0.05;
  const total = Math.max(0, subtotal + gst + staffTip - discountAmount);
  const totalCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleApplyCoupon = (code) => {
    if (code === 'CAMPUS10' || code === 'STUDENT50') {
      setCouponCode(code);
      setDiscountAmount(code === 'STUDENT50' ? 50 : 10);
      window.SoundFX.play('success');
      alert(`Coupon ${code} applied successfully!`);
    } else {
      alert('Invalid coupon code. Try CAMPUS10 or STUDENT50');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Cafeteria Cart</h1>
          <p className="text-xs text-slate-500">
            {totalCount} {totalCount === 1 ? 'item' : 'items'} in your pre-order tray
          </p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
          >
            Clear Tray
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-4">
          <span className="text-6xl block">🛒</span>
          <h3 className="text-lg font-black text-slate-800">Your cafeteria tray is empty</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pick delicious burgers, fresh dosas, cool smoothies or meals from the campus food menu.
          </p>
          <button
            onClick={() => onNavigate('menu')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-600/30 transition"
          >
            Browse Food Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items List (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map(cartItem => {
              const food = window.CafeteriaData.foodItems.find(f => f.id === cartItem.itemId);
              if (!food) return null;
              const itemTotal = food.price * cartItem.quantity;

              return (
                <div
                  key={food.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4 hover:border-purple-200 transition"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">{food.name}</h4>
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">{food.counter}</span>
                      <span className="text-xs font-black text-slate-900 mt-1 block">
                        ₹{food.price} <span className="text-slate-400 font-normal">× {cartItem.quantity} = ₹{itemTotal}</span>
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper: Customer can increase or decrease amount */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <QuantityControl
                      quantity={cartItem.quantity}
                      onIncrease={() => onIncreaseQty(food.id)}
                      onDecrease={() => onDecreaseQty(food.id)}
                      size="md"
                    />
                    <button
                      onClick={() => {
                        window.SoundFX.play('remove');
                        onRemoveItem(food.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                      title="Remove item"
                    >
                      <window.Icons.Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Eco-Friendly Cutlery Preference */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">🌱</span>
                <div>
                  <span className="font-bold text-slate-800 block">Eco-Friendly Campus Dining</span>
                  <span className="text-slate-500 text-[11px]">Don't include single-use plastic cutlery</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ecoFriendly}
                onChange={() => setEcoFriendly(!ecoFriendly)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Bill Summary & Checkout */}
          <div className="space-y-4">
            <BillSummaryCard
              subtotal={subtotal}
              gst={gst}
              total={total}
              discount={discountAmount}
              couponCode={couponCode}
              onApplyCoupon={handleApplyCoupon}
            />

            <button
              onClick={() => {
                window.SoundFX.play('click');
                onNavigate('checkout');
              }}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-600/30 active:scale-98 transition flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout & Billing</span>
              <window.Icons.ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('menu')}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-600 hover:text-purple-600"
            >
              + Add More Food Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. Checkout & Billing Page (Dedicated Bill Page as requested by user)
function CheckoutScreen({ cartItems, onNavigate, onOrderPlaced, user }) {
  const [selectedSlot, setSelectedSlot] = React.useState('12:15 PM');
  const [selectedCounter, setSelectedCounter] = React.useState('counter-1');
  const [instructions, setInstructions] = React.useState('No onions in burger, extra ketchup packets please');
  const [paymentMethod, setPaymentMethod] = React.useState('meal-card');

  const subtotal = cartItems.reduce((acc, curr) => {
    const item = window.CafeteriaData.foodItems.find(f => f.id === curr.itemId);
    return acc + (item ? item.price * curr.quantity : 0);
  }, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const handleConfirmOrder = () => {
    window.SoundFX.play('success');
    const newOrder = {
      id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pickupSlot: selectedSlot,
      counter: window.CafeteriaData.counters.find(c => c.id === selectedCounter)?.name || 'Counter 1',
      itemsCount: cartItems.reduce((acc, i) => acc + i.quantity, 0),
      items: cartItems.map(i => {
        const food = window.CafeteriaData.foodItems.find(f => f.id === i.itemId);
        return { name: food.name, qty: i.quantity, price: food.price };
      }),
      subtotal: subtotal,
      gst: gst,
      packaging: 0.00,
      discount: 0.00,
      total: total,
      status: 'placed',
      specialInstructions: instructions,
      paymentMethod: paymentMethod === 'meal-card' ? 'Campus Meal Card' : paymentMethod === 'upi' ? 'UPI / QR' : 'Cash at Counter',
      verificationPin: String(Math.floor(1000 + Math.random() * 9000)),
      timeline: [
        { title: 'Order Placed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true, current: true },
        { title: 'Order Accepted by Kitchen', time: 'Pending', done: false },
        { title: 'Cooking in Kitchen', time: 'Pending', done: false },
        { title: 'Ready at Counter', time: `Est. ${selectedSlot}`, done: false },
        { title: 'Collected by Student', time: 'Pending', done: false }
      ]
    };
    onOrderPlaced(newOrder);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Checkout & Final Bill</h1>
        <p className="text-xs text-slate-500">
          Review your pickup counter, time slot and bill summary before confirming your pre-order.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pickup Slot, Counter, Instructions & Payment */}
        <div className="md:col-span-2 space-y-5">
          {/* Pickup Slot Selection */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <span>⏰</span>
                <span>Select Pickup Time Slot</span>
              </h3>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                Today, 03 Nov 2026
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {window.CafeteriaData.pickupSlots.map(slot => {
                const isSelected = selectedSlot === slot.time;
                return (
                  <button
                    key={slot.id}
                    onClick={() => {
                      window.SoundFX.play('click');
                      setSelectedSlot(slot.time);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 text-purple-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Counter Selector */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <span>📍</span>
              <span>Designated Cafeteria Counter</span>
            </h3>
            <div className="space-y-2">
              {window.CafeteriaData.counters.map(c => {
                const isSelected = selectedCounter === c.id;
                return (
                  <label
                    key={c.id}
                    onClick={() => setSelectedCounter(c.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      isSelected ? 'border-purple-600 bg-purple-50/60' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{c.name}</span>
                      <span className="text-[11px] text-slate-400">{c.location} • Wait: {c.waitTime}</span>
                    </div>
                    <input
                      type="radio"
                      name="counter"
                      checked={isSelected}
                      onChange={() => setSelectedCounter(c.id)}
                      className="accent-purple-600"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Special Kitchen Instructions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900">Cooking Notes & Allergies (Optional)</h3>
            <textarea
              rows="2"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="E.g. No onions, less spicy, extra chutney..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white transition"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <span>💳</span>
              <span>Payment Option</span>
            </h3>
            <div className="space-y-2">
              {[
                { id: 'meal-card', label: `Student Meal Card (Balance: ₹${user.walletBalance})`, icon: '🎓', desc: 'Instant 1-click tap with 5% cashback' },
                { id: 'upi', label: 'Instant UPI / QR (PhonePe / GPay / Paytm)', icon: '⚡', desc: 'Scan code on phone' },
                { id: 'counter-cash', label: 'Pay Cash at Counter Pickup', icon: '💵', desc: 'Pay when picking up food' }
              ].map(m => (
                <label
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === m.id ? 'border-purple-600 bg-purple-50/60' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{m.label}</span>
                      <span className="text-[11px] text-slate-400">{m.desc}</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="accent-purple-600"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Bill Breakdown Card & Confirm Button */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Order Items Summary
            </h4>
            <div className="space-y-2 text-xs">
              {cartItems.map(item => {
                const food = window.CafeteriaData.foodItems.find(f => f.id === item.itemId);
                return (
                  <div key={item.itemId} className="flex justify-between">
                    <span className="text-slate-600">{food?.name} × {item.quantity}</span>
                    <span className="font-bold text-slate-800">₹{(food?.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Packing & Pickup Fee</span>
                <span>FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Payable</span>
                <span className="text-purple-700 text-base">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirmOrder}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-600/30 active:scale-98 transition flex items-center justify-center space-x-2"
          >
            <span>Confirm & Place Pre-Order</span>
            <span>🚀</span>
          </button>

          <p className="text-[11px] text-center text-slate-400">
            A digital pickup QR token will be generated on confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}

// 6. Live Order Tracking & Status Page
function OrderTrackingScreen({ order, onNavigate, onAdvanceStatus }) {
  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">No active order to track</p>
        <button onClick={() => onNavigate('home')} className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs">
          Return Home
        </button>
      </div>
    );
  }

  const steps = [
    { key: 'placed', title: 'Order Placed & Confirmed', time: '11:45 AM', desc: 'Pre-order recorded in kitchen queue' },
    { key: 'accepted', title: 'Accepted by Counter Chef', time: '11:46 AM', desc: 'Chef assigned ingredients' },
    { key: 'cooking', title: 'Cooking in Kitchen', time: '11:55 AM', desc: 'Being prepared fresh at Counter 1' },
    { key: 'ready', title: 'Ready at Pickup Counter', time: `Est. ${order.pickupSlot}`, desc: 'Packed and waiting under warmer' },
    { key: 'collected', title: 'Collected by Student', time: 'Pending', desc: 'QR code verified at counter' }
  ];

  const statusOrder = ['placed', 'accepted', 'preparing', 'ready', 'collected'];
  const currentIndex = statusOrder.indexOf(order.status === 'cooking' ? 'preparing' : order.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Order ID</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{order.id}</h2>
          <span className="text-xs text-slate-500">{order.date} • {order.counter}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              window.SoundFX.play('click');
              onNavigate('order-ready');
            }}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
          >
            <window.Icons.QrCode className="w-4 h-4" />
            <span>Show Pickup QR</span>
          </button>

          <button
            onClick={() => {
              window.SoundFX.play('click');
              onAdvanceStatus();
            }}
            className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl transition"
            title="Simulate chef advancing status"
          >
            ⚡ Simulate Kitchen Step
          </button>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="font-extrabold text-sm text-slate-900">Live Preparation Progress</h3>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="relative flex items-start space-x-4">
                <div
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-amber-500 text-white pulse-indicator'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <window.Icons.Check className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-extrabold ${isCurrent ? 'text-amber-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">{step.time}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Counter Instruction Alert Box */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-emerald-900 text-xs flex items-start space-x-3">
          <span className="text-xl">🔔</span>
          <div>
            <p className="font-bold">Your order is being cooked fresh at {order.counter}.</p>
            <p className="text-emerald-700 text-[11px] mt-0.5">
              Pickup slot: <strong>{order.pickupSlot}</strong>. You will receive an SMS and screen notification as soon as the chef marks it ready!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
