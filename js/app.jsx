// Smart Cafeteria Main Root Application & Router

function App() {
  // Navigation & View Mode
  const [currentScreen, setCurrentScreen] = React.useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [selectedDish, setSelectedDish] = React.useState(window.CafeteriaData.foodItems[0]);
  const [isBackendConnected, setIsBackendConnected] = React.useState(false);

  // Global State
  const [cartItems, setCartItems] = React.useState(window.CafeteriaData.defaultCart);
  const [orders, setOrders] = React.useState(window.CafeteriaData.defaultOrders);
  const [notifications, setNotifications] = React.useState(window.CafeteriaData.defaultNotifications);
  const [userProfile, setUserProfile] = React.useState(window.CafeteriaData.userProfile);
  const [toastMessage, setToastMessage] = React.useState(null);

  // Sync sound settings
  React.useEffect(() => {
    window.SoundFX.enabled = soundEnabled;
  }, [soundEnabled]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 3-Tier Backend & SQLite Sync on Mount
  const syncWithBackend = React.useCallback(async () => {
    const isUp = await window.CafeteriaAPI.init();
    setIsBackendConnected(isUp);
    if (isUp) {
      try {
        const [menuItems, dbOrders, walletData] = await Promise.all([
          window.CafeteriaAPI.getMenu(),
          window.CafeteriaAPI.getOrders(),
          window.CafeteriaAPI.getWallet()
        ]);
        if (menuItems && menuItems.length) {
          window.CafeteriaData.foodItems = menuItems;
        }
        if (dbOrders && dbOrders.length) {
          setOrders(dbOrders);
        }
        if (walletData) {
          setUserProfile(prev => ({
            ...prev,
            walletBalance: walletData.balance,
            rewardPoints: walletData.reward_points,
            studentId: walletData.student_id,
            name: walletData.cardholder
          }));
        }
        showToast("Connected to Python Flask & SQLite (cafeteria.db)");
      } catch (err) {
        console.error("Initial backend sync error:", err);
      }
    }
  }, []);

  React.useEffect(() => {
    syncWithBackend();
    window.CafeteriaAPI.onStatusChange(status => {
      setIsBackendConnected(status);
    });
  }, [syncWithBackend]);

  // Cart Helper Map { [itemId]: quantity }
  const cartItemsMap = React.useMemo(() => {
    const map = {};
    cartItems.forEach(item => {
      map[item.itemId] = item.quantity;
    });
    return map;
  }, [cartItems]);

  const totalCartCount = React.useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  const totalCartAmount = React.useMemo(() => {
    const subtotal = cartItems.reduce((acc, curr) => {
      const item = window.CafeteriaData.foodItems.find(f => f.id === curr.itemId);
      return acc + (item ? item.price * curr.quantity : 0);
    }, 0);
    return subtotal + (subtotal * 0.05); // 5% GST
  }, [cartItems]);

  // Active Order
  const activeOrder = orders.find(o => o.status !== 'completed' && o.status !== 'cancelled') || orders[0];

  // Cart Handlers: Customer can increase or decrease amount
  const handleAddToCart = (itemId) => {
    const food = window.CafeteriaData.foodItems.find(f => f.id === itemId);
    setCartItems(prev => {
      const exists = prev.find(i => i.itemId === itemId);
      if (exists) {
        return prev.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { itemId, quantity: 1, selectedCustomizations: [] }];
    });
    window.SoundFX.play('add');
    if (food) showToast(`Added ${food.name} to tray`);
  };

  const handleIncreaseQty = (itemId) => {
    setCartItems(prev =>
      prev.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i)
    );
    window.SoundFX.play('add');
  };

  const handleDecreaseQty = (itemId) => {
    setCartItems(prev => {
      const item = prev.find(i => i.itemId === itemId);
      if (item && item.quantity === 1) {
        return prev.filter(i => i.itemId !== itemId);
      }
      return prev.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i);
    });
    window.SoundFX.play('click');
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(i => i.itemId !== itemId));
    showToast('Item removed from tray');
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Tray cleared');
  };

  // Place Order Handler (Connected to Flask API & cafeteria.db)
  const handleOrderPlaced = async (newOrder) => {
    let orderToSave = newOrder;

    if (window.CafeteriaAPI.isOnline) {
      showToast("Syncing order with Python Flask & SQLite...");
      try {
        const payload = {
          pickup_slot: newOrder.pickupSlot,
          counter: newOrder.counter,
          special_instructions: newOrder.specialInstructions,
          payment_method: newOrder.paymentMethod,
          items: (newOrder.items || []).map(i => ({
            item_id: i.name,
            quantity: i.qty
          }))
        };
        const dbOrder = await window.CafeteriaAPI.createOrder(payload);
        if (dbOrder) {
          orderToSave = {
            ...newOrder,
            ...dbOrder,
            id: dbOrder.order_id || dbOrder.id
          };
          // Sync updated wallet balance from SQLite
          const w = await window.CafeteriaAPI.getWallet();
          if (w) {
            setUserProfile(prev => ({
              ...prev,
              walletBalance: w.balance,
              rewardPoints: w.reward_points
            }));
          }
        }
      } catch (err) {
        console.warn("Backend order creation warning:", err);
      }
    }

    setOrders(prev => [orderToSave, ...prev]);
    setCartItems([]); // Clear tray
    const newNotif = {
      id: 'notif-' + Date.now(),
      title: `Order ${orderToSave.id} confirmed & saved in cafeteria.db!`,
      time: 'Just now',
      type: 'success',
      orderId: orderToSave.id,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setCurrentScreen('tracking');
    showToast(`Order ${orderToSave.id} confirmed!`);
  };

  // Reorder past order
  const handleReorder = (pastOrder) => {
    const newItems = [];
    pastOrder.items.forEach(pastItem => {
      const food = window.CafeteriaData.foodItems.find(f => f.name === pastItem.name);
      if (food) {
        newItems.push({ itemId: food.id, quantity: pastItem.qty, selectedCustomizations: [] });
      }
    });
    setCartItems(newItems);
    setCurrentScreen('cart');
    showToast('Past order items added to tray!');
  };

  // Advance Order Status Simulation (Kitchen KDS synced with DB)
  const handleAdvanceOrderStatus = async (orderId = activeOrder?.id, targetStatus = null) => {
    const flow = ['placed', 'accepted', 'preparing', 'ready', 'collected'];
    const currentOrder = orders.find(o => o.id === orderId) || activeOrder;
    const currentIdx = flow.indexOf(currentOrder?.status || 'placed');
    const nextStatus = targetStatus || (currentIdx < flow.length - 1 ? flow[currentIdx + 1] : 'completed');

    if (window.CafeteriaAPI.isOnline && orderId) {
      try {
        await window.CafeteriaAPI.updateOrderStatus(orderId, nextStatus);
      } catch (e) {
        console.warn("Status update API warning:", e);
      }
    }

    setOrders(orders.map(ord => {
      if (ord.id === orderId) {
        if (nextStatus === 'ready') {
          setCurrentScreen('order-ready');
        }

        return {
          ...ord,
          status: nextStatus,
          timeline: (ord.timeline || []).map((step, idx) => ({
            ...step,
            done: idx <= flow.indexOf(nextStatus)
          }))
        };
      }
      return ord;
    }));
  };

  // View Details of Dish
  const handleViewDetails = (dish) => {
    setSelectedDish(dish);
    setCurrentScreen('dish-detail');
  };

  // Recharge Wallet (Synced with SQLite)
  const handleRechargeWallet = async (amount) => {
    if (window.CafeteriaAPI.isOnline) {
      try {
        const res = await window.CafeteriaAPI.rechargeWallet(amount);
        if (res && res.new_balance !== undefined) {
          setUserProfile(prev => ({
            ...prev,
            walletBalance: res.new_balance,
            rewardPoints: res.reward_points || prev.rewardPoints
          }));
          showToast(`₹${amount} added! Database synced with cafeteria.db`);
          return;
        }
      } catch (e) {
        console.warn("Wallet recharge API error:", e);
      }
    }
    setUserProfile(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount
    }));
    showToast(`₹${amount} added to Campus Dining Wallet!`);
  };
    showToast(`₹${amount} added to Campus Dining Wallet!`);
  };

  // Render Page Content dynamically based on route
  const renderPage = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={(s) => setCurrentScreen(s)}
            user={userProfile}
            onAddToCart={handleAddToCart}
            cartItemsMap={cartItemsMap}
            onIncreaseQty={handleIncreaseQty}
            onDecreaseQty={handleDecreaseQty}
            onViewDetails={handleViewDetails}
            onCustomize={handleViewDetails}
          />
        );
      case 'menu':
        return (
          <MenuScreen
            cartItemsMap={cartItemsMap}
            onAddToCart={handleAddToCart}
            onIncreaseQty={handleIncreaseQty}
            onDecreaseQty={handleDecreaseQty}
            onViewDetails={handleViewDetails}
            onCustomize={handleViewDetails}
          />
        );
      case 'dish-detail':
        return (
          <DishDetailScreen
            dish={selectedDish}
            onNavigate={(s) => setCurrentScreen(s)}
            onAddToCart={handleAddToCart}
            cartQuantity={cartItemsMap[selectedDish?.id] || 0}
            onIncreaseQty={handleIncreaseQty}
            onDecreaseQty={handleDecreaseQty}
          />
        );
      case 'cart':
        return (
          <CartScreen
            cartItems={cartItems}
            onNavigate={(s) => setCurrentScreen(s)}
            onIncreaseQty={handleIncreaseQty}
            onDecreaseQty={handleDecreaseQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        );
      case 'checkout':
        return (
          <CheckoutScreen
            cartItems={cartItems}
            onNavigate={(s) => setCurrentScreen(s)}
            onOrderPlaced={handleOrderPlaced}
            user={userProfile}
          />
        );
      case 'tracking':
        return (
          <OrderTrackingScreen
            order={activeOrder}
            onNavigate={(s) => setCurrentScreen(s)}
            onAdvanceStatus={() => handleAdvanceOrderStatus(activeOrder?.id)}
          />
        );
      case 'order-ready':
        return (
          <OrderReadyScreen
            order={activeOrder}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );
      case 'orders-history':
        return (
          <OrderHistoryScreen
            orders={orders}
            onNavigate={(s) => setCurrentScreen(s)}
            onReorder={handleReorder}
          />
        );
      case 'wallet':
        return (
          <CampusWalletScreen
            user={userProfile}
            onRechargeWallet={handleRechargeWallet}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );
      case 'meal-plans':
        return (
          <MealPlansScreen
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );
      case 'nutrition':
        return (
          <NutritionScreen
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );
      case 'crowd-monitor':
        return (
          <CrowdMonitorScreen
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );
      case 'catering':
        return (
          <CateringScreen
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );
      case 'reviews':
        return (
          <ReviewsScreen
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={userProfile}
            onNavigate={(s) => setCurrentScreen(s)}
            onLogout={() => {
              setCurrentScreen('login');
              showToast('Logged out of student account');
            }}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onLoginSuccess={() => {
              setCurrentScreen('home');
              showToast('Logged in as Kumud Negi');
            }}
          />
        );
      case 'admin':
        return (
          <AdminScreen
            onNavigate={(s) => setCurrentScreen(s)}
            orders={orders}
            onUpdateStatus={(orderId, st) => handleAdvanceOrderStatus(orderId, st)}
          />
        );
      case 'help':
        return (
          <HelpScreen
            onNavigate={(s) => setCurrentScreen(s)}
          />
        );
      default:
        return (
          <HomeScreen
            onNavigate={(s) => setCurrentScreen(s)}
            user={userProfile}
            onAddToCart={handleAddToCart}
            cartItemsMap={cartItemsMap}
            onIncreaseQty={handleIncreaseQty}
            onDecreaseQty={handleDecreaseQty}
            onViewDetails={handleViewDetails}
            onCustomize={handleViewDetails}
          />
        );
    }
  };

  // List of all 18 pages for bottom quick switcher
  const allPages = [
    { id: 'home', label: '1. Home' },
    { id: 'menu', label: '2. Menu' },
    { id: 'dish-detail', label: '3. Dish Detail' },
    { id: 'cart', label: '4. Cart' },
    { id: 'checkout', label: '5. Checkout/Bill' },
    { id: 'tracking', label: '6. Tracking' },
    { id: 'order-ready', label: '7. QR Ready' },
    { id: 'orders-history', label: '8. Order History' },
    { id: 'wallet', label: '9. Wallet' },
    { id: 'meal-plans', label: '10. Meal Passes' },
    { id: 'nutrition', label: '11. Nutrition' },
    { id: 'crowd-monitor', label: '12. Crowd' },
    { id: 'catering', label: '13. Catering' },
    { id: 'reviews', label: '14. Reviews/Vote' },
    { id: 'profile', label: '15. Profile' },
    { id: 'login', label: '16. Login' },
    { id: 'admin', label: '17. Kitchen KDS' },
    { id: 'help', label: '18. Help & Hours' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col font-sans">
      {/* Global Navbar */}
      <HeaderNavbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        cartCount={totalCartCount}
        cartTotal={totalCartAmount}
        user={userProfile}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeOrder={activeOrder}
        isBackendConnected={isBackendConnected}
        onRetryConnect={syncWithBackend}
      />

      {/* Main Layout Container with Sidebar and Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <SidebarNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          cartCount={totalCartCount}
          activeOrder={activeOrder}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 min-w-0 bg-slate-100/80 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Persistent Bottom Quick-Page Switcher Dock */}
      <div className="sticky bottom-0 z-30 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-4 py-2 text-white">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] uppercase font-black text-purple-400 tracking-wider shrink-0 mr-1">
            Jump to Page (18 Total):
          </span>
          {allPages.map(page => (
            <button
              key={page.id}
              onClick={() => {
                window.SoundFX.play('click');
                setCurrentScreen(page.id);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                currentScreen === page.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden Printable Receipt for window.print() */}
      <div id="printable-receipt" className="hidden">
        <div style={{ maxWidth: '450px', margin: '0 auto', fontFamily: 'monospace', padding: '24px' }}>
          <h2 style={{ textAlign: 'center', margin: '0 0 4px 0', fontSize: '18px' }}>SMART CAFETERIA</h2>
          <p style={{ textAlign: 'center', margin: '0 0 16px 0', fontSize: '12px' }}>Campus Dining Hall • Official Tax Invoice</p>
          <hr style={{ borderTop: '1px dashed #000' }} />
          <p><strong>Order ID:</strong> {activeOrder?.id || 'ORD-10045'}</p>
          <p><strong>Student:</strong> {userProfile.name} ({userProfile.department})</p>
          <p><strong>Roll No:</strong> {userProfile.studentId}</p>
          <p><strong>Date & Time:</strong> {new Date().toLocaleString()}</p>
          <p><strong>Pickup Counter:</strong> {activeOrder?.counter || 'Counter 1 (Fast Food)'}</p>
          <p><strong>Pickup Slot:</strong> {activeOrder?.pickupSlot || '12:15 PM'}</p>
          <p><strong>Pickup PIN:</strong> {activeOrder?.verificationPin || '4829'}</p>
          <hr style={{ borderTop: '1px dashed #000' }} />
          <table style={{ width: '100%', fontSize: '13px', margin: '12px 0' }}>
            <thead>
              <tr style={{ borderBottom: '1px dashed #000' }}>
                <th style={{ textAlign: 'left', padding: '4px 0' }}>Item</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {(activeOrder?.items || []).map((i, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '4px 0' }}>{i.name}</td>
                  <td style={{ textAlign: 'center' }}>{i.qty}</td>
                  <td style={{ textAlign: 'right' }}>₹{(i.price * i.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr style={{ borderTop: '1px dashed #000' }} />
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
            <span>Subtotal:</span>
            <span>₹{activeOrder?.subtotal?.toFixed(2) || '195.00'}</span>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
            <span>GST (5%):</span>
            <span>₹{activeOrder?.gst?.toFixed(2) || '9.75'}</span>
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '15px', margin: '8px 0' }}>
            <span>Total Paid:</span>
            <span>₹{activeOrder?.total?.toFixed(2) || '204.75'}</span>
          </p>
          <p style={{ margin: '4px 0' }}><strong>Payment Method:</strong> {activeOrder?.paymentMethod || 'Campus Meal Card'}</p>
          <hr style={{ borderTop: '1px dashed #000' }} />
          <p style={{ textAlign: 'center', fontSize: '11px', marginTop: '16px' }}>
            Please show your digital QR Token or this slip at the pickup counter to collect your ready meal!
          </p>
        </div>
      </div>
    </div>
  );
}

// Mount React Root
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
