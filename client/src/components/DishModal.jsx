// client/src/components/DishModal.jsx
import React from 'react';
import { CloseIcon, ClockIcon, StarIcon, CheckIcon } from './Icons';

export default function DishModal({
  dish,
  isOpen,
  onClose,
  onAddToCart,
}) {
  const [portion, setPortion] = React.useState('Regular');
  const [selectedAddons, setSelectedAddons] = React.useState([]);
  const [spiceLevel, setSpiceLevel] = React.useState('Medium');

  if (!isOpen || !dish) return null;

  const addonOptions = [
    { id: 'cheese', name: 'Extra Cheddar Cheese Slice', price: 25 },
    { id: 'periperi', name: 'Fiery Peri-Peri Dip', price: 20 },
    { id: 'combo', name: 'Upgrade to Meal Combo (Fries + Soda)', price: 65 },
  ];

  const handleToggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const calculatedPrice =
    dish.price +
    (portion === 'Meal Combo' ? 60 : 0) +
    selectedAddons.reduce((acc, id) => {
      const a = addonOptions.find((x) => x.id === id);
      return acc + (a ? a.price : 0);
    }, 0);

  const handleConfirm = () => {
    onAddToCart({
      ...dish,
      price: calculatedPrice,
      customization: {
        portion,
        spiceLevel,
        addons: selectedAddons,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs animate-fade-in" onClick={onClose}></div>

      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl z-10 max-h-[92vh] sm:max-h-[90vh] flex flex-col animate-scale-up">
        {/* Header Image */}
        <div className="relative h-52 bg-slate-100">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/burger.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ab3500] px-2 py-0.5 rounded-full">
              {dish.counter}
            </span>
            <h2 className="text-lg font-black mt-1">{dish.name}</h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Description & Macros */}
          <div>
            <p className="text-xs text-slate-600 leading-relaxed">{dish.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-slate-600">
              {dish.calories ? (
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg">{dish.calories} kcal</span>
              ) : null}
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                <ClockIcon className="w-3 h-3 text-slate-400" />
                <span>{dish.prepTime}</span>
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                <StarIcon className="w-3 h-3 text-amber-500" />
                <span>{dish.rating}</span>
              </span>
            </div>
          </div>

          {/* Spice Level */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Spice Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Mild', 'Medium', 'Hot & Spicy'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSpiceLevel(lvl)}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                    spiceLevel === lvl
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Add-on Upgrades */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Add-ons
            </label>
            <div className="space-y-1.5">
              {addonOptions.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    onClick={() => handleToggleAddon(addon.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      isChecked
                        ? 'bg-rose-50/60 border-[#ab3500] text-slate-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-[#ab3500] focus:ring-[#ab3500]"
                      />
                      <span>{addon.name}</span>
                    </div>
                    <span className="font-black text-[#ab3500]">+₹{addon.price}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Total</span>
            <span className="text-base font-black text-slate-900">₹{calculatedPrice}</span>
          </div>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 bg-[#ab3500] hover:bg-[#8f2c00] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Add to Tray • ₹{calculatedPrice}
          </button>
        </div>
      </div>
    </div>
  );
}
