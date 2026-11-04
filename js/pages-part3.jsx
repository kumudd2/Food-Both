// Pages 13 to 18: Catering, Reviews & Suggestions, Profile, Login, Admin/KDS, Help & Hours

// 13. Bulk Catering & College Club Event Orders Page
function CateringScreen({ onNavigate }) {
  const [guestCount, setGuestCount] = React.useState(35);
  const [selectedPkg, setSelectedPkg] = React.useState('cat-1');
  const [eventDate, setEventDate] = React.useState('2026-11-15');
  const [venue, setVenue] = React.useState('Main Auditorium Foyer');

  const activePackage = window.CafeteriaData.cateringPackages.find(p => p.id === selectedPkg);
  const estimatedCost = activePackage ? activePackage.pricePerHead * guestCount : 0;

  const handleBookCatering = () => {
    window.SoundFX.play('success');
    alert(`Bulk catering request for ${guestCount} guests submitted to Campus Cafeteria Events Team! Quotation: ₹${estimatedCost}.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bulk Catering & Society Event Orders</h1>
        <p className="text-xs text-slate-500">Pre-order hot food packages for campus societies, hackathons, seminars and department fests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Package Selector */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">Select Catering Package</h3>
          <div className="space-y-3">
            {window.CafeteriaData.cateringPackages.map(pkg => {
              const isSelected = selectedPkg === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg.id)}
                  className={`bg-white rounded-2xl p-5 border-2 transition cursor-pointer space-y-2 ${
                    isSelected ? 'border-purple-600 shadow-md' : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{pkg.name}</h4>
                      <span className="text-[11px] text-purple-700 font-bold block mt-0.5">₹{pkg.pricePerHead} / person • Min {pkg.minGuests} guests</span>
                    </div>
                    <span className="text-xl">🍱</span>
                  </div>

                  <p className="text-slate-500 text-xs">Popular for: {pkg.popularFor}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pkg.items.map((it, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Headcount Calculator */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900">Event Quotation Calculator</h4>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                Guest Count: <strong className="text-slate-900 text-xs">{guestCount} people</strong>
              </label>
              <input
                type="range"
                min="15"
                max="200"
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Event Venue</label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="Main Auditorium Foyer">Main Auditorium Foyer</option>
                <option value="Computer Center / Labs">Computer Center / Labs</option>
                <option value="Hostel Common Room">Hostel Common Room</option>
                <option value="Seminar Hall Block C">Seminar Hall Block C</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Estimated Total:</span>
              <span className="text-xl font-black text-purple-700">₹{estimatedCost.toLocaleString()}</span>
            </div>

            <button
              onClick={handleBookCatering}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-600/30 transition"
            >
              Request Catering Coordinator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 14. Customer Reviews, Chef Specials & Suggestion Voting Box Page
function ReviewsScreen({ onNavigate }) {
  const [suggestions, setSuggestions] = React.useState(window.CafeteriaData.dishSuggestions);
  const [newDishName, setNewDishName] = React.useState('');

  const handleVote = (id) => {
    window.SoundFX.play('click');
    setSuggestions(suggestions.map(s => {
      if (s.id === id) {
        return {
          ...s,
          votes: s.userVoted ? s.votes - 1 : s.votes + 1,
          userVoted: !s.userVoted
        };
      }
      return s;
    }));
  };

  const handleSuggest = (e) => {
    e.preventDefault();
    if (!newDishName.trim()) return;
    window.SoundFX.play('add');
    const newSug = {
      id: 'sug-' + Date.now(),
      dishName: newDishName,
      proposer: 'Kumud N. (CSE)',
      votes: 1,
      userVoted: true
    };
    setSuggestions([newSug, ...suggestions]);
    setNewDishName('');
    alert('Your dish suggestion was submitted for student voting!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reviews & Student Dish Suggestion Box</h1>
        <p className="text-xs text-slate-500">Read verified student dining reviews and vote for special dishes you want cooked next Friday.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: Chef Suggestion Voting Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🗳️</span>
            <div>
              <h3 className="font-black text-base text-slate-900">Vote for Next Friday's Special</h3>
              <p className="text-[11px] text-slate-400">Top voted dish gets cooked by Chef at Counter 2!</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {suggestions.map(sug => (
              <div
                key={sug.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{sug.dishName}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">Suggested by {sug.proposer}</span>
                </div>
                <button
                  onClick={() => handleVote(sug.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center space-x-1.5 ${
                    sug.userVoted
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <span>▲</span>
                  <span>{sug.votes}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Submit new dish form */}
          <form onSubmit={handleSuggest} className="pt-2 border-t border-slate-100 flex items-center space-x-2">
            <input
              type="text"
              value={newDishName}
              onChange={(e) => setNewDishName(e.target.value)}
              placeholder="Suggest a dish (e.g. Garlic Naan)"
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-purple-700 transition"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Right Col: Verified Student Reviews */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">Verified Campus Reviews</h3>
          <div className="space-y-3">
            {window.CafeteriaData.communityReviews.map(rev => (
              <div key={rev.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img src={rev.avatar} alt={rev.studentName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{rev.studentName}</h4>
                      <span className="text-[10px] text-slate-400">{rev.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500 text-xs">
                    {'★'.repeat(Math.floor(rev.rating))}
                    <span className="ml-1 text-slate-700 font-bold">{rev.rating}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed italic">"{rev.comment}"</p>
                <div className="text-[10px] text-purple-600 font-bold">Ordered: {rev.dish}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 15. User Profile & Account Settings Page
function ProfileScreen({ user, onNavigate, onLogout }) {
  const profileLinks = [
    { label: 'My Saved Meal Cards & UPI', icon: '💳', sub: 'Linked STU-2024-8842 RFID' },
    { label: 'Dietary Preferences & Allergens', icon: '🥗', sub: 'Vegetarian • Lactose Alert' },
    { label: 'Order Notifications & SMS', icon: '🔔', sub: 'Instant SMS on Order Ready' },
    { label: 'Campus Dining Statements', icon: '📄', sub: 'Download Monthly Tax Invoice' },
    { label: 'Cafeteria Help Desk', icon: '❓', sub: 'Report counter delay or lost item' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Profile Card matching mobile reference image */}
      <div className="bg-purple-600 text-white rounded-3xl p-6 sm:p-8 text-center shadow-xl shadow-purple-600/20 space-y-3">
        <div className="relative inline-block">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-lg mx-auto"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
            }}
          />
          <span className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></span>
        </div>

        <div>
          <h2 className="text-xl font-black">{user.name}</h2>
          <p className="text-xs text-purple-200 mt-0.5">{user.role} • {user.department}</p>
          <span className="inline-block mt-2 text-xs font-mono bg-purple-700/60 px-3 py-1 rounded-full text-purple-100">
            Student Roll: {user.studentId}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 max-w-xs mx-auto text-xs">
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] opacity-75 block">Dining Wallet</span>
            <span className="font-black text-sm">₹{user.walletBalance.toFixed(2)}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] opacity-75 block">Reward Points</span>
            <span className="font-black text-sm">{user.rewardPoints} pts</span>
          </div>
        </div>
      </div>

      {/* Account Links */}
      <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 shadow-xs overflow-hidden">
        {profileLinks.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              window.SoundFX.play('click');
              alert(`Navigating to ${item.label}`);
            }}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
          >
            <div className="flex items-center space-x-3.5">
              <span className="text-xl">{item.icon}</span>
              <div>
                <span className="text-xs font-bold text-slate-800 block">{item.label}</span>
                <span className="text-[11px] text-slate-400 font-medium">{item.sub}</span>
              </div>
            </div>
            <window.Icons.ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          window.SoundFX.play('click');
          onLogout();
        }}
        className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-2xl border border-red-100 transition"
      >
        Logout from Campus Account
      </button>
    </div>
  );
}

// 16. Login, Registration & Student ID Authentication Page
function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = React.useState('kumud.negi@college.edu');
  const [password, setPassword] = React.useState('password123');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e, provider = 'credentials') => {
    if (e) e.preventDefault();
    window.SoundFX.play('success');
    setIsSubmitting(true);
    if (window.CafeteriaAPI && window.CafeteriaAPI.isOnline) {
      try {
        const res = await window.CafeteriaAPI.login(email, password, provider);
        if (res && res.success && res.user) {
          setIsSubmitting(false);
          onLoginSuccess(res.user);
          return;
        }
      } catch (err) {
        console.warn("Backend login error:", err);
      }
    }
    setIsSubmitting(false);
    onLoginSuccess();
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in py-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back! 👋</h2>
          <p className="text-xs text-slate-400">Login with College ID to order cafeteria meals</p>
        </div>

        {/* Cafeteria Tray Illustration matching reference */}
        <div className="flex justify-center">
          <window.Illustrations.LoginTrayIllustration className="w-44 h-32" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Email or Student Roll No</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <window.Icons.Profile className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kumud.negi@college.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-purple-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Password</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-purple-600 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <window.Icons.EyeOff className="w-4 h-4" /> : <window.Icons.Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-500 font-medium">
              <input type="checkbox" defaultChecked className="accent-purple-600 rounded" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset link sent to your college email!')}
              className="text-purple-600 font-bold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition"
          >
            Login to Cafeteria
          </button>
        </form>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
            or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={(e) => handleSubmit(e, 'google')}
            className="flex items-center justify-center py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <window.Illustrations.GoogleIcon />
            <span>Google</span>
          </button>
          <button
            onClick={(e) => handleSubmit(e, 'college_id')}
            className="flex items-center justify-center py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <window.Illustrations.CollegeIdIcon />
            <span>College ID</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 17. Admin & Kitchen Display System (KDS) Page
function AdminScreen({ onNavigate, orders, onUpdateStatus }) {
  const [kitchenOrders, setKitchenOrders] = React.useState(window.CafeteriaData.kitchenQueue);
  const [stats, setStats] = React.useState({
    today_orders: 128,
    today_orders_growth: '↑ 18% vs yesterday',
    today_revenue: '₹12,450',
    today_revenue_growth: '↑ 15% vs yesterday',
    pending_orders: 28,
    ready_for_pickup: 15
  });

  React.useEffect(() => {
    if (window.CafeteriaAPI && window.CafeteriaAPI.isOnline) {
      window.CafeteriaAPI.getAdminStats().then(res => {
        if (res) {
          setStats({
            today_orders: res.today_orders,
            today_orders_growth: res.today_orders_growth,
            today_revenue: `₹${res.today_revenue}`,
            today_revenue_growth: res.today_revenue_growth,
            pending_orders: res.pending_orders,
            ready_for_pickup: res.ready_for_pickup
          });
        }
      });
      window.CafeteriaAPI.getKitchenQueue().then(queue => {
        if (queue && queue.length) {
          setKitchenOrders(queue);
        }
      });
    }
  }, []);

  const handleAdvance = (orderId, nextStatus) => {
    window.SoundFX.play('click');
    setKitchenOrders(kitchenOrders.map(o => (o.id === orderId || o.order_id === orderId) ? { ...o, status: nextStatus } : o));
    onUpdateStatus(orderId, nextStatus);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Stats matching the reference image */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>👨‍🍳 Kitchen Display System & Admin Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500">Live order queue management, kitchen prep timers, and counter pickup control.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
          Kitchen Live Status: Active
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", val: stats.today_orders, growth: stats.today_orders_growth, color: 'text-slate-900' },
          { label: "Today's Revenue", val: stats.today_revenue, growth: stats.today_revenue_growth, color: 'text-purple-700' },
          { label: "Pending in Kitchen", val: stats.pending_orders, growth: 'Avg wait: 7.2 mins', color: 'text-amber-600' },
          { label: "Ready for Pickup", val: stats.ready_for_pickup, growth: 'At Counter 1, 2 & 3', color: 'text-emerald-600' }
        ].map(st => (
          <div key={st.label} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{st.label}</span>
            <div className={`text-2xl font-black ${st.color}`}>{st.val}</div>
            <span className="text-[10px] text-emerald-600 font-bold block">{st.growth}</span>
          </div>
        ))}
      </div>

      {/* Kitchen Kanban Order Board */}
      <div className="space-y-3">
        <h3 className="font-black text-sm text-slate-900">Live Kitchen Prep Queue</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* New Orders */}
          <div className="bg-slate-100 rounded-3xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs font-extrabold text-slate-700 px-1">
              <span>🆕 New Orders</span>
              <span className="bg-slate-200 px-2 py-0.5 rounded-full text-[10px]">
                {kitchenOrders.filter(o => o.status === 'new').length}
              </span>
            </div>
            <div className="space-y-2.5">
              {kitchenOrders.filter(o => o.status === 'new').map(ord => (
                <div key={ord.id} className="bg-white rounded-2xl p-4 shadow-xs space-y-2 border border-slate-200">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-xs text-slate-900">{ord.id}</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">{ord.slot}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">{ord.customer}</p>
                  <p className="text-[11px] text-slate-500">{ord.items}</p>
                  <button
                    onClick={() => handleAdvance(ord.id, 'cooking')}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    Start Cooking
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking in Kitchen */}
          <div className="bg-amber-50/60 rounded-3xl p-4 space-y-3 border border-amber-100">
            <div className="flex justify-between items-center text-xs font-extrabold text-amber-900 px-1">
              <span>🍳 Cooking in Kitchen</span>
              <span className="bg-amber-200 px-2 py-0.5 rounded-full text-[10px]">
                {kitchenOrders.filter(o => o.status === 'cooking').length}
              </span>
            </div>
            <div className="space-y-2.5">
              {kitchenOrders.filter(o => o.status === 'cooking').map(ord => (
                <div key={ord.id} className="bg-white rounded-2xl p-4 shadow-xs space-y-2 border border-amber-200">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-xs text-slate-900">{ord.id}</span>
                    <span className="text-[10px] text-amber-600 font-bold">{ord.elapsed} cooking</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">{ord.customer}</p>
                  <p className="text-[11px] text-slate-500">{ord.items}</p>
                  <button
                    onClick={() => handleAdvance(ord.id, 'ready')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    Mark Ready at Counter
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ready at Counter */}
          <div className="bg-emerald-50/60 rounded-3xl p-4 space-y-3 border border-emerald-100">
            <div className="flex justify-between items-center text-xs font-extrabold text-emerald-900 px-1">
              <span>🔔 Ready at Counter</span>
              <span className="bg-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                {kitchenOrders.filter(o => o.status === 'ready').length}
              </span>
            </div>
            <div className="space-y-2.5">
              {kitchenOrders.filter(o => o.status === 'ready').map(ord => (
                <div key={ord.id} className="bg-white rounded-2xl p-4 shadow-xs space-y-2 border border-emerald-200">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-xs text-slate-900">{ord.id}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">READY</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">{ord.customer}</p>
                  <p className="text-[11px] text-slate-500">{ord.items}</p>
                  <button
                    onClick={() => handleAdvance(ord.id, 'collected')}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition"
                  >
                    Scan QR & Handover
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 18. Help Center, Lost & Found & Cafeteria Timings Page
function HelpScreen({ onNavigate }) {
  const [openFaq, setOpenFaq] = React.useState(0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Help Center & Cafeteria Hours</h1>
        <p className="text-xs text-slate-500">Counter operating hours, lost & found assistance, and common questions.</p>
      </div>

      {/* Operating Timings */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900">Campus Counter Timings</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {window.CafeteriaData.counterSchedules.map((c, i) => (
            <div key={i} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-800">{c.counter}</span>
              <span className="font-mono text-purple-700 font-bold">{c.hours} ({c.days})</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {window.CafeteriaData.faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-3.5 bg-slate-50/50 flex justify-between items-center text-left text-xs font-bold text-slate-800"
              >
                <span>{faq.q}</span>
                <span>{openFaq === idx ? '▲' : '▼'}</span>
              </button>
              {openFaq === idx && (
                <div className="p-3.5 bg-white text-slate-600 text-xs leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Manager Ticket */}
      <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100 text-xs text-purple-900 space-y-2">
        <h4 className="font-black text-sm">Need Help with an Order or Lost Item?</h4>
        <p className="text-slate-600 leading-relaxed">
          Contact the Cafeteria Desk directly via student helpline: <strong>+91 11 2345 6789</strong> or email <strong>cafeteria@college.edu</strong>.
        </p>
      </div>
    </div>
  );
}
