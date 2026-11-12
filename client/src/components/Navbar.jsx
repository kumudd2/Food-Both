// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { WalletIcon, PlusIcon } from './Icons';

export default function Navbar({
  activeTab,
  setActiveTab,
  walletBalance,
  onOpenWallet,
  activeOrder,
  role,
  dbStatus = { connected: false },
  user,
  onOpenAuth,
  onSignOut,
  onOpenMobileShare,
  onOpenProfile,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const studentTabs = [
    { id: 'menu', label: 'Menu' },
    {
      id: 'tracker',
      label: 'My Orders',
      badge: activeOrder && activeOrder.status !== 'collected' ? 'Live' : null,
    },
    {
      id: 'wallet',
      label: 'Dining Wallet',
      badge: walletBalance !== undefined && walletBalance > 0 ? `₹${Math.round(walletBalance)}` : null,
    },
  ];

  const staffTabs = [
    { id: 'kds', label: 'Kitchen KDS' },
    { id: 'inventory', label: 'Stock & Menu' },
    { id: 'all_orders', label: 'Orders Log' },
  ];

  const adminTabs = [
    { id: 'kds', label: 'Kitchen KDS' },
    { id: 'inventory', label: 'Stock & Menu' },
    { id: 'sales', label: 'Daily Sales' },
    { id: 'feedbacks', label: 'Feedbacks' },
    { id: 'all_orders', label: 'Orders Log' },
    { id: 'staff', label: 'Staff Accounts' },
  ];

  const currentTabs =
    user?.role === 'admin'
      ? adminTabs
      : user?.role === 'staff'
      ? staffTabs
      : studentTabs;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 w-full shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Minimal Logo */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer shrink-0"
            onClick={() => setActiveTab(role === 'admin' ? 'kds' : 'menu')}
          >
            <img
              src="/logo.png"
              alt="FoodBooth Logo"
              className="w-9 h-9 object-contain drop-shadow-xs transition-transform duration-200 hover:scale-105"
            />
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-base font-display">
                Food<span className="text-[#ab3500]">Booth</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border border-slate-200 text-slate-500 bg-slate-50 hidden sm:inline-block">
                {user?.role === 'admin' ? 'Admin Portal' : user?.role === 'staff' ? 'Kitchen KDS' : 'Food Court'}
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

          {/* Center: Clean Minimal Nav Links (Menu & My Orders) */}
          <nav className="hidden md:flex items-center space-x-1">
            {currentTabs.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'wallet' && onOpenWallet) {
                      onOpenWallet();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer'
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

          {/* Right Corner: Phone Link, Wallet, Role Toggle & Profile / Sign In */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Open on Phone / QR Button */}
            <button
              onClick={onOpenMobileShare}
              title="Open app on mobile phone or tablet (QR Code & Link)"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-orange-50 hover:bg-orange-100 text-[#ab3500] border border-orange-200/80 transition cursor-pointer shadow-2xs"
            >
              <span>📱</span>
              <span className="hidden sm:inline">Phone URL</span>
            </button>

            {/* Wallet: Just balance + '+' icon */}
            {role === 'student' && (
              <button
                onClick={onOpenWallet}
                title="Click to view Dining Wallet / Recharge"
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
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

            {/* User Profile & Auth / Sign In Button */}
            {user && user.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1 pl-2 pr-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition cursor-pointer"
                >
                  <img
                    src={user.avatarUrl || '/avatar.jpg'}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                    onError={(e) => {
                      e.target.src = '/avatar.jpg';
                    }}
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-[11px] font-black text-slate-900 block leading-tight truncate max-w-[90px]">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      {user.role === 'admin' ? 'Admin' : user.role === 'staff' ? 'Staff' : 'Student'}
                    </span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-extrabold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="mt-1 inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-[#ab3500]">
                        {user.role === 'admin' ? 'Cafeteria Admin' : user.role === 'staff' ? 'Kitchen Staff' : 'Campus Student'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenWallet();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-between cursor-pointer"
                    >
                      <span>Dining Wallet</span>
                      <span className="font-black text-[#ab3500]">₹{Math.round(walletBalance || 0)}</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-between cursor-pointer"
                    >
                      <span>👤 Campus Profile</span>
                      <span className="text-[10px] text-slate-400">Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenMobileShare();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-between cursor-pointer"
                    >
                      <span>📱 Open on Mobile</span>
                      <span className="text-[10px] text-slate-400">QR Code</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 font-black text-rose-600 flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="py-1.5 px-3 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-xs transition flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <span>👤</span>
                <span>Sign In</span>
              </button>
            )}

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
                  if (item.id === 'wallet' && onOpenWallet) {
                    onOpenWallet();
                  } else {
                    setActiveTab(item.id);
                  }
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

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMobileShare();
              }}
              className="px-3 py-2 rounded-xl text-xs font-extrabold text-left flex items-center justify-between text-[#ab3500] bg-orange-50/70"
            >
              <span>📱 Open on Mobile / Share Link</span>
              <span className="text-[10px] font-bold">QR</span>
            </button>

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
              <span>Database Sync:</span>
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

            {user && user.isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenProfile) onOpenProfile();
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between bg-slate-100 text-slate-800 mt-1"
                >
                  <span>👤 Campus Profile</span>
                  <span className="text-[10px] text-slate-500">Edit Details</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignOut();
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-black text-left flex items-center justify-between bg-rose-50 text-rose-700 mt-1"
                >
                  <span>Sign Out ({user.name})</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="px-3 py-2 rounded-xl text-xs font-black text-left flex items-center justify-between bg-slate-900 text-white mt-1"
              >
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Horizontal Quick Navigation Bar on Home Page */}
      <div className="md:hidden flex items-center space-x-1.5 px-4 py-2 bg-slate-50/90 border-t border-slate-100 overflow-x-auto no-scrollbar">
        {currentTabs.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'wallet' && onOpenWallet) {
                  onOpenWallet();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 bg-white border border-slate-200/80 hover:bg-slate-100'
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
      </div>
    </header>
  );
}
