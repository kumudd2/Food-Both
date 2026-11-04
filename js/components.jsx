// Common UI Icons and Reusable Components
window.Icons = {
  Back: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Cart: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Home: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  MenuBook: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Orders: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Profile: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Bell: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Trash: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Star: ({ className = "w-4 h-4 text-amber-500 fill-amber-500" }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  ),
  Plus: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Minus: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Eye: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
    </svg>
  ),
  ChevronRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  QrCode: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Fire: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  Wallet: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
};

// Interactive Quantity Stepper [-] count [+]
function QuantityControl({ quantity = 0, onIncrease, onDecrease, compact = false, size = "md" }) {
  if (compact) {
    return (
      <div className="flex items-center bg-slate-100 border border-slate-200/90 rounded-lg p-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.SoundFX.play('click');
            onDecrease();
          }}
          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white hover:text-purple-600 rounded transition active:scale-95"
          aria-label="Decrease quantity"
        >
          <window.Icons.Minus className="w-3 h-3" />
        </button>
        <span className="px-2 text-xs font-bold text-slate-800 min-w-[20px] text-center select-none">
          {quantity}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.SoundFX.play('add');
            onIncrease();
          }}
          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white hover:text-purple-600 rounded transition active:scale-95"
          aria-label="Increase quantity"
        >
          <window.Icons.Plus className="w-3 h-3" />
        </button>
      </div>
    );
  }

  const isLg = size === "lg";

  return (
    <div className={`flex items-center bg-purple-50 border border-purple-200/80 rounded-xl ${isLg ? 'p-1.5' : 'p-1'} shadow-xs`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.SoundFX.play('click');
          onDecrease();
        }}
        className={`${isLg ? 'w-8 h-8' : 'w-7 h-7'} flex items-center justify-center bg-white text-purple-700 hover:bg-purple-100 rounded-lg shadow-xs active:scale-90 transition font-bold`}
        aria-label="Decrease quantity"
      >
        <window.Icons.Minus className={`${isLg ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} />
      </button>
      <span className={`${isLg ? 'px-4 text-base' : 'px-3 text-sm'} font-extrabold text-purple-900 min-w-[28px] text-center select-none`}>
        {quantity}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.SoundFX.play('add');
          onIncrease();
        }}
        className={`${isLg ? 'w-8 h-8' : 'w-7 h-7'} flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700 rounded-lg shadow-xs active:scale-90 transition font-bold`}
        aria-label="Increase quantity"
      >
        <window.Icons.Plus className={`${isLg ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} />
      </button>
    </div>
  );
}

// Food Card Component used in Menu, Home, and Recommendations
function FoodItemCard({
  item,
  quantity = 0,
  onAdd,
  onIncrease,
  onDecrease,
  onViewDetails,
  onCustomize
}) {
  return (
    <div
      onClick={() => onViewDetails(item)}
      className="bg-white rounded-2xl p-3.5 border border-slate-200/80 hover:border-purple-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Food Thumbnail with badges */}
        <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-100 aspect-4/3 flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
            }}
          />
          {/* Veg badge */}
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
            <span className="text-[10px] font-bold text-slate-700">Veg</span>
          </div>

          {/* Chef Special Badge */}
          {item.isChefSpecial && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
              <span>Chef's Choice</span>
            </div>
          )}

          {/* Rating */}
          <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md flex items-center text-xs font-bold shadow-xs">
            <window.Icons.Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
            <span>{item.rating}</span>
            <span className="text-[10px] opacity-75 ml-1 font-normal">({item.reviews})</span>
          </div>

          {/* Prep time */}
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center">
            <window.Icons.Clock className="w-2.5 h-2.5 mr-1 text-slate-500" />
            <span>{item.prepTime}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors line-clamp-1">
              {item.name}
            </h4>
          </div>
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Nutritional Pill */}
        <div className="flex items-center space-x-2 text-[10px] font-semibold text-slate-400 mt-2">
          <span>🔥 {item.calories} kcal</span>
          <span>•</span>
          <span>💪 {item.protein}g protein</span>
        </div>
      </div>

      {/* Footer: Price & Add / Stepper */}
      <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-400 block leading-tight font-medium">Price</span>
          <span className="text-lg font-black text-slate-900 tracking-tight">₹{item.price}</span>
        </div>

        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          {quantity > 0 ? (
            <QuantityControl
              quantity={quantity}
              onIncrease={() => onIncrease(item.id)}
              onDecrease={() => onDecrease(item.id)}
              compact={false}
            />
          ) : (
            <div className="flex items-center space-x-1.5">
              {item.customizations && item.customizations.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.SoundFX.play('click');
                    onCustomize(item);
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition"
                  title="Customize dish"
                >
                  Custom
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(item.id);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 active:scale-95 transition flex items-center space-x-1"
              >
                <span>Add</span>
                <window.Icons.Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Bill Summary Card Component
function BillSummaryCard({
  subtotal,
  gst,
  total,
  packaging = 0,
  discount = 0,
  couponCode = "",
  onApplyCoupon
}) {
  const [inputCode, setInputCode] = React.useState('');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
          <span>🧾</span>
          <span>Bill & Tax Invoice Breakdown</span>
        </h4>
        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          GST 5% Inclusive
        </span>
      </div>

      {/* Coupon promo code input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          placeholder="Promo code (e.g. CAMPUS10)"
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-600 focus:bg-white transition"
        />
        <button
          onClick={() => {
            window.SoundFX.play('click');
            if (onApplyCoupon) onApplyCoupon(inputCode);
          }}
          className="px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs rounded-xl transition"
        >
          Apply
        </button>
      </div>

      {couponCode && (
        <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <span>Coupon {couponCode} applied!</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
      )}

      {/* Price breakdown */}
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal Amount</span>
          <span className="font-bold text-slate-800">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>GST Tax (5%)</span>
          <span className="font-bold text-slate-800">₹{gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Counter Packing & Cutlery</span>
          <span className="font-bold text-emerald-600">FREE</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Special Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Grand Total</span>
            <span className="text-xl font-black text-purple-700">₹{total.toFixed(2)}</span>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <span>Includes all campus taxes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Global Header Navigation Bar
function HeaderNavbar({
  currentScreen,
  onNavigate,
  cartCount,
  cartTotal,
  user,
  soundEnabled,
  onToggleSound,
  onToggleSidebar,
  activeOrder,
  isBackendConnected = false,
  onRetryConnect = () => {}
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition lg:hidden"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
          >
            <div className="p-1 bg-purple-600 rounded-xl shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <window.Illustrations.ClocheLogo className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-base text-white tracking-tight">SMART CAFETERIA</span>
                <span className="hidden sm:inline-block bg-purple-500/20 text-purple-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-500/30">
                  Campus Dining
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Pre-order, skip queues & enjoy dining</p>
            </div>
          </div>
        </div>

        {/* Center: Quick Nav links & Database Connection Status */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-semibold">
          {/* Connection Status Pill */}
          {isBackendConnected ? (
            <div
              className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-[11px] font-bold"
              title="Full 3-tier active connection: React Frontend <-> Python Flask API <-> SQLite (cafeteria.db)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Backend & DB Connected</span>
            </div>
          ) : (
            <button
              onClick={onRetryConnect}
              className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 rounded-xl text-[11px] font-bold transition"
              title="Running in client-only offline mode. Click to connect to Flask API on http://127.0.0.1:5000"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Offline Mode (Click to Connect)</span>
            </button>
          )}

          {[
            { id: 'home', label: 'Home' },
            { id: 'menu', label: 'Food Menu' },
            { id: 'meal-plans', label: 'Meal Passes' },
            { id: 'wallet', label: 'Campus Wallet' },
            { id: 'crowd-monitor', label: 'Crowd Monitor' },
            { id: 'reviews', label: 'Chef Specials' }
          ].map(link => (
            <button
              key={link.id}
              onClick={() => {
                window.SoundFX.play('click');
                onNavigate(link.id);
              }}
              className={`px-3 py-1.5 rounded-xl transition ${
                currentScreen === link.id
                  ? 'bg-purple-600 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right: Sound, Live Order Pill, Cart Button, Profile */}
        <div className="flex items-center space-x-2.5">
          {/* Live Order Indicator (if active order exists) */}
          {activeOrder && activeOrder.status !== 'completed' && (
            <button
              onClick={() => {
                window.SoundFX.play('click');
                onNavigate('tracking');
              }}
              className="hidden lg:flex items-center space-x-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-500/30 transition animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{activeOrder.id}: {activeOrder.status.toUpperCase()}</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              window.SoundFX.play('click');
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition text-xs"
            title={soundEnabled ? "Mute tactile sounds" : "Enable tactile sounds"}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          {/* Kitchen KDS Switcher */}
          <button
            onClick={() => {
              window.SoundFX.play('click');
              onNavigate('admin');
            }}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition"
            title="Kitchen Display System"
          >
            <span>👨‍🍳</span>
            <span>Kitchen</span>
          </button>

          {/* Cart Pill with Price & Item Count */}
          <button
            onClick={() => {
              window.SoundFX.play('click');
              onNavigate('cart');
            }}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 active:scale-95 transition"
          >
            <div className="relative">
              <window.Icons.Cart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-black">₹{cartTotal.toFixed(2)}</span>
          </button>

          {/* Student Profile Avatar */}
          <div
            onClick={() => {
              window.SoundFX.play('click');
              onNavigate('profile');
            }}
            className="flex items-center space-x-2 pl-2 border-l border-slate-800 cursor-pointer group"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-purple-500 group-hover:border-white transition"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
              }}
            />
            <div className="hidden xl:block text-left">
              <span className="text-xs font-bold text-white block leading-tight">{user.name.split(' ')[0]}</span>
              <span className="text-[10px] text-purple-300 block leading-tight">₹{user.walletBalance.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Collapsible Sidebar with links for all 18 pages
function SidebarNav({ currentScreen, onNavigate, isOpen, onClose, cartCount, activeOrder }) {
  const sections = [
    {
      title: 'Main Dining',
      items: [
        { id: 'home', label: '1. Home / Landing', icon: '🏠' },
        { id: 'menu', label: '2. Food Menu & Ordering', icon: '🍽️', badge: '12 Dishes' },
        { id: 'dish-detail', label: '3. Dish Detail & Customizer', icon: '🔍' },
        { id: 'cart', label: '4. My Cart & Tray', icon: '🛒', badge: cartCount > 0 ? `${cartCount} items` : null },
        { id: 'checkout', label: '5. Checkout & Bill Summary', icon: '🧾' }
      ]
    },
    {
      title: 'Live Orders',
      items: [
        { id: 'tracking', label: '6. Live Order Tracker', icon: '⏳', badge: activeOrder ? 'Active' : null },
        { id: 'order-ready', label: '7. Digital QR Pickup Token', icon: '📲' },
        { id: 'orders-history', label: '8. Order History & Reorder', icon: '📜' }
      ]
    },
    {
      title: 'Campus Services',
      items: [
        { id: 'wallet', label: '9. Campus Digital Wallet', icon: '💳', badge: '₹480' },
        { id: 'meal-plans', label: '10. Weekly Meal Passes', icon: '📅', badge: 'Save 40%' },
        { id: 'nutrition', label: '11. Nutrition & Calorie Tracker', icon: '🥗' },
        { id: 'crowd-monitor', label: '12. Crowd Monitor & Tables', icon: '👥', badge: 'Live' },
        { id: 'catering', label: '13. Bulk Catering & Club Orders', icon: '🍱' },
        { id: 'reviews', label: '14. Reviews & Chef Specials', icon: '⭐' }
      ]
    },
    {
      title: 'Account & Management',
      items: [
        { id: 'profile', label: '15. User Profile & Settings', icon: '👤' },
        { id: 'login', label: '16. Login & Student SSO', icon: '🔐' },
        { id: 'admin', label: '17. Kitchen KDS & Admin', icon: '👨‍🍳', badge: 'Staff' },
        { id: 'help', label: '18. Help Center & Timings', icon: '❓' }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-slate-900 border-r border-slate-800 text-slate-300 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1 bg-purple-600 rounded-xl">
              <window.Illustrations.ClocheLogo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white tracking-wider uppercase">Smart Cafeteria</h2>
              <span className="text-[10px] text-purple-400">18 Connected Pages</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 dark-scrollbar">
          {sections.map(section => (
            <div key={section.title} className="space-y-1">
              <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                {section.title}
              </span>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        window.SoundFX.play('click');
                        onNavigate(item.id);
                        if (onClose) onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <span className="text-sm">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Ground Floor Cafeteria</span>
            <span className="text-emerald-400 font-bold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
              Open Now
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
