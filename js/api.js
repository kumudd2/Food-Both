// Smart Cafeteria Frontend-to-Backend API Client
// Connects the React UI to the Python Flask REST API & SQLite Database (cafeteria.db)

window.CafeteriaAPI = {
  // Automatically choose endpoint: relative /api if served by Flask, otherwise absolute localhost
  baseUrl: window.location.origin.includes(':5000') ? '/api' : 'http://127.0.0.1:5000/api',
  isOnline: false,
  statusListeners: [],

  onStatusChange(cb) {
    this.statusListeners.push(cb);
  },

  notifyStatus(status) {
    this.isOnline = status;
    this.statusListeners.forEach(cb => {
      try { cb(status); } catch (e) {}
    });
  },

  async init() {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET', mode: 'cors' });
      if (res.ok) {
        const data = await res.json();
        this.notifyStatus(true);
        console.log("🟢 Connected to Python Flask Backend & SQLite (cafeteria.db):", data);
        return true;
      }
    } catch (e) {
      this.notifyStatus(false);
      console.log("🟡 Flask backend offline or disconnected. Running in client-side state mode.");
      return false;
    }
  },

  async getMenu(params = {}) {
    if (!this.isOnline) return window.CafeteriaData.foodItems;
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${this.baseUrl}/menu?${qs}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return (data.items && data.items.length) ? data.items : window.CafeteriaData.foodItems;
    } catch (e) {
      return window.CafeteriaData.foodItems;
    }
  },

  async getCategories() {
    if (!this.isOnline) return window.CafeteriaData.categories;
    try {
      const res = await fetch(`${this.baseUrl}/categories`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.categories || window.CafeteriaData.categories;
    } catch (e) {
      return window.CafeteriaData.categories;
    }
  },

  async getPickupSlots() {
    if (!this.isOnline) return window.CafeteriaData.pickupSlots;
    try {
      const res = await fetch(`${this.baseUrl}/slots`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.slots || window.CafeteriaData.pickupSlots;
    } catch (e) {
      return window.CafeteriaData.pickupSlots;
    }
  },

  async createOrder(payload) {
    if (!this.isOnline) {
      console.log("Offline mode: creating local mock order");
      return null;
    }
    try {
      const res = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.order;
    } catch (e) {
      console.error("Failed to place order to Flask backend:", e);
      return null;
    }
  },

  async getOrders(userId = null) {
    if (!this.isOnline) return window.CafeteriaData.defaultOrders;
    try {
      const url = userId ? `${this.baseUrl}/orders?user_id=${userId}` : `${this.baseUrl}/orders`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return (data.orders && data.orders.length) ? data.orders : window.CafeteriaData.defaultOrders;
    } catch (e) {
      return window.CafeteriaData.defaultOrders;
    }
  },

  async updateOrderStatus(orderId, status) {
    if (!this.isOnline) return { order_id: orderId, status };
    try {
      const res = await fetch(`${this.baseUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.order;
    } catch (e) {
      console.error("Failed to update status on Flask backend:", e);
      return null;
    }
  },

  async getWallet(userId = null) {
    if (!this.isOnline) return null;
    try {
      const url = userId ? `${this.baseUrl}/wallet?user_id=${userId}` : `${this.baseUrl}/wallet`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.wallet;
    } catch (e) {
      return null;
    }
  },

  async rechargeWallet(amount, mode = 'UPI Gateway') {
    if (!this.isOnline) return { success: true, new_balance: 480 + amount };
    try {
      const res = await fetch(`${this.baseUrl}/wallet/recharge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, mode })
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      console.error("Failed to recharge wallet on Flask backend:", e);
      return null;
    }
  },

  async login(email, password = 'password123', provider = 'credentials') {
    if (!this.isOnline) {
      return {
        success: true,
        user: window.CafeteriaData.userProfile
      };
    }
    try {
      const res = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, provider })
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  async getAdminStats() {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.baseUrl}/admin/stats`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.stats;
    } catch (e) {
      return null;
    }
  },

  async getKitchenQueue() {
    if (!this.isOnline) return null;
    try {
      const res = await fetch(`${this.baseUrl}/admin/kitchen-queue`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.queue;
    } catch (e) {
      return null;
    }
  }
};

// Initialize connection on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.CafeteriaAPI.init();
});
