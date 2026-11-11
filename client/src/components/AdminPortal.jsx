// client/src/components/AdminPortal.jsx
// Minimalist, Clean Light-Themed Staff KDS & Management Portal (No emojis)
import React from 'react';
import {
  SearchIcon,
  CheckIcon,
  CloseIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  DownloadIcon,
  PrintIcon,
  ClockIcon,
  VegSymbol,
  NonVegSymbol,
  ArrowRightIcon,
} from './Icons';

export default function AdminPortal({
  orders = [],
  foodItems = [],
  onUpdateOrderStatus,
  onCancelOrder,
  onToggleStock,
  onAddDish,
  onUpdateDish,
  onDeleteDish,
  adminTab = 'kds',
  onTabChange,
}) {
  // Sync tab with parent or internal fallback
  const activeTab = adminTab || 'kds';
  const setActiveTab = onTabChange || (() => {});

  // KDS State
  const [filterCounter, setFilterCounter] = React.useState('all');
  const [orderSearch, setOrderSearch] = React.useState('');

  // Inventory State
  const [inventorySearch, setInventorySearch] = React.useState('');
  const [inventoryCounter, setInventoryCounter] = React.useState('all');
  const [inventoryStockFilter, setInventoryStockFilter] = React.useState('all');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = React.useState(false);
  const [editingDish, setEditingDish] = React.useState(null);

  // Sales State
  const [salesTimeframe, setSalesTimeframe] = React.useState('today');

  // Orders Log State
  const [logSearch, setLogSearch] = React.useState('');
  const [logStatusFilter, setLogStatusFilter] = React.useState('all');
  const [logCounterFilter, setLogCounterFilter] = React.useState('all');
  const [selectedOrderDetail, setSelectedOrderDetail] = React.useState(null);

  // Filtered KDS Orders
  const filteredKdsOrders = orders.filter((o) => {
    const matchCounter = filterCounter === 'all' || o.counter.includes(filterCounter);
    const matchSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.pin && o.pin.includes(orderSearch));
    return matchCounter && matchSearch;
  });

  const incoming = filteredKdsOrders.filter((o) => o.status === 'placed' || o.status === 'confirmed');
  const cooking = filteredKdsOrders.filter((o) => o.status === 'preparing');
  const ready = filteredKdsOrders.filter((o) => o.status === 'ready');
  const collected = orders.filter((o) => o.status === 'collected');

  // Calculations for Sales
  const completedOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = completedOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Counter Sales Breakdown
  const counterSales = {
    'Counter 1': { name: 'Counter 1 (Fast Food)', rev: 0, count: 0 },
    'Counter 2': { name: 'Counter 2 (South Indian & Meals)', rev: 0, count: 0 },
    'Counter 3': { name: 'Counter 3 (Bakery & Drinks)', rev: 0, count: 0 },
  };

  completedOrders.forEach((o) => {
    const key = Object.keys(counterSales).find((c) => o.counter && o.counter.includes(c));
    if (key) {
      counterSales[key].rev += o.total || 0;
      counterSales[key].count += 1;
    }
  });

  // Top Selling Dishes
  const dishSalesMap = {};
  completedOrders.forEach((o) => {
    (o.items || []).forEach((item) => {
      if (!dishSalesMap[item.name]) {
        dishSalesMap[item.name] = { name: item.name, quantity: 0, revenue: 0 };
      }
      dishSalesMap[item.name].quantity += item.quantity || 1;
      dishSalesMap[item.name].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });
  const topDishes = Object.values(dishSalesMap).sort((a, b) => b.quantity - a.quantity);

  // Filtered Inventory Dishes
  const filteredFoodItems = foodItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchCounter = inventoryCounter === 'all' || item.counter.includes(inventoryCounter);
    const matchStock =
      inventoryStockFilter === 'all'
        ? true
        : inventoryStockFilter === 'instock'
        ? item.inStock
        : !item.inStock;
    return matchSearch && matchCounter && matchStock;
  });

  // Filtered Orders for Audit Log
  const filteredAuditOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(logSearch.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(logSearch.toLowerCase())) ||
      (o.studentId && o.studentId.toLowerCase().includes(logSearch.toLowerCase())) ||
      (o.pin && o.pin.includes(logSearch));
    const matchStatus = logStatusFilter === 'all' || o.status === logStatusFilter;
    const matchCounter = logCounterFilter === 'all' || (o.counter && o.counter.includes(logCounterFilter));
    return matchSearch && matchStatus && matchCounter;
  });

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date/Time', 'Customer', 'Roll No', 'Counter', 'Items', 'Total (INR)', 'Payment', 'PIN', 'Status'];
    const rows = filteredAuditOrders.map((o) => [
      o.id,
      o.placedAt || 'Today',
      `"${o.customerName || 'Student'}"`,
      o.studentId || 'STU-2024',
      `"${o.counter}"`,
      `"${(o.items || []).map((i) => `${i.quantity}x ${i.name}`).join('; ')}"`,
      o.total,
      `"${o.paymentMethod || 'Campus Meal Card'}"`,
      o.pin,
      o.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FoodBooth_Orders_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 w-full animate-fade-in">
      {/* Subheader / Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
            Kitchen Staff & Administration Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kitchen & Counter Operations • Live preparation pipeline, menu controls & daily financial logs
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar shadow-2xs">
          {[
            { id: 'kds', label: 'Kitchen Queue', badge: incoming.length + cooking.length },
            { id: 'inventory', label: 'Stock & Menu' },
            { id: 'sales', label: 'Daily Sales & Analytics' },
            { id: 'all_orders', label: 'Orders Audit Log' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#ab3500] text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. KITCHEN KDS KANBAN */}
      {/* ========================================================= */}
      {activeTab === 'kds' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center space-x-2 text-xs overflow-x-auto no-scrollbar">
              <span className="font-bold text-slate-400 shrink-0">Filter Counter:</span>
              {['all', 'Counter 1', 'Counter 2', 'Counter 3'].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCounter(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    filterCounter === c
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c === 'all' ? 'All Counters' : c}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <span className="absolute left-2.5 top-2 text-slate-400">
                <SearchIcon className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search ticket # or PIN..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-400"
              />
            </div>
          </div>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Col 1: Incoming */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 shadow-2xs flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    New Incoming
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400">{incoming.length} tickets</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh] pr-0.5">
                {incoming.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">No new incoming orders</div>
                ) : (
                  incoming.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5 hover:border-slate-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-black text-xs text-slate-900 block">{ord.id}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{ord.counter}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                          {ord.placedAt || 'Just now'}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs py-1 border-y border-slate-200/60 font-medium text-slate-800">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="text-slate-400 text-[11px]">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>Pickup Slot: <strong className="text-slate-700">{ord.pickupSlot}</strong></span>
                        <span className="font-mono font-bold text-slate-700">PIN: {ord.pin}</span>
                      </div>

                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'preparing')}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <span>Start Cooking</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Col 2: Cooking */}
            <div className="bg-white rounded-2xl border border-amber-200 p-4 space-y-3 shadow-2xs flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Currently Cooking
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-600">{cooking.length} tickets</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh] pr-0.5">
                {cooking.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">No dishes currently on stove</div>
                ) : (
                  cooking.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-amber-50/50 rounded-xl p-3.5 border border-amber-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-black text-xs text-slate-900 block">{ord.id}</span>
                          <span className="text-[10px] text-amber-800 font-semibold">{ord.counter}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-900 flex items-center space-x-1">
                          <ClockIcon className="w-3 h-3 text-amber-800" />
                          <span>On Stove</span>
                        </span>
                      </div>

                      <div className="space-y-1 text-xs py-1 border-y border-amber-200/60 font-medium text-slate-800">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="text-slate-400 text-[11px]">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                        <span>Customer: <strong className="text-slate-700">{ord.customerName}</strong></span>
                        <span className="font-mono font-bold text-slate-700">PIN: {ord.pin}</span>
                      </div>

                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'ready')}
                        className="w-full py-2 bg-[#ab3500] hover:bg-[#8f2c00] text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <CheckIcon className="w-3.5 h-3.5" />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Col 3: Ready for Pickup */}
            <div className="bg-white rounded-2xl border border-emerald-200 p-4 space-y-3 shadow-2xs flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Ready at Counter
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600">{ready.length} waiting</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh] pr-0.5">
                {ready.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">No orders waiting at counter</div>
                ) : (
                  ready.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-emerald-50/40 rounded-xl p-3.5 border border-emerald-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-black text-xs text-slate-900 block">{ord.id}</span>
                          <span className="text-[10px] text-emerald-800 font-semibold">{ord.counter}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          PIN: {ord.pin}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs py-1 border-y border-emerald-200/60 font-bold text-slate-800">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="text-slate-400 text-[11px] font-normal">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => onUpdateOrderStatus(ord.id, 'collected')}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <CheckIcon className="w-3.5 h-3.5" />
                        <span>Confirm Student Handover</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. INVENTORY & STOCK MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Top Control Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="relative min-w-[200px]">
                <span className="absolute left-2.5 top-2.5 text-slate-400">
                  <SearchIcon className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search dish name..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-400"
                />
              </div>

              {/* Counter Filter */}
              <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {['all', 'Counter 1', 'Counter 2', 'Counter 3'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setInventoryCounter(c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      inventoryCounter === c
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {c === 'all' ? 'All Counters' : c}
                  </button>
                ))}
              </div>

              {/* Stock Filter */}
              <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'instock', label: 'In Stock' },
                  { id: 'soldout', label: 'Sold Out' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setInventoryStockFilter(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      inventoryStockFilter === s.id
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Add Dish */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setIsAddDishModalOpen(true)}
                className="bg-[#ab3500] hover:bg-[#8f2c00] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Add New Dish</span>
              </button>
            </div>
          </div>

          {/* Metrics Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Dishes</span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">{foodItems.length}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald-600">Available</span>
              <span className="text-lg font-black text-emerald-700 block mt-0.5">
                {foodItems.filter((f) => f.inStock).length}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-rose-500">Sold Out</span>
              <span className="text-lg font-black text-rose-600 block mt-0.5">
                {foodItems.filter((f) => !f.inStock).length}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Counters</span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">3 Counters</span>
            </div>
          </div>

          {/* Dishes Table / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFoodItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white p-4 rounded-2xl border transition-all duration-200 shadow-2xs flex flex-col justify-between space-y-3 ${
                  item.inStock ? 'border-slate-200/80 hover:border-slate-300' : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                      onError={(e) => {
                        e.target.src = '/burger.jpg';
                      }}
                    />
                    <div className="absolute -bottom-1 -left-1">
                      {item.isVeg ? <VegSymbol className="w-3.5 h-3.5" /> : <NonVegSymbol className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">{item.counter}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                        {item.prepTime}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 truncate mt-0.5">{item.name}</h4>
                    <span className="text-xs font-black text-slate-900 block mt-0.5">₹{item.price}</span>
                  </div>
                </div>

                {/* Card Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleStock(item.id)}
                    className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                      item.inStock
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200'
                    }`}
                  >
                    {item.inStock ? 'In Stock (Click to Sell Out)' : 'Sold Out (Click to Restock)'}
                  </button>

                  <button
                    onClick={() => setEditingDish(item)}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
                    title="Edit Dish"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                  </button>

                  {onDeleteDish && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${item.name}" from menu?`)) {
                          onDeleteDish(item.id);
                        }
                      }}
                      className="p-1.5 rounded-xl border border-rose-100 text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete Dish"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DAILY SALES & ANALYTICS */}
      {/* ========================================================= */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Timeframe Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
            <span className="text-xs font-bold text-slate-700">Financial Performance & Kitchen Throughput</span>
            <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
              {['today', 'yesterday', 'this_week'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSalesTimeframe(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition capitalize cursor-pointer ${
                    salesTimeframe === t
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Financial Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Total Revenue
              </span>
              <span className="text-2xl font-black text-slate-900 font-display mt-0.5 block">
                ₹{Math.round(totalRevenue)}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-1">
                <span>+14.8%</span>
                <span className="text-slate-400 font-normal">vs yesterday</span>
              </span>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Orders Fulfilled
              </span>
              <span className="text-2xl font-black text-slate-900 font-display mt-0.5 block">
                {completedOrders.length}
              </span>
              <span className="text-[11px] text-slate-500 font-medium mt-1">
                {ready.length + collected.length} picked up
              </span>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Average Ticket (AOV)
              </span>
              <span className="text-2xl font-black text-slate-900 font-display mt-0.5 block">
                ₹{Math.round(avgOrderValue)}
              </span>
              <span className="text-[11px] text-slate-400 font-medium mt-1">~1.8 items per tray</span>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Average Prep Time
              </span>
              <span className="text-2xl font-black text-emerald-700 font-display mt-0.5 block">
                6.8 min
              </span>
              <span className="text-[11px] text-emerald-600 font-medium mt-1">Express Service Target</span>
            </div>
          </div>

          {/* Breakdown Section: Counters + Hourly Rush */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Counter Revenue Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Counter Sales Performance
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">3 Active Counters</span>
              </div>

              <div className="space-y-4">
                {Object.entries(counterSales).map(([key, data]) => {
                  const percent = totalRevenue > 0 ? Math.round((data.rev / totalRevenue) * 100) : 0;
                  return (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">{data.name}</span>
                        <div className="space-x-2">
                          <span className="font-black text-slate-900">₹{Math.round(data.rev)}</span>
                          <span className="text-slate-400 text-[11px]">({percent}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-slate-900 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Peak Rush Hour Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Hourly Mess Rush Distribution
                </h3>
                <span className="text-[11px] text-emerald-600 font-semibold">Lunch Peak: 1:00 PM</span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { label: '8-10 AM', name: 'Breakfast', volume: '35%', count: 18 },
                  { label: '12-3 PM', name: 'Lunch Rush', volume: '88%', count: 42, active: true },
                  { label: '4-6 PM', name: 'Snacks/Tea', volume: '45%', count: 24 },
                  { label: '7-9 PM', name: 'Dinner', volume: '62%', count: 31 },
                ].map((slot) => (
                  <div
                    key={slot.label}
                    className={`p-3 rounded-xl border text-center flex flex-col justify-between h-28 ${
                      slot.active
                        ? 'border-[#ab3500] bg-rose-50/30'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">{slot.label}</span>
                      <span className="text-xs font-bold text-slate-800">{slot.name}</span>
                    </div>
                    <div>
                      <span className="text-base font-black text-slate-900 block">{slot.volume}</span>
                      <span className="text-[10px] text-slate-500">{slot.count} orders</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Selling Dishes Leaderboard */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Top Selling Dishes Today
              </h3>
              <span className="text-xs text-slate-400 font-medium">Ranked by volume</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Dish Name</th>
                    <th className="p-3">Units Sold</th>
                    <th className="p-3">Gross Revenue</th>
                    <th className="p-3">Share of Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {topDishes.slice(0, 5).map((dish, idx) => (
                    <tr key={dish.name} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-slate-400">#{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{dish.name}</td>
                      <td className="p-3 font-black text-slate-800">{dish.quantity} plates</td>
                      <td className="p-3 font-mono font-bold text-slate-900">₹{dish.revenue}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {completedOrders.length > 0 ? Math.round((dish.quantity / completedOrders.length) * 100) : 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. ORDERS AUDIT LOG */}
      {/* ========================================================= */}
      {activeTab === 'all_orders' && (
        <div className="space-y-4">
          {/* Control Bar: Search + Filters + Export CSV */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Search */}
              <div className="relative min-w-[220px]">
                <span className="absolute left-2.5 top-2.5 text-slate-400">
                  <SearchIcon className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Search ID, customer, PIN..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-slate-400"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {['all', 'placed', 'preparing', 'ready', 'collected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLogStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition capitalize cursor-pointer ${
                      logStatusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'all' ? 'All Status' : st}
                  </button>
                ))}
              </div>

              {/* Counter Filter */}
              <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {['all', 'Counter 1', 'Counter 2', 'Counter 3'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setLogCounterFilter(c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      logCounterFilter === c
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {c === 'all' ? 'All Counters' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0 shadow-2xs cursor-pointer"
            >
              <DownloadIcon className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          {/* Audit Log Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-mono text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Order Ticket</th>
                    <th className="p-3">Customer & ID</th>
                    <th className="p-3">Counter</th>
                    <th className="p-3">Slot</th>
                    <th className="p-3">Items Ordered</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">PIN</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredAuditOrders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-400 text-xs">
                        No orders match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <span className="font-mono font-bold text-slate-900 block">{o.id}</span>
                          <span className="text-[10px] text-slate-400">{o.placedAt || 'Today'}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-800 block">{o.customerName || 'Student'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{o.studentId || 'STU-2024'}</span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{o.counter}</td>
                        <td className="p-3 text-slate-500">{o.pickupSlot}</td>
                        <td className="p-3 max-w-[200px] truncate" title={o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}>
                          {o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="p-3 font-mono font-black text-slate-900">₹{o.total.toFixed(2)}</td>
                        <td className="p-3">
                          <span className="font-mono font-black text-[#ab3500] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                            {o.pin}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              o.status === 'collected'
                                ? 'bg-emerald-100 text-emerald-800'
                                : o.status === 'ready'
                                ? 'bg-amber-100 text-amber-900'
                                : o.status === 'preparing'
                                ? 'bg-blue-100 text-blue-800'
                                : o.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedOrderDetail(o)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white transition text-[11px] font-bold cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT DISH */}
      {/* ========================================================= */}
      {(isAddDishModalOpen || editingDish) && (
        <DishFormModal
          dish={editingDish}
          isOpen={isAddDishModalOpen || Boolean(editingDish)}
          onClose={() => {
            setIsAddDishModalOpen(false);
            setEditingDish(null);
          }}
          onSave={(dishData) => {
            if (editingDish) {
              onUpdateDish(editingDish.id, dishData);
            } else {
              onAddDish({
                id: `dish-${Date.now()}`,
                inStock: true,
                rating: 4.8,
                reviewsCount: 1,
                addons: [],
                ...dishData,
              });
            }
            setIsAddDishModalOpen(false);
            setEditingDish(null);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL: ORDER DETAILS & RECEIPT */}
      {/* ========================================================= */}
      {selectedOrderDetail && (
        <OrderDetailModal
          order={selectedOrderDetail}
          onClose={() => setSelectedOrderDetail(null)}
          onAdvanceStatus={onUpdateOrderStatus}
          onCancelOrder={onCancelOrder}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// SUBCOMPONENT: ADD / EDIT DISH MODAL
// ----------------------------------------------------------------------
function DishFormModal({ dish, isOpen, onClose, onSave }) {
  const [name, setName] = React.useState(dish ? dish.name : '');
  const [description, setDescription] = React.useState(dish ? dish.description : '');
  const [price, setPrice] = React.useState(dish ? dish.price : 99);
  const [category, setCategory] = React.useState(dish ? dish.category : 'Burgers & Pizzas');
  const [counter, setCounter] = React.useState(dish ? dish.counter : 'Counter 1 (Fast Food)');
  const [prepTime, setPrepTime] = React.useState(dish ? dish.prepTime : '10 mins');
  const [isVeg, setIsVeg] = React.useState(dish ? dish.isVeg : true);
  const [imageUrl, setImageUrl] = React.useState(dish ? dish.imageUrl : '/burger.jpg');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      counter,
      prepTime,
      isVeg,
      imageUrl,
    });
  };

  const presetImages = [
    { label: 'Burger', src: '/burger.jpg' },
    { label: 'Pizza', src: '/pizza.jpg' },
    { label: 'Dosa', src: '/dosa.jpg' },
    { label: 'Thali', src: '/thali.jpg' },
    { label: 'Noodles', src: '/noodles.jpg' },
    { label: 'Fries', src: '/fries.jpg' },
    { label: 'Samosa', src: '/samosa.jpg' },
    { label: 'Sandwich', src: '/sandwich.jpg' },
    { label: 'Coffee', src: '/coffee.jpg' },
    { label: 'Smoothie', src: '/smoothie.jpg' },
    { label: 'Salad', src: '/salad.jpg' },
    { label: 'Cake', src: '/cake.jpg' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-scale-up max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              {dish ? 'Edit Dish Details' : 'Add New Dish to Menu'}
            </h3>
            <p className="text-xs text-slate-500">
              Changes reflect immediately on the student ordering screen.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Dish Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Masala Dosa, Crispy Fries"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short wholesome description..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
            />
          </div>

          {/* Price & Prep Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹ INR)</label>
              <input
                type="number"
                min="10"
                step="5"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-400 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prep Time</label>
              <input
                type="text"
                required
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="e.g. 10 mins"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
              />
            </div>
          </div>

          {/* Category & Counter */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Mains & Thalis">Mains & Thalis</option>
                <option value="Burgers & Pizzas">Burgers & Pizzas</option>
                <option value="Chaat & Snacks">Chaat & Snacks</option>
                <option value="Healthy Bowls">Healthy Bowls</option>
                <option value="Beverages">Beverages</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Counter</label>
              <select
                value={counter}
                onChange={(e) => setCounter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
              >
                <option value="Counter 1 (Fast Food)">Counter 1 (Fast Food)</option>
                <option value="Counter 2 (South Indian & Meals)">Counter 2 (South Indian & Meals)</option>
                <option value="Counter 3 (Bakery & Drinks)">Counter 3 (Bakery & Drinks)</option>
              </select>
            </div>
          </div>

          {/* Diet: Veg or Non-Veg */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Classification</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="diet"
                  checked={isVeg === true}
                  onChange={() => setIsVeg(true)}
                  className="accent-emerald-600"
                />
                <VegSymbol className="w-4 h-4" />
                <span>Vegetarian</span>
              </label>
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="diet"
                  checked={isVeg === false}
                  onChange={() => setIsVeg(false)}
                  className="accent-rose-600"
                />
                <NonVegSymbol className="w-4 h-4" />
                <span>Non-Vegetarian</span>
              </label>
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Image Preset</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {presetImages.map((img) => (
                <div
                  key={img.src}
                  onClick={() => setImageUrl(img.src)}
                  className={`p-1 rounded-xl border cursor-pointer transition flex flex-col items-center space-y-1 ${
                    imageUrl === img.src
                      ? 'border-[#ab3500] bg-rose-50 ring-2 ring-[#ab3500]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img.src} alt={img.label} className="w-full h-10 rounded-lg object-cover" />
                  <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#ab3500] hover:bg-[#8f2c00] text-white shadow-md transition cursor-pointer"
            >
              {dish ? 'Save Changes' : 'Create Dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// SUBCOMPONENT: ORDER DETAILS & RECEIPT MODAL
// ----------------------------------------------------------------------
function OrderDetailModal({ order, onClose, onAdvanceStatus, onCancelOrder }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-scale-up max-h-[92vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img src="/logo.png" alt="FoodBooth Logo" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-mono font-black text-sm text-slate-900 block">{order.id}</span>
              <span className="text-xs text-slate-400">Order Audit Verification</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Key Details Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Customer:</span>
              <span className="font-bold text-slate-900">{order.customerName || 'Student'} ({order.studentId || 'STU-2024'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Counter Assigned:</span>
              <span className="font-bold text-slate-900">{order.counter}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Pickup Time Slot:</span>
              <span className="font-bold text-slate-900">{order.pickupSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Payment Mode:</span>
              <span className="font-bold text-slate-900">{order.paymentMethod || 'Campus Meal Card'}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
              <span className="text-slate-400 font-medium">Verification PIN:</span>
              <span className="font-mono font-black text-base text-[#ab3500] tracking-widest bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {order.pin}
              </span>
            </div>
          </div>

          {/* Itemized Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dishes & Addons</h4>
            <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{item.quantity}x {item.name}</span>
                    {item.addons && item.addons.length > 0 && (
                      <span className="block text-[11px] text-slate-400">
                        + {item.addons.map((a) => a.name).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Feedback Audit */}
          {order.rating && (
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-950 flex items-center space-x-1">
                  <span>⭐ Customer Feedback:</span>
                  <span className="text-amber-500 font-black">{'★'.repeat(order.rating)}</span>
                  <span>({order.rating}/5)</span>
                </span>
                {order.feedbackTags && (
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-full">
                    {order.feedbackTags}
                  </span>
                )}
              </div>
              {order.feedbackNotes && (
                <p className="text-[11px] text-slate-700 italic bg-white/80 p-2 rounded-xl border border-amber-100">
                  "{order.feedbackNotes}"
                </p>
              )}
            </div>
          )}

          {/* Total Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span>₹{(order.total * 0.95).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Govt GST (5%):</span>
              <span>₹{(order.total * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>Grand Total:</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <PrintIcon className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            {order.status !== 'collected' && order.status !== 'cancelled' && (
              <button
                onClick={() => {
                  onAdvanceStatus(order.id);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
              >
                <CheckIcon className="w-3.5 h-3.5" />
                <span>Advance Status</span>
              </button>
            )}

            {order.status !== 'collected' && order.status !== 'cancelled' && onCancelOrder && (
              <button
                onClick={() => {
                  if (confirm(`Cancel and refund order ${order.id}?`)) {
                    onCancelOrder(order.id, 'Staff Void');
                    onClose();
                  }
                }}
                className="px-3 py-2.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
