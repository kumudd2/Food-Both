// client/src/App.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import MenuScreen from './components/MenuScreen';
import CartDrawer from './components/CartDrawer';
import DishModal from './components/DishModal';
import OrderTrackerScreen, { OrderFeedbackCard } from './components/OrderTrackerScreen';
import WalletScreen from './components/WalletScreen';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import MobileShareModal from './components/MobileShareModal';
import ProfileModal from './components/ProfileModal';
import { BagIcon, ArrowRightIcon } from './components/Icons';
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_USER,
  INITIAL_ORDERS,
} from './data/mockData';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fb_user');
    const token = localStorage.getItem('fb_auth_token');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, isLoggedIn: Boolean(token) };
      } catch (_) {}
    }
    return {
      ...INITIAL_USER,
      isLoggedIn: Boolean(token),
    };
  });

  // Role is strictly governed by login credentials:
  // Staff/Admin accounts strictly open Staff KDS Portal ('admin')
  // Students and non-logged-in customers strictly open Student Portal ('student')
  const role = useMemo(() => {
    if (user && user.isLoggedIn && (user.role === 'admin' || user.role === 'staff')) {
      return 'admin';
    }
    return 'student';
  }, [user]);

  const [foodItems, setFoodItems] = useState(() => {
    const saved = localStorage.getItem('fb_food_items');
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('fb_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('fb_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [walletTransactions, setWalletTransactions] = useState(() => {
    const saved = localStorage.getItem('fb_wallet_txns');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 'TXN-9041', type: 'credit', title: 'UPI Instant Top-Up', amount: 500, date: 'Yesterday, 4:30 PM', balanceAfter: 480 },
          { id: 'TXN-9022', type: 'debit', title: 'Campus Thali Order #ORD-10044', amount: 147, date: 'Yesterday, 1:15 PM', balanceAfter: 20 },
          { id: 'TXN-8991', type: 'credit', title: 'Monthly Mess Subsidy Credit', amount: 1200, date: 'Nov 01, 2024', balanceAfter: 1220 },
        ];
  });

  const [studentTab, setStudentTab] = useState('menu');
  const [adminTab, setAdminTab] = useState('kds');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalDish, setModalDish] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isMobileShareOpen, setIsMobileShareOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState({
    checked: false,
    connected: false,
    database: null,
  });

  // Auto-popup feedback modal when kitchen confirms pickup
  const [feedbackPopupOrder, setFeedbackPopupOrder] = useState(null);
  const prevOrderStatusesRef = useRef({});

  // Database Auto-Detection & Resilient Auto-Reconnect Protocol
  useEffect(() => {
    let isSubscribed = true;

    async function syncDatabaseData() {
      // Fetch Menu from PostgreSQL
      try {
        const menuRes = await fetch('/api/menu');
        const menuData = await menuRes.json();
        if (menuData && Array.isArray(menuData.items) && menuData.items.length > 0) {
          setFoodItems(menuData.items);
        }
      } catch (_) {}

      // Fetch Orders from PostgreSQL
      try {
        const ordersRes = await fetch('/api/orders');
        const ordersData = await ordersRes.json();
        if (ordersData && Array.isArray(ordersData.orders) && ordersData.orders.length > 0) {
          ordersData.orders.forEach((o) => {
            prevOrderStatusesRef.current[o.id] = o.status;
          });
          setOrders(ordersData.orders);
        }
      } catch (_) {}

      // Fetch Wallet from PostgreSQL
      try {
        const walletRes = await fetch('/api/wallet');
        const walletData = await walletRes.json();
        if (walletData && walletData.balance !== undefined) {
          setUser((prev) => ({
            ...prev,
            walletBalance: walletData.balance,
            rewardPoints: walletData.rewardPoints || prev.rewardPoints,
          }));
          if (Array.isArray(walletData.transactions) && walletData.transactions.length > 0) {
            setWalletTransactions(walletData.transactions);
          }
        }
      } catch (_) {}
    }

    async function checkDatabaseConnection() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        if (data && data.dbConnected) {
          if (!dbStatus.connected) {
            setDbStatus({ checked: true, connected: true, database: data.database });
            showToast('Connected to PostgreSQL Database');
            await syncDatabaseData();
          }
          return true;
        }
      } catch (err) {
        // API offline or DB not reachable
      }

      if (dbStatus.connected) {
        setDbStatus({ checked: true, connected: false, database: null });
      } else if (!dbStatus.checked) {
        setDbStatus({ checked: true, connected: false, database: null });
      }
      return false;
    }

    checkDatabaseConnection();

    // Heartbeat every 4s to ensure continuous connection & auto-reconnect if server restarts
    const interval = setInterval(() => {
      if (isSubscribed) {
        checkDatabaseConnection();
      }
    }, 4000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [dbStatus.connected]);

  // Live polling for order status updates from Kitchen Staff KDS
  useEffect(() => {
    if (!dbStatus.connected) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data && Array.isArray(data.orders)) {
          const newOrders = data.orders;
          const prevStatuses = prevOrderStatusesRef.current;

          // Check if any order transitioned to 'collected' and hasn't been rated yet
          if (role === 'student') {
            const newlyCollected = newOrders.find(
              (ord) =>
                ord.status === 'collected' &&
                prevStatuses[ord.id] &&
                prevStatuses[ord.id] !== 'collected' &&
                !ord.rating
            );
            if (newlyCollected) {
              setFeedbackPopupOrder((current) => current || newlyCollected);
            }
          }

          // Update statuses ref
          newOrders.forEach((o) => {
            prevOrderStatusesRef.current[o.id] = o.status;
          });

          setOrders(newOrders);
        }
      } catch (_) {}
    }, 3500);
    return () => clearInterval(interval);
  }, [dbStatus.connected, role]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('fb_food_items', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('fb_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('fb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('fb_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fb_wallet_txns', JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Callbacks
  const handleAuthSuccess = (authData) => {
    if (authData && authData.user) {
      const loggedUser = {
        ...user,
        ...authData.user,
        isLoggedIn: true,
      };
      setUser(loggedUser);
      localStorage.setItem('fb_user', JSON.stringify(loggedUser));
      if (authData.token) {
        localStorage.setItem('fb_auth_token', authData.token);
      }

      if (authData.user.role === 'admin' || authData.user.role === 'staff') {
        setAdminTab('kds');
        showToast(`Signed in as ${authData.user.name} (Kitchen Staff)`);
      } else {
        setStudentTab('menu');
        showToast(`Signed in as ${authData.user.name}`);
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('fb_auth_token');
    localStorage.removeItem('fb_current_role');
    const guestUser = {
      ...INITIAL_USER,
      name: 'Guest Customer',
      studentId: 'STU-GUEST',
      role: 'student',
      isLoggedIn: false,
    };
    setUser(guestUser);
    localStorage.setItem('fb_user', JSON.stringify(guestUser));
    setStudentTab('menu');
    showToast('Signed out successfully');
  };

  const handleUpdateProfile = (updatedUser) => {
    if (updatedUser) {
      const merged = { ...user, ...updatedUser };
      setUser(merged);
      localStorage.setItem('fb_user', JSON.stringify(merged));
      showToast('Profile updated successfully');
    }
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  }, [cartItems]);

  const activeOrder = orders.find((o) => o.status !== 'collected') || orders[0];

  // Cart actions
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showToast(`Added ${item.name} to tray`);
  };

  const handleIncreaseQty = (foodId) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === foodId ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const handleDecreaseQty = (foodId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === foodId);
      if (item && item.quantity <= 1) {
        return prev.filter((i) => i.id !== foodId);
      }
      return prev.map((i) => (i.id === foodId ? { ...i, quantity: i.quantity - 1 } : i));
    });
  };

  const handleRemoveItem = (foodId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== foodId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Place order
  const handlePlaceOrder = (orderData) => {
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      id: newOrderNumber,
      pin: randomPin,
      customerName: user.name,
      studentId: user.studentId,
      qrToken: `FOODBOOTH-TOKEN-${randomPin}-VERIFIED`,
      placedAt: 'Just now',
      status: 'placed',
      ...orderData,
    };

    if (orderData.paymentMethod === 'Campus Meal Card') {
      const newBal = Math.max(0, user.walletBalance - orderData.total);
      setUser((prev) => ({
        ...prev,
        walletBalance: newBal,
        rewardPoints: prev.rewardPoints + Math.round(orderData.total * 0.1),
      }));
      setWalletTransactions((prev) => [
        {
          id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'debit',
          title: `Pre-Order #${newOrderNumber}`,
          amount: Math.round(orderData.total),
          date: 'Just now',
          balanceAfter: Math.round(newBal),
        },
        ...prev,
      ]);
    }

    prevOrderStatusesRef.current[newOrder.id] = 'placed';
    setOrders([newOrder, ...orders]);
    setCartItems([]);
    setStudentTab('tracker');
    showToast(`Order Placed! Pickup PIN: ${randomPin}`);

    // If PostgreSQL is connected, persist to database
    if (dbStatus.connected) {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      }).catch((err) => console.log('DB sync notice:', err.message));
    }
  };

  // Advance Order Lifecycle
  const handleAdvanceOrderStatus = (orderId, targetStatus = null) => {
    const flow = ['placed', 'confirmed', 'preparing', 'ready', 'collected'];
    let target = targetStatus;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const currentIdx = flow.indexOf(ord.status);
          const next =
            targetStatus || (currentIdx < flow.length - 1 ? flow[currentIdx + 1] : 'collected');
          target = next;
          showToast(`Order ${ord.id}: ${next.toUpperCase()}`);
          if (next === 'collected' && !ord.rating) {
            setFeedbackPopupOrder({ ...ord, status: 'collected' });
          }
          return { ...ord, status: next };
        }
        return ord;
      })
    );

    // If PostgreSQL is connected, update database
    if (dbStatus.connected && target) {
      fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: target }),
      }).catch((err) => console.log('DB sync notice:', err.message));
    }
  };

  // Reorder
  const handleReorder = (pastOrder) => {
    setCartItems(pastOrder.items);
    setIsCartOpen(true);
    showToast(`Loaded items from ${pastOrder.id}`);
  };

  // Submit Customer Order Feedback
  const handleSubmitFeedback = (orderId, feedbackData) => {
    const { rating, notes, tags } = feedbackData;
    const nowIso = new Date().toISOString();

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            rating,
            feedbackNotes: notes,
            feedbackTags: tags,
            feedbackAt: nowIso,
          };
        }
        return ord;
      })
    );

    showToast(`Thank you! Rated ${rating} ⭐ for order ${orderId}`);

    // If backend is reachable, persist feedback to PostgreSQL
    fetch(`/api/orders/${orderId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, notes, tags }),
    }).catch((err) => console.log('Feedback sync notice:', err.message));
  };

  // Recharge Wallet
  const handleRechargeWallet = (amount) => {
    const newBal = user.walletBalance + amount;
    setUser((prev) => ({
      ...prev,
      walletBalance: newBal,
      rewardPoints: prev.rewardPoints + Math.round(amount * 0.05),
    }));
    setWalletTransactions((prev) => [
      {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'credit',
        title: 'UPI Wallet Top-Up',
        amount: Math.round(amount),
        date: 'Just now',
        balanceAfter: Math.round(newBal),
      },
      ...prev,
    ]);
    showToast(`₹${amount} credited to Dining Wallet`);

    // If PostgreSQL is connected, persist to database
    if (dbStatus.connected) {
      fetch('/api/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      }).catch((err) => console.log('DB sync notice:', err.message));
    }
  };

  // Toggle Stock
  const handleToggleStock = (foodId) => {
    setFoodItems((prev) =>
      prev.map((item) => (item.id === foodId ? { ...item, inStock: !item.inStock } : item))
    );
    showToast('Stock availability updated');

    if (dbStatus.connected) {
      fetch(`/api/menu/${foodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleStock: true }),
      }).catch((err) => console.log('DB sync notice:', err.message));
    }
  };

  // Add New Dish
  const handleAddDish = (newDish) => {
    setFoodItems((prev) => [newDish, ...prev]);
    showToast(`Added "${newDish.name}" to menu`);

    if (dbStatus.connected) {
      fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDish),
      }).catch((err) => console.log('DB sync notice:', err.message));
    }
  };

  // Update Dish
  const handleUpdateDish = (dishId, updatedFields) => {
    setFoodItems((prev) =>
      prev.map((item) => (item.id === dishId ? { ...item, ...updatedFields } : item))
    );
    showToast('Dish details updated');

    if (dbStatus.connected) {
      fetch(`/api/menu/${dishId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      }).catch((err) => console.log('DB sync notice:', err.message));
    }
  };

  // Delete Dish
  const handleDeleteDish = (dishId) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== dishId));
    showToast('Dish removed from menu');

    if (dbStatus.connected) {
      fetch(`/api/menu/${dishId}`, {
        method: 'DELETE',
      }).catch((err) => console.log('DB sync notice:', err.message));
    }
  };

  // Cancel / Refund Order
  const handleCancelOrder = (orderId, reason = 'Cancelled by Kitchen Staff') => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, status: 'cancelled', cancelReason: reason };
        }
        return ord;
      })
    );
    showToast(`Order ${orderId} marked cancelled`);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-800 flex flex-col font-body selection:bg-rose-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        activeTab={role === 'admin' ? adminTab : studentTab}
        setActiveTab={role === 'admin' ? setAdminTab : setStudentTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        walletBalance={user.walletBalance}
        onOpenWallet={() => setStudentTab('wallet')}
        activeOrder={activeOrder}
        user={user}
        role={role}
        dbStatus={dbStatus}
        onOpenAuth={() => {
          setAuthMode('login');
          setIsAuthOpen(true);
        }}
        onSignOut={handleSignOut}
        onOpenMobileShare={() => setIsMobileShareOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Container with smooth fade transition on activeTab change */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        <div key={role === 'admin' ? adminTab : studentTab} className="animate-fade-in w-full">
          {role === 'admin' ? (
            <AdminPortal
              orders={orders}
              foodItems={foodItems}
              onUpdateOrderStatus={handleAdvanceOrderStatus}
              onCancelOrder={handleCancelOrder}
              onToggleStock={handleToggleStock}
              onAddDish={handleAddDish}
              onUpdateDish={handleUpdateDish}
              onDeleteDish={handleDeleteDish}
              adminTab={adminTab}
              onTabChange={setAdminTab}
            />
          ) : (
            <>
              {studentTab === 'menu' && (
                <MenuScreen
                  foodItems={foodItems}
                  cartItems={cartItems}
                  onAddToCart={handleAddToCart}
                  onIncreaseQty={handleIncreaseQty}
                  onDecreaseQty={handleDecreaseQty}
                  onOpenDishModal={(dish) => setModalDish(dish)}
                  onOpenCart={() => setIsCartOpen(true)}
                />
              )}

              {studentTab === 'tracker' && (
                <OrderTrackerScreen
                  activeOrder={activeOrder}
                  allOrders={orders}
                  onReorder={handleReorder}
                  onSubmitFeedback={handleSubmitFeedback}
                />
              )}

              {studentTab === 'wallet' && (
                <WalletScreen
                  user={user}
                  walletBalance={user.walletBalance}
                  onRechargeWallet={handleRechargeWallet}
                  transactions={walletTransactions}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Persistent Floating Tray FAB (Always anchored to the bottom-right in Student mode) */}
      {role === 'student' && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Open food tray"
            className="group bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3.5 shadow-2xl border border-slate-700/90 flex items-center space-x-2 sm:space-x-3 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <div className="flex items-center space-x-2.5">
              <div className="relative flex items-center justify-center">
                <BagIcon className="w-4 h-4 text-slate-200 group-hover:text-white transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ab3500] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pop">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold tracking-tight">My Tray</span>
            </div>

            {cartCount > 0 ? (
              <>
                <div className="h-4 w-px bg-slate-700"></div>
                <div className="flex items-center space-x-1.5 text-xs font-black text-amber-300">
                  <span>₹{Math.round(cartTotal || 0)}</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-amber-300" />
                </div>
              </>
            ) : (
              <span className="text-[11px] font-semibold text-slate-400 pl-0.5">
                (Empty)
              </span>
            )}
          </button>
        </div>
      )}

      {/* Slide-Out Tray Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onIncreaseQty={handleIncreaseQty}
        onDecreaseQty={handleDecreaseQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        walletBalance={user.walletBalance}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Customizer Modal */}
      <DishModal
        dish={modalDish}
        isOpen={Boolean(modalDish)}
        onClose={() => setModalDish(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Login & Registration Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
        initialRole={role === 'admin' ? 'staff' : 'student'}
      />

      {/* Mobile QR & Link Sharing Modal */}
      <MobileShareModal
        isOpen={isMobileShareOpen}
        onClose={() => setIsMobileShareOpen(false)}
      />

      {/* Campus Profile Details Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Auto-Popup Feedback Modal on Pickup Confirmation */}
      {feedbackPopupOrder && role === 'student' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-scale-up max-h-[92vh] flex flex-col">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <h3 className="font-black text-base sm:text-lg tracking-tight font-display">
                    Pickup Confirmed!
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Order #{feedbackPopupOrder.id} • {feedbackPopupOrder.counter || 'Food Booth Counter'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackPopupOrder(null)}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4 sm:p-5 overflow-y-auto">
              <OrderFeedbackCard
                order={feedbackPopupOrder}
                onSubmitFeedback={handleSubmitFeedback}
                isModal={true}
                onCloseModal={() => setFeedbackPopupOrder(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Clean Animated Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center space-x-2 animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
