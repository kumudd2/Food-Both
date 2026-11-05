// client/src/components/Navbar.jsx
import React from 'react';
import { WalletIcon, PlusIcon } from './Icons';

export default function Navbar({
  activeTab,
  setActiveTab,
  walletBalance,
  onOpenWallet,
  activeOrder,
  role,
  onToggleRole,
  dbStatus = { connected: false },
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const studentTabs = [
    { id: 'menu', label: 'Menu' },
    {
      id: 'tracker',
      label: 'My Orders',
      badge: activeOrder && activeOrder.status !== 'collected' ? 'Live' : null,
    },
  ];

  const adminTabs = [
    { id: 'kds', label: 'Kitchen KDS' },
    { id: 'inventory', label: 'Stock & Menu' },
    { id: 'sales', label: 'Daily Sales' },
    { id: 'all_orders', label: 'Orders Log' },
  ];

  const currentTabs = role === 'admin' ? adminTabs : studentTabs;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Minimal Logo */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer shrink-0"
            onClick={() => setActiveTab(role === 'admin' ? 'kds' : 'menu')}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black tracking-tighter">
              FB
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-base font-display">
                Food<span className="text-[#ab3500]">Booth</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 bg-slate-50 hidden sm:inline-block">
                {role === 'admin' ? 'Staff Portal' : 'Central Mess'}
              </span>
              {dbStatus?.connected ? (
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 hidden md:inline-flex items-center space-x-1" title="Connected to PostgreSQL Database">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>PostgreSQL Live</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 bg-slate-50 hidden md:inline-flex items-center space-x-1" title="PostgreSQL not detected; running on browser localStorage & mockData.">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>Local Storage</span>
                </span>
              )}
            </div>
          </div>

          {/* Center: Clean Minimal Nav Links (Menu & My Orders only) */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentTabs.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#ab3500] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Corner: Wallet with [+] icon only, Role Toggle & Profile */}
          <div className="flex items-center space-x-2.5">
            {/* Wallet: Just balance + '+' icon */}
            {role === 'student' && (
              <button
                onClick={onOpenWallet}
                title="Click to view Dining Wallet / Recharge"
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  activeTab === 'wallet'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <WalletIcon className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-black">₹{Math.round(walletBalance || 0)}</span>
                <span className="w-4 h-4 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs ml-0.5">
                  <PlusIcon className="w-2.5 h-2.5" />
                </span>
              </button>
            )}

            {/* Role Switcher in Corner (Shown on sm+ desktop; mobile has dedicated entry in hamburger) */}
            <button
              onClick={onToggleRole}
              title={role === 'student' ? 'Switch to Staff KDS View' : 'Switch to Student View'}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <span>{role === 'student' ? 'Staff KDS' : 'Student View'}</span>
            </button>

            {/* Profile Avatar */}
            <img
              src="/avatar.jpg"
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-slate-200 object-cover hidden sm:block"
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 flex flex-col space-y-1">
            {currentTabs.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between ${
                  activeTab === item.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {role === 'student' && (
              <button
                onClick={() => {
                  onOpenWallet();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between text-slate-800 bg-slate-50"
              >
                <span className="flex items-center space-x-1.5">
                  <WalletIcon className="w-3.5 h-3.5" />
                  <span>Wallet Balance</span>
                </span>
                <span className="font-black">₹{Math.round(walletBalance || 0)}</span>
              </button>
            )}

            <div className="pt-2 pb-1 px-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 mt-1">
              <span>Data Storage:</span>
              {dbStatus?.connected ? (
                <span className="font-bold text-emerald-600 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>PostgreSQL Online</span>
                </span>
              ) : (
                <span className="font-bold text-slate-500 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>Offline LocalStorage</span>
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleRole();
              }}
              className="px-3 py-2 rounded-xl text-xs font-black text-left flex items-center justify-between bg-slate-100 text-slate-800 mt-1"
            >
              <span>{role === 'student' ? 'Switch to Staff Portal' : 'Switch to Student View'}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
