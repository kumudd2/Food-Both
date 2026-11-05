// client/src/components/OrderTrackerScreen.jsx
import React from 'react';
import { CheckIcon } from './Icons';

export default function OrderTrackerScreen({
  activeOrder,
  allOrders,
  onAdvanceOrderStatus,
  onReorder,
}) {
  const [selectedTab, setSelectedTab] = React.useState('active'); // 'active' | 'history'

  const stages = [
    { key: 'placed', label: 'Order Received', desc: 'Sent to mess kitchen display' },
    { key: 'confirmed', label: 'Accepted by Kitchen', desc: 'Chef reviewing ticket' },
    { key: 'preparing', label: 'Cooking & Assembling', desc: 'Freshly cooking your meal' },
    { key: 'ready', label: 'Ready at Counter', desc: 'Waiting in food warmer' },
    { key: 'collected', label: 'Collected / Complete', desc: 'Handover complete' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === activeOrder?.status);
  const activeIdx = currentStageIndex >= 0 ? currentStageIndex : 2;

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Switcher: Active Order vs Past History */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex space-x-1">
          <button
            onClick={() => setSelectedTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              selectedTab === 'active'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Active Order</span>
            {activeOrder && activeOrder.status !== 'collected' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              selectedTab === 'history'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Past Orders ({allOrders.length})</span>
          </button>
        </div>

        {activeOrder && (
          <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline mr-2">
            Ticket: {activeOrder.id}
          </span>
        )}
      </div>

      {selectedTab === 'active' ? (
        activeOrder ? (
          <div className="space-y-6">
            {/* Live Progress Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ab3500] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Live Pre-Order
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {activeOrder.id}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 font-display">
                    {activeOrder.status === 'ready'
                      ? 'Food is Ready for Pickup'
                      : activeOrder.status === 'collected'
                      ? 'Order Collected'
                      : 'Kitchen is Preparing Your Meal'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Counter: <strong className="text-slate-800">{activeOrder.counter}</strong> •{' '}
                    Pickup Slot: <strong className="text-slate-800">{activeOrder.pickupSlot}</strong>
                  </p>
                </div>

                {/* 4-Digit Pickup PIN */}
                <div className="bg-slate-900 text-white p-3.5 rounded-2xl text-center sm:text-right shrink-0 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Counter Pickup PIN
                  </span>
                  <span className="text-2xl font-black font-mono tracking-widest text-amber-400">
                    {activeOrder.pin}
                  </span>
                </div>
              </div>

              {/* 5-Stage Visual Timeline */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Preparation Progress
                </span>
                <div className="flex sm:grid sm:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
                  {stages.map((st, idx) => {
                    const isDone = idx < activeIdx;
                    const isCurrent = idx === activeIdx;
                    return (
                      <div
                        key={st.key}
                        className={`min-w-[140px] sm:min-w-0 flex-1 p-3 sm:p-3.5 rounded-2xl border transition-all relative ${
                          isCurrent
                            ? 'bg-rose-50/70 border-[#ab3500] ring-1 ring-[#ab3500]/20'
                            : isDone
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-slate-50 border-slate-200/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCurrent
                                ? 'bg-[#ab3500] text-white'
                                : isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isDone ? <CheckIcon className="w-3 h-3 text-white" /> : idx + 1}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-sm bg-[#ab3500] text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 leading-tight">
                          {st.label}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{st.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Digital QR Token & Items Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* QR Code Pass */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center flex flex-col items-center justify-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Digital QR Pickup Token
                  </span>
                  <div className="w-32 h-32 bg-white p-2.5 rounded-xl shadow-2xs border border-slate-200 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                      <rect width="25" height="25" x="5" y="5" />
                      <rect width="15" height="15" x="10" y="10" fill="white" />
                      <rect width="7" height="7" x="14" y="14" />
                      <rect width="25" height="25" x="70" y="5" />
                      <rect width="15" height="15" x="75" y="10" fill="white" />
                      <rect width="7" height="7" x="79" y="14" />
                      <rect width="25" height="25" x="5" y="70" />
                      <rect width="15" height="15" x="10" y="75" fill="white" />
                      <rect width="7" height="7" x="14" y="79" />
                      <rect width="8" height="8" x="40" y="20" />
                      <rect width="8" height="8" x="50" y="35" />
                      <rect width="8" height="8" x="35" y="50" />
                      <rect width="8" height="8" x="65" y="65" />
                      <rect width="8" height="8" x="45" y="75" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">
                    {activeOrder.qrToken}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Flash screen at <strong>{activeOrder.counter}</strong> to collect.
                  </p>
                </div>

                {/* Items in this Order */}
                <div className="md:col-span-2 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ordered Dishes
                  </span>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {activeOrder.items.map((it, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={it.imageUrl}
                            alt={it.name}
                            className="w-10 h-10 rounded-lg object-cover border"
                            onError={(e) => { e.target.src = '/burger.jpg'; }}
                          />
                          <div>
                            <h5 className="font-bold text-slate-900">{it.name}</h5>
                            <span className="text-slate-500">Qty: {it.quantity}</span>
                          </div>
                        </div>
                        <span className="font-black text-slate-900">
                          ₹{(it.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financials */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Payment via <strong>{activeOrder.paymentMethod}</strong>
                    </span>
                    <span className="text-base font-black text-[#ab3500]">
                      Total: ₹{activeOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Kitchen Simulation Control */}
              <div className="pt-3 border-t border-slate-100 bg-slate-50 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Kitchen Status Simulation
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Simulate how kitchen staff advance the ticket status in real-time.
                  </span>
                </div>
                <button
                  onClick={() => onAdvanceOrderStatus(activeOrder.id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center space-x-1.5 shrink-0"
                >
                  <span>Advance Status:</span>
                  <span className="text-amber-300">
                    {activeOrder.status === 'placed'
                      ? 'Accept Ticket ➔'
                      : activeOrder.status === 'confirmed'
                      ? 'Start Cooking ➔'
                      : activeOrder.status === 'preparing'
                      ? 'Mark Ready for Pickup'
                      : activeOrder.status === 'ready'
                      ? 'Confirm Handover'
                      : 'Completed'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">No active orders right now</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Place a pre-order from the food menu to track your meal preparation.
            </p>
          </div>
        )
      ) : (
        /* Past Orders History List */
        <div className="space-y-3">
          {allOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-xl p-4 border border-slate-200 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono font-bold text-xs text-slate-900">{ord.id}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500 font-medium">{ord.placedAt}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-600 font-medium">{ord.counter}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {ord.status === 'collected' ? 'Collected' : ord.status}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">₹{ord.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="flex flex-wrap gap-2">
                {ord.items.map((it, i) => (
                  <span
                    key={i}
                    className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800"
                  >
                    <strong className="text-[#ab3500] mr-1">{it.quantity}x</strong>
                    {it.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-400">Paid via {ord.paymentMethod}</span>
                <button
                  onClick={() => onReorder(ord)}
                  className="px-3 py-1.5 bg-[#ab3500] hover:bg-[#8f2c00] text-white text-xs font-bold rounded-lg transition"
                >
                  Reorder to Tray
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
