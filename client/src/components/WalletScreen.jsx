// client/src/components/WalletScreen.jsx
import React from 'react';
import { WalletIcon, PlusIcon } from './Icons';

export default function WalletScreen({
  user,
  walletBalance,
  onRechargeWallet,
  transactions = [],
}) {
  const [customAmount, setCustomAmount] = React.useState('');
  const [upiId, setUpiId] = React.useState('student@okaxis');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleQuickRecharge = (amt) => {
    setIsProcessing(true);
    setTimeout(() => {
      onRechargeWallet(amt);
      setIsProcessing(false);
      setCustomAmount('');
    }, 400);
  };

  const handleCustomRecharge = (e) => {
    e.preventDefault();
    const val = Number(customAmount);
    if (!val || val <= 0) return;
    handleQuickRecharge(val);
  };

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
          FoodBooth Wallet
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Linked RFID Student Meal Card for 1-click instant checkout with 5% cashback
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Digital Campus Meal Card */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 shadow-lg border border-slate-800 flex flex-col justify-between min-h-[220px]">
          {/* Card Top */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                FoodBooth Dining Pass
              </span>
              <span className="text-xs font-bold text-white">FoodBooth Express System</span>
            </div>
            {/* Gold Chip */}
            <div className="w-9 h-6 rounded-md bg-amber-400 border border-amber-500 shadow-2xs"></div>
          </div>

          {/* Balance Spotlight */}
          <div className="my-5">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Available Balance
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-3xl font-black tracking-tight font-display text-white">
                ₹{walletBalance.toFixed(2)}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>

          {/* Card Bottom: Student Details */}
          <div className="flex items-end justify-between pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-mono block">
                Cardholder
              </span>
              <span className="font-bold text-white">
                {user?.name || 'Kumud Negi'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 uppercase font-mono block">
                Roll Number
              </span>
              <span className="font-mono text-xs font-bold text-slate-300">
                {user?.studentId || 'STU-2024-8842'}
              </span>
            </div>
          </div>
        </div>

        {/* Instant UPI Wallet Recharge Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Instant Wallet Top-Up</h3>
            <p className="text-[11px] text-slate-500">Recharge via UPI with zero gateway fees</p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Select Amount
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[100, 200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleQuickRecharge(amt)}
                  disabled={isProcessing}
                  className="py-2 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-xs font-bold text-slate-800 transition active:scale-95 disabled:opacity-50"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Form */}
          <form onSubmit={handleCustomRecharge} className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Custom Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="e.g. 350"
                  className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">UPI ID / VPA</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing || !customAmount}
              className="w-full py-2.5 bg-[#ab3500] hover:bg-[#8f2c00] active:scale-98 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              {isProcessing ? 'Crediting Wallet...' : `Add ₹${customAmount || '0'} to Meal Card`}
            </button>
          </form>
        </div>
      </div>

      {/* Passes & Loyalty Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Reward Points
          </span>
          <span className="text-xl font-black text-slate-900">{user?.rewardPoints || 240} pts</span>
          <span className="text-[11px] text-emerald-600 font-medium block">Worth ₹24 in food discounts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Monthly Breakfast Pass
          </span>
          <span className="text-xs font-bold text-slate-800 block">35% discount on daily breakfast</span>
          <span className="text-xs font-black text-[#ab3500] block">₹1,200 / month</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Executive Lunch Club
          </span>
          <span className="text-xs font-bold text-slate-800 block">Guaranteed reserved pickup slot</span>
          <span className="text-xs font-black text-[#ab3500] block">₹2,400 / month</span>
        </div>
      </div>

      {/* Recent Wallet Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Recent Dining Card Transactions
            </h3>
            <p className="text-[11px] text-slate-400">
              Transparent digital pass audit log & payment receipts
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {transactions.length} entries
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No recent transactions recorded.
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition text-xs">
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      tx.type === 'credit'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">{tx.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {tx.id} • {tx.date}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-black text-sm font-mono block ${
                      tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'credit' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                  </span>
                  {tx.balanceAfter !== undefined && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      Bal: ₹{tx.balanceAfter}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
