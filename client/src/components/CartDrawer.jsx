// client/src/components/CartDrawer.jsx
import React from 'react';
import { PICKUP_SLOTS, PROMO_CODES } from '../data/mockData';
import { BagIcon, TrashIcon, CloseIcon, PlusIcon, MinusIcon } from './Icons';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onIncreaseQty,
  onDecreaseQty,
  onRemoveItem,
  onClearCart,
  walletBalance,
  onPlaceOrder,
}) {
  const [selectedSlot, setSelectedSlot] = React.useState(PICKUP_SLOTS[0].label);
  const [promoInput, setPromoInput] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState(null);
  const [promoError, setPromoError] = React.useState('');
  const [specialInstructions, setSpecialInstructions] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('Campus Meal Card');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Calculations
  const subtotal = React.useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  }, [cartItems]);

  const gst = React.useMemo(() => {
    return +(subtotal * 0.05).toFixed(2);
  }, [subtotal]);

  const discount = React.useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discount) return appliedPromo.discount;
    if (appliedPromo.percent) {
      const d = (subtotal * appliedPromo.percent) / 100;
      return Math.min(d, appliedPromo.maxDiscount || 999);
    }
    return 0;
  }, [appliedPromo, subtotal]);

  const grandTotal = Math.max(0, +(subtotal + gst - discount).toFixed(2));

  // Apply Coupon
  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const found = PROMO_CODES[code];
    if (!found) {
      setPromoError('Invalid coupon. Try CAMPUS50 or STUDENT10');
      return;
    }
    if (found.minOrder && subtotal < found.minOrder) {
      setPromoError(`Minimum order amount for ${code} is ₹${found.minOrder}`);
      return;
    }
    setAppliedPromo({ code, ...found });
    setPromoInput('');
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (paymentMethod === 'Campus Meal Card' && walletBalance < grandTotal) {
      alert(`Insufficient Campus Wallet balance (Current: ₹${walletBalance}). Please recharge or select UPI/Cash!`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onPlaceOrder({
        items: cartItems,
        subtotal,
        gst,
        discount,
        total: grandTotal,
        pickupSlot: selectedSlot,
        counter: cartItems[0]?.counter || 'Counter 1 (Fast Food)',
        specialInstructions,
        paymentMethod,
      });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity animate-fade-in"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slide-in-right">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <BagIcon className="w-5 h-5 text-slate-800" />
              <div>
                <h2 className="font-black text-slate-900 text-sm">Your Food Tray</h2>
                <span className="text-xs text-slate-500 font-medium">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items selected
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-slate-400 hover:text-rose-600 font-bold px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <BagIcon className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">Your tray is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Add items from the menu to schedule your pre-order pickup.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Selected Dishes
                  </span>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                          onError={(e) => { e.target.src = '/burger.jpg'; }}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-black text-[#ab3500]">
                            ₹{item.price} each
                          </span>
                        </div>
                      </div>

                      {/* Stepper & Delete */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => onDecreaseQty(item.id)}
                            className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center text-xs"
                          >
                            <MinusIcon className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-bold text-xs px-1 text-slate-800 min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onIncreaseQty(item.id)}
                            className="w-5 h-5 rounded-md bg-[#ab3500] hover:bg-[#8f2c00] text-white flex items-center justify-center text-xs"
                          >
                            <PlusIcon className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove item"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pickup Slot */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Pickup Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    {PICKUP_SLOTS.map((s) => (
                      <option key={s.id} value={s.label}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cooking Instructions */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Cooking Instructions
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Less spicy, extra chutney"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>

                {/* Promo Code Box */}
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                    Promo Voucher
                  </span>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <span className="font-bold text-[#ab3500]">
                        {appliedPromo.code} (-₹{discount})
                      </span>
                      <button
                        onClick={handleRemovePromo}
                        className="text-xs text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="e.g. CAMPUS50"
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono uppercase font-bold text-slate-800 focus:outline-hidden"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-rose-600 font-bold">{promoError}</p>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Payment Method
                  </span>
                  <div className="space-y-1.5">
                    {[
                      {
                        id: 'Campus Meal Card',
                        label: 'Campus Meal Card (1-Click)',
                        sub: `Balance: ₹${walletBalance} · 10% Points Back`,
                      },
                      {
                        id: 'UPI Pre-Payment',
                        label: 'UPI Pre-Payment',
                        sub: 'Pay online via GPay, PhonePe, Paytm',
                      },
                      {
                        id: 'Pay at Counter',
                        label: 'Cash on Pickup',
                        sub: 'Pay at counter when picking up meal',
                      },
                    ].map((m) => (
                      <label
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                          paymentMethod === m.id
                            ? 'bg-rose-50/50 border-[#ab3500] ring-1 ring-[#ab3500]'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === m.id}
                          onChange={() => setPaymentMethod(m.id)}
                          className="mt-0.5 text-[#ab3500] focus:ring-[#ab3500]"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-xs text-slate-900 block leading-tight">
                            {m.label}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {m.sub}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (5%):</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount:</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                    <span>Total:</span>
                    <span className="text-base text-[#ab3500]">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer CTA */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full py-3 bg-[#ab3500] hover:bg-[#8f2c00] active:scale-98 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                {isSubmitting ? 'Confirming Order...' : `Confirm & Pre-Order • ₹${grandTotal.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
