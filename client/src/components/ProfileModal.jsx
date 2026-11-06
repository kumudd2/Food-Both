// client/src/components/ProfileModal.jsx
import React, { useState, useEffect } from 'react';

export default function ProfileModal({ isOpen, onClose, user, onUpdateProfile }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('veg');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email?.includes('@foodbooth.campus') ? '' : user.email || '');
      setPhone(user.phone || '');
      setStudentId(user.studentId?.startsWith('STU-') ? user.studentId : '');
      setDepartment(user.department?.includes('To be') ? '' : user.department || '');
      setDietaryPreference(user.dietaryPreference || 'veg');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          studentId: studentId.trim() || user.studentId,
          department: department.trim() || 'General Studies',
          dietaryPreference,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setMessage(data.message || 'Profile saved successfully!');
      if (onUpdateProfile && data.user) {
        onUpdateProfile(data.user);
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col my-auto relative">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ab3500] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              👤
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight font-display">Campus Profile Details</h3>
              <p className="text-xs text-slate-300">Complete your student & dining preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
              <span>✅</span>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ab3500] focus:ring-2 focus:ring-orange-100 rounded-2xl text-xs font-semibold text-slate-900 outline-none"
              required
            />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700">Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ab3500] focus:ring-2 focus:ring-orange-100 rounded-2xl text-xs font-semibold text-slate-900 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700">University Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@college.edu"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ab3500] focus:ring-2 focus:ring-orange-100 rounded-2xl text-xs font-semibold text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Student Roll & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700">Student Roll / ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. STU-2024-8842"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ab3500] focus:ring-2 focus:ring-orange-100 rounded-2xl text-xs font-semibold text-slate-900 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-700">Department / Major</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. CSE - 2nd Year"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ab3500] focus:ring-2 focus:ring-orange-100 rounded-2xl text-xs font-semibold text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Dietary Preference */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700">Dietary Preference</label>
            <div className="grid grid-cols-3 gap-2">
              {['veg', 'non_veg', 'vegan'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDietaryPreference(d)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition capitalize cursor-pointer border ${
                    dietaryPreference === d
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d === 'veg' ? '🥗 Veg' : d === 'non_veg' ? '🍗 Non-Veg' : '🌱 Vegan'}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-[#ab3500] hover:bg-[#8e2c00] text-white text-xs font-black shadow-lg shadow-orange-950/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
