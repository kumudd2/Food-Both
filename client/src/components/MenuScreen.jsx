// client/src/components/MenuScreen.jsx
import React from 'react';
import { CATEGORIES } from '../data/mockData';
import {
  SearchIcon,
  ClockIcon,
  StarIcon,
  VegSymbol,
  NonVegSymbol,
  BagIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
} from './Icons';

export default function MenuScreen({
  foodItems,
  cartItems,
  onAddToCart,
  onIncreaseQty,
  onDecreaseQty,
  onOpenDishModal,
  onOpenCart,
}) {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [dietaryFilter, setDietaryFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState('popular');

  const cartQtyMap = React.useMemo(() => {
    const map = {};
    cartItems.forEach((i) => {
      map[i.id] = i.quantity;
    });
    return map;
  }, [cartItems]);

  const totalCartCount = React.useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  const totalCartAmount = React.useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  }, [cartItems]);

  const filteredItems = foodItems
    .filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.counter.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiet =
        dietaryFilter === 'all' ||
        (dietaryFilter === 'veg' && item.isVeg) ||
        (dietaryFilter === 'non_veg' && !item.isVeg) ||
        (dietaryFilter === 'vegan' && item.diet === 'vegan');
      return matchCategory && matchSearch && matchDiet;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'time') return parseInt(a.prepTime) - parseInt(b.prepTime);
      return b.isPopular ? 1 : -1;
    });

  return (
    <div className="space-y-6 pb-24 w-full">
      {/* Clean Top Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
            Explore FoodBooth Menu
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Counters 1, 2 & 3 • Freshly prepared on order
          </p>
        </div>

        {/* Minimal Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-2.5 text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food, thali, coffee..."
            className="w-full pl-9 pr-7 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#ab3500] transition shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Row: Clean Categories + Dietary + Sort (No Emojis!) */}
      <div className="space-y-3">
        {/* Category Clean Text Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dietary Filters with Standard Symbols & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs pt-1">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                dietaryFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Items
            </button>

            <button
              onClick={() => setDietaryFilter('veg')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                dietaryFilter === 'veg'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <VegSymbol className="w-3.5 h-3.5" />
              <span>Vegetarian</span>
            </button>

            <button
              onClick={() => setDietaryFilter('non_veg')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                dietaryFilter === 'non_veg'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <NonVegSymbol className="w-3.5 h-3.5" />
              <span>Non-Veg</span>
            </button>

            <button
              onClick={() => setDietaryFilter('vegan')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                dietaryFilter === 'vegan'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Vegan
            </button>
          </div>

          <div className="flex items-center justify-end shrink-0">
            <span className="text-[11px] font-bold text-slate-400 mr-2 sm:hidden">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-hidden"
            >
              <option value="popular">Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Food Cards Grid (1 to 6 columns) */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-xs text-slate-500">
          No dishes match your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 w-full">
          {filteredItems.map((item) => {
            const qty = cartQtyMap[item.id] || 0;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Container */}
                <div
                  className="relative h-44 overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => onOpenDishModal(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/burger.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Top Badges: Standard Veg/Non-Veg Symbol + Prep Time Icon */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    {item.isVeg ? (
                      <VegSymbol className="w-4 h-4 shadow-2xs" />
                    ) : (
                      <NonVegSymbol className="w-4 h-4 shadow-2xs" />
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs flex items-center space-x-1">
                      <ClockIcon className="w-3 h-3 text-slate-300" />
                      <span>{item.prepTime}</span>
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-white/95 text-slate-800 shadow-2xs flex items-center space-x-1">
                      <StarIcon className="w-3 h-3 text-amber-500" />
                      <span>{item.rating}</span>
                    </span>
                  </div>

                  {/* Counter Location */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white text-[10px] font-semibold truncate">
                    {item.counter}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      className="font-bold text-sm text-slate-900 hover:text-[#ab3500] cursor-pointer transition truncate"
                      onClick={() => onOpenDishModal(item)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Stepper Controller */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-slate-900">₹{item.price}</span>
                      {item.calories ? (
                        <span className="text-[10px] text-slate-400 font-medium ml-1">
                          · {item.calories} kcal
                        </span>
                      ) : null}
                    </div>

                    {!item.inStock ? (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 text-xs font-bold">
                        Sold Out
                      </span>
                    ) : qty === 0 ? (
                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-3.5 py-1.5 bg-[#ab3500] hover:bg-[#8f2c00] active:scale-95 text-white text-xs font-bold rounded-xl shadow-2xs transition"
                      >
                        + Add
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1.5 bg-rose-50 border border-rose-200 rounded-xl p-0.5">
                        <button
                          onClick={() => onDecreaseQty(item.id)}
                          className="w-6 h-6 rounded-lg bg-white text-[#ab3500] font-black text-xs flex items-center justify-center hover:bg-rose-100"
                        >
                          <MinusIcon className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-black text-xs text-[#ab3500] px-1 min-w-4 text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => onIncreaseQty(item.id)}
                          className="w-6 h-6 rounded-lg bg-[#ab3500] text-white font-black text-xs flex items-center justify-center hover:bg-[#8f2c00]"
                        >
                          <PlusIcon className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
