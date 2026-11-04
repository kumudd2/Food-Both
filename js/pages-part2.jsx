// Pages 7 to 12: Order Ready & QR, Order History, Campus Wallet, Meal Plans, Nutrition Tracker, Crowd Monitor

// 7. Order Ready! & Digital QR Pickup Token Page
function OrderReadyScreen({ order, onNavigate }) {
  const qrRef = React.useRef(null);

  React.useEffect(() => {
    // Burst celebratory confetti
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Dynamic QR generation
    if (qrRef.current && window.QRCode) {
      qrRef.current.innerHTML = '';
      new window.QRCode(qrRef.current, {
        text: `SMART-CAFETERIA|ID:${order ? order.id : 'ORD-10045'}|SLOT:${order ? order.pickupSlot : '12:15 PM'}|PIN:${order ? order.verificationPin : '4829'}|STATUS:READY`,
        width: 180,
        height: 180,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H
      });
    }
  }, [order]);

  const orderId = order ? order.id : 'ORD-10045';
  const pickupSlot = order ? order.pickupSlot : '12:15 PM';
  const counter = order ? order.counter : 'Counter 1 (Fast Food)';
  const pin = order ? order.verificationPin : '4829';

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in text-center pb-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg space-y-6">
        <div className="space-y-1">
          <div className="inline-block p-2 bg-emerald-100 text-emerald-700 rounded-2xl mb-2 font-black text-xl">
            🎉 Order Ready for Pickup!
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Show This QR Code At Counter</h2>
          <p className="text-xs text-slate-500">Walk directly to {counter} to collect your packed food.</p>
        </div>

        {/* Dynamic QR Code Card */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-3xl border-2 border-dashed border-purple-400 shadow-xl inline-block">
            <div ref={qrRef} className="flex justify-center items-center">
              <window.Icons.QrCode className="w-44 h-44 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Verification PIN & Counter Details */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Order ID</span>
            <span className="font-black text-slate-800">{orderId}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Pickup Slot</span>
            <span className="font-black text-purple-700">{pickupSlot}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Counter PIN</span>
            <span className="font-mono font-black text-emerald-600 tracking-widest text-sm">{pin}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              window.SoundFX.play('click');
              window.print();
            }}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2"
          >
            <span>🖨️ Print Cafeteria Receipt</span>
          </button>

          <button
            onClick={() => {
              window.SoundFX.play('click');
              onNavigate('tracking');
            }}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-600/30 transition"
          >
            Live Tracking View
          </button>
        </div>
      </div>
    </div>
  );
}

// 8. Order History & Quick Reorder Page
function OrderHistoryScreen({ orders, onNavigate, onReorder }) {
  const [filterTab, setFilterTab] = React.useState('all');

  const filteredOrders = orders.filter(o => {
    if (filterTab === 'ongoing') return o.status !== 'completed' && o.status !== 'cancelled';
    if (filterTab === 'completed') return o.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order History</h1>
          <p className="text-xs text-slate-500">Track current orders, review tax invoices, and reorder favorites in 1 click.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {['all', 'ongoing', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                window.SoundFX.play('click');
                setFilterTab(tab);
              }}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                filterTab === tab ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-4xl mb-2">📋</p>
          <p className="text-sm font-bold text-slate-800">No {filterTab} orders found</p>
          <button onClick={() => onNavigate('menu')} className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">
            Order Food Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(ord => (
            <div
              key={ord.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-purple-200 transition space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="font-black text-sm text-slate-900 mr-2">{ord.id}</span>
                  <span className="text-xs text-slate-400 font-medium">{ord.date} • {ord.counter}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    ord.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : ord.status === 'ready'
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {ord.status}
                </span>
              </div>

              {/* Items in order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-700 font-medium">{item.name} × {item.qty}</span>
                    <span className="font-bold text-slate-900">₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Order total & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Grand Total Paid</span>
                  <span className="text-lg font-black text-purple-700">₹{ord.total.toFixed(2)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {ord.status === 'completed' ? (
                    <button
                      onClick={() => {
                        window.SoundFX.play('add');
                        onReorder(ord);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1"
                    >
                      <span>Reorder Same Meal</span>
                      <span>🔄</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        window.SoundFX.play('click');
                        onNavigate('tracking');
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Track Order
                    </button>
                  )}
                  <button
                    onClick={() => {
                      window.SoundFX.play('click');
                      window.print();
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                  >
                    Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 9. Campus Digital Wallet & Meal Card Page
function CampusWalletScreen({ user, onRechargeWallet, onNavigate }) {
  const [rechargeAmount, setRechargeAmount] = React.useState(500);

  const handleRecharge = () => {
    window.SoundFX.play('success');
    onRechargeWallet(Number(rechargeAmount));
    alert(`₹${rechargeAmount} successfully added to Campus Dining Wallet!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Campus Digital Wallet & Meal Card</h1>
        <p className="text-xs text-slate-500">Tap-to-pay dining card with automatic 5% cashback on all campus counters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Smart RFID Card Visual */}
        <div className="md:col-span-1 space-y-4">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-purple-700 via-indigo-800 to-slate-900 text-white p-6 shadow-xl aspect-16/10 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 block">Campus Meal Card</span>
                <span className="text-xs font-mono opacity-80">{user.studentId}</span>
              </div>
              <span className="text-2xl">📡</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-300 uppercase block font-semibold">Available Balance</span>
              <span className="text-3xl font-black tracking-tight">₹{user.walletBalance.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-end text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-purple-300 block">Cardholder</span>
                <span className="font-bold">{user.name}</span>
              </div>
              <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded font-bold">RFID ACTIVE</span>
            </div>
          </div>

          {/* Quick Perks */}
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 text-xs text-purple-900 space-y-1.5">
            <span className="font-extrabold block">✨ Campus Dining Perks</span>
            <p className="text-[11px] text-purple-700 leading-relaxed">
              • 5% instant cashback on all orders<br />
              • Zero transaction fee<br />
              • 1-tap checkout at all campus food kiosks
            </p>
          </div>
        </div>

        {/* Right 2 Cols: Recharge & Ledger */}
        <div className="md:col-span-2 space-y-5">
          {/* Quick Recharge Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Recharge Campus Wallet</h3>

            <div className="grid grid-cols-4 gap-2">
              {[100, 250, 500, 1000].map(amt => (
                <button
                  key={amt}
                  onClick={() => {
                    window.SoundFX.play('click');
                    setRechargeAmount(amt);
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    rechargeAmount === amt
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                placeholder="Enter custom amount"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-600"
              />
              <button
                onClick={handleRecharge}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-600/30 transition"
              >
                Recharge via UPI
              </button>
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">Recent Dining Transactions</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {window.CafeteriaData.walletTransactions.map(tx => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">{tx.title}</span>
                    <span className="text-[11px] text-slate-400">{tx.date} • {tx.mode}</span>
                  </div>
                  <span
                    className={`font-black text-sm ${
                      tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. Weekly Meal Subscription & Meal Planner Page
function MealPlansScreen({ onNavigate }) {
  const [selectedPlan, setSelectedPlan] = React.useState('plan-2');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="text-center max-w-xl mx-auto space-y-1 pb-3">
        <span className="text-xs font-black uppercase tracking-wider text-purple-600">Save Up To 40%</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Weekly & Monthly Meal Passes</h1>
        <p className="text-xs text-slate-500">
          Automated daily pre-orders for hostellers and day scholars. Pick your food daily without carrying cash.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {window.CafeteriaData.mealPlans.map(plan => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`bg-white rounded-3xl p-6 border-2 transition cursor-pointer flex flex-col justify-between space-y-5 ${
                isSelected
                  ? 'border-purple-600 shadow-xl shadow-purple-600/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                  {plan.badge}
                </span>
                <h3 className="font-black text-lg text-slate-900">{plan.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{plan.description}</p>

                <div className="pt-2">
                  <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
                  <span className="text-xs text-slate-400"> / {plan.period}</span>
                  <span className="text-xs font-bold text-emerald-600 block mt-0.5">{plan.perMeal}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <span className="text-purple-600 font-bold">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.SoundFX.play('success');
                  alert(`Subscribed to ${plan.title}! Pass activated on your Student RFID Card STU-2024-8842.`);
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs transition ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 hover:bg-purple-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Choose {plan.title.split(' ')[0]} Pass
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 11. Nutrition, Macros & Calorie Diet Tracker Page
function NutritionScreen({ onNavigate }) {
  const stats = window.CafeteriaData.nutritionStats;
  const calPercent = Math.min(100, Math.round((stats.calorieConsumed / stats.calorieTarget) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nutrition & Macro Tracker</h1>
        <p className="text-xs text-slate-500">Live calorie counting and macronutrient breakdown for your campus dining orders.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calories Target</span>
          <span className="text-2xl font-black text-purple-700">{stats.calorieConsumed}</span>
          <span className="text-[11px] text-slate-500 font-semibold block">/ {stats.calorieTarget} kcal ({calPercent}%)</span>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: `${calPercent}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Protein</span>
          <span className="text-2xl font-black text-emerald-600">{stats.proteinConsumed}g</span>
          <span className="text-[11px] text-slate-500 font-semibold block">Target: {stats.proteinTarget}g</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Carbohydrates</span>
          <span className="text-2xl font-black text-amber-600">{stats.carbsConsumed}g</span>
          <span className="text-[11px] text-slate-500 font-semibold block">Target: {stats.carbsTarget}g</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Healthy Fats</span>
          <span className="text-2xl font-black text-indigo-600">{stats.fatConsumed}g</span>
          <span className="text-[11px] text-slate-500 font-semibold block">Target: {stats.fatTarget}g</span>
        </div>
      </div>

      {/* Today's Logged Dishes */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900">Food Items Logged Today</h3>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-purple-600 hover:underline"
          >
            + Add Healthy Dish
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {stats.todayLoggedDishes.map((dish, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <span className="font-bold text-slate-800">{dish.name}</span>
              <div className="flex items-center space-x-4 text-slate-500 font-medium">
                <span>🔥 {dish.cals} kcal</span>
                <span>💪 {dish.p}g P</span>
                <span>🌾 {dish.c}g C</span>
                <span>🥑 {dish.f}g F</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 12. Crowd Monitor & Table Availability Page
function CrowdMonitorScreen({ onNavigate }) {
  const [selectedZone, setSelectedZone] = React.useState('zone-1');
  const [reserveGuests, setReserveGuests] = React.useState(2);
  const [reserveTime, setReserveTime] = React.useState('12:30 PM');

  const handleBookTable = () => {
    window.SoundFX.play('success');
    alert(`Table for ${reserveGuests} reserved at ${reserveTime} in Main Cafeteria!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Live Cafeteria Crowd & Table Availability</h1>
        <p className="text-xs text-slate-500">Real-time occupancy sensors and table reservation for study groups & lunch breaks.</p>
      </div>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {window.CafeteriaData.cafeteriaZones.map(zone => (
          <div
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            className={`bg-white rounded-2xl p-5 border-2 transition cursor-pointer space-y-3 ${
              selectedZone === zone.id ? 'border-purple-600 shadow-md' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-extrabold text-sm text-slate-900">{zone.name}</h3>
              <span className={`w-2.5 h-2.5 rounded-full ${zone.color === 'emerald' ? 'bg-emerald-500' : zone.color === 'red' ? 'bg-red-500' : 'bg-amber-500'} animate-ping`}></span>
            </div>

            <div>
              <span className="text-2xl font-black text-slate-900">{zone.occupancy}%</span>
              <span className="text-xs text-slate-400 font-semibold block">Occupancy ({zone.status})</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <span>{zone.tablesAvailable} tables free</span>
              <span className="font-bold text-slate-700">Wait: {zone.avgWaitTime}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Reservation Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900">Reserve a Study Table / Lunch Booth</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Number of Seats</label>
            <select
              value={reserveGuests}
              onChange={(e) => setReserveGuests(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="1">1 Person (Quiet Booth)</option>
              <option value="2">2 Persons</option>
              <option value="4">4 Persons (Standard Table)</option>
              <option value="6">6 Persons (Study Group)</option>
              <option value="8">8 Persons (Club Discussion)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Arrival Time</label>
            <select
              value={reserveTime}
              onChange={(e) => setReserveTime(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option value="12:00 PM">12:00 PM</option>
              <option value="12:30 PM">12:30 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="01:30 PM">01:30 PM</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleBookTable}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-600/30 transition"
            >
              Reserve Table (Free)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
