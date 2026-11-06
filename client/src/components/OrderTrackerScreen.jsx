// client/src/components/OrderTrackerScreen.jsx
import React from 'react';
import { CheckIcon } from './Icons';

export default function OrderTrackerScreen({
  activeOrder,
  allOrders,
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              selectedTab === 'active'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Active Order</span>
            {activeOrder && activeOrder.status !== 'collected' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
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
                      ? 'Food is Ready for Pickup!'
                      : activeOrder.status === 'collected'
                      ? 'Order Collected & Completed'
                      : activeOrder.status === 'preparing'
                      ? 'Kitchen Chefs Are Cooking Your Meal'
                      : 'Order Received by Kitchen'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assigned Counter: <strong className="text-slate-800">{activeOrder.counter}</strong> •{' '}
                    Pickup Slot: <strong className="text-slate-800">{activeOrder.pickupSlot}</strong>
                  </p>
                </div>

                {/* 4-Digit Pickup PIN */}
                <div className="bg-slate-900 text-white p-3.5 rounded-2xl text-center sm:text-right shrink-0 border border-slate-800 shadow-xs">
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
                  Kitchen Preparation Progress
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
                                ? 'bg-[#ab3500] text-white animate-pulse'
                                : isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isDone ? <CheckIcon className="w-3 h-3 text-white" /> : idx + 1}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-sm bg-[#ab3500] text-white">
                              Current
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
                  <span className="text-[11px] font-mono text-slate-500 font-bold truncate max-w-[200px]">
                    {activeOrder.qrToken}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Show this screen at <strong>{activeOrder.counter}</strong> to collect your meal.
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
                            src={it.imageUrl || '/burger.jpg'}
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
                      Payment via <strong>{activeOrder.paymentMethod || 'Campus Meal Card'}</strong>
                    </span>
                    <span className="text-base font-black text-[#ab3500]">
                      Total: ₹{Number(activeOrder.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Kitchen Status Notice (Customer View Only - Managed by Staff) */}
              <div className="pt-3 border-t border-slate-100 bg-gradient-to-r from-amber-50/80 to-orange-50/60 border border-amber-200/70 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 rounded-2xl bg-[#ab3500] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                    👨‍🍳
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block font-display">
                      {activeOrder.status === 'ready'
                        ? 'Your meal is packaged and ready at the counter!'
                        : activeOrder.status === 'preparing'
                        ? 'Kitchen staff is actively preparing your order'
                        : activeOrder.status === 'collected'
                        ? 'Order successfully handed over and completed'
                        : 'Order queued on Kitchen Display Screen'}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {activeOrder.status === 'ready'
                        ? `Head to ${activeOrder.counter} and show your PIN: ${activeOrder.pin}`
                        : `Cooks at ${activeOrder.counter} will update your progress bar as dishes are prepared.`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-[11px] font-extrabold text-slate-700 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Staff KDS Sync</span>
                  </span>
                </div>
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
        /* Order History List */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Completed & Past Orders</h3>
            <span className="text-xs text-slate-400">{allOrders.length} total orders</span>
          </div>

          <div className="space-y-3">
            {allOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No past orders found in this account.
              </div>
            ) : (
              allOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{ord.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-emerald-100 text-emerald-800">
                        {ord.status}
                      </span>
                      <span className="text-xs text-slate-400">• {ord.placedAt}</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Counter: <strong>{ord.counter}</strong> • Total Paid:{' '}
                      <strong className="text-slate-800">₹{Number(ord.total).toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onReorder(ord)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Re-Order Items
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
