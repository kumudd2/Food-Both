// client/src/components/AuthModal.jsx
import React, { useState, useEffect } from 'react';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login', // 'login' | 'signup'
  initialRole = 'student', // 'student' | 'admin' | 'staff'
}) {
  const [mode, setMode] = useState(initialMode);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [useOtpLogin, setUseOtpLogin] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);

  // Signup form state (Mobile OTP + Name + Password)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [demoOtpNotice, setDemoOtpNotice] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isOpen) return null;

  // Handle Quick Demo Account Autofill
  const handleQuickDemo = (roleType) => {
    setErrorMessage('');
    setSuccessMessage('');
    if (roleType === 'student') {
      setSelectedRole('student');
      setLoginIdentifier('+91 98765 43210');
      setLoginPassword('student123');
      setUseOtpLogin(false);
    } else if (roleType === 'staff') {
      setSelectedRole('staff');
      setLoginIdentifier('ramesh.counter1@college.edu');
      setLoginPassword('staff123');
      setUseOtpLogin(false);
    } else if (roleType === 'admin') {
      setSelectedRole('admin');
      setLoginIdentifier('cafeteria.admin@college.edu');
      setLoginPassword('admin123');
      setUseOtpLogin(false);
    }
  };

  // Dispatch OTP for Signup or Login
  const handleSendOtp = async (targetPhone, isLoginMode = false) => {
    setErrorMessage('');
    setDemoOtpNotice('');

    if (!targetPhone || targetPhone.trim().length < 8) {
      setErrorMessage('Please enter a valid mobile phone number first.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: targetPhone.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP.');

      if (isLoginMode) {
        setLoginOtpSent(true);
      } else {
        setOtpSent(true);
      }
      setOtpTimer(60);
      setSuccessMessage(data.message || 'OTP sent to your mobile number!');
      if (data.demoOtp) {
        setDemoOtpNotice(`Your Verification OTP is: ${data.demoOtp}`);
        // Autofill for convenience
        if (isLoginMode) {
          setLoginOtp(data.demoOtp);
        } else {
          setOtp(data.demoOtp);
        }
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your mobile number or email.');
      return;
    }

    if (!useOtpLogin && !loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (useOtpLogin && !loginOtp.trim()) {
      setErrorMessage('Please enter the OTP sent to your phone.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
          otp: useOtpLogin ? loginOtp.trim() : null,
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      setSuccessMessage('Welcome back, ' + (data.user?.name || 'User') + '!');
      setTimeout(() => {
        onAuthSuccess(data);
        onClose();
      }, 500);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Signup (Mobile OTP + Name + Password)
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please enter your mobile phone number.');
      return;
    }
    if (!otp.trim()) {
      setErrorMessage('Please request and enter the Mobile OTP code.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          password: signupPassword,
          otp: otp.trim(),
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      setSuccessMessage(data.message || 'Account created successfully!');
      setTimeout(() => {
        onAuthSuccess(data);
        onClose();
      }, 800);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 flex flex-col my-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer text-sm font-bold"
          title="Close dialog"
        >
          ✕
        </button>

        {/* Brand Banner Header matching Design System */}
        <div className="relative w-full bg-gradient-to-br from-[#ab3500] via-[#c44307] to-amber-700 text-white p-6 sm:p-7 flex flex-col justify-end min-h-[160px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none"
            style={{ backgroundImage: "url('/burger.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          <div className="relative z-10 flex flex-col space-y-1.5">
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
              <span className="text-amber-200 text-xs">⚡</span>
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-100 font-display">
                Campus Pre-Order Hub
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-display text-white">
              {mode === 'login' ? 'Fuel your campus day, skip the lines.' : 'Quick Mobile Sign Up'}
            </h2>
            <p className="text-xs text-orange-100/90 max-w-md">
              {mode === 'login'
                ? 'Instant mobile ordering, kitchen queue status, and dining wallet integration.'
                : 'Sign up with Mobile OTP in 30 seconds. Complete university details in your profile later!'}
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="px-6 sm:px-7 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setDemoOtpNotice('');
              }}
              className={`pb-2 text-xs font-black transition relative cursor-pointer ${
                mode === 'login' ? 'text-slate-900 border-b-2 border-[#ab3500]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
                setDemoOtpNotice('');
              }}
              className={`pb-2 text-xs font-black transition relative cursor-pointer ${
                mode === 'signup' ? 'text-slate-900 border-b-2 border-[#ab3500]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Mobile Sign Up (New Account)
            </button>
          </div>

          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
            PostgreSQL Live
          </span>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-6 sm:px-7 pt-3 pb-1">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
            Account Type
          </label>
          <div className="bg-slate-100 p-1 rounded-2xl flex space-x-1">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-extrabold transition text-center cursor-pointer flex items-center justify-center space-x-1.5 ${
                selectedRole === 'student'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>🎓</span>
              <span>Student / Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole(selectedRole === 'admin' ? 'admin' : 'staff')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-extrabold transition text-center cursor-pointer flex items-center justify-center space-x-1.5 ${
                selectedRole === 'staff' || selectedRole === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>👨‍🍳</span>
              <span>Kitchen Staff / Admin</span>
            </button>
          </div>
        </div>

        {/* Alerts / Error & Success banners */}
        {errorMessage && (
          <div className="mx-6 sm:mx-7 mt-2.5 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 sm:mx-7 mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {demoOtpNotice && (
          <div className="mx-6 sm:mx-7 mt-2 p-2 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl text-xs font-mono font-black flex items-center justify-between animate-pop">
            <span>📱 {demoOtpNotice}</span>
            <span className="text-[10px] font-sans font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full">
              Auto-filled
            </span>
          </div>
        )}

        {/* FORM CONTENT */}
        <div className="p-6 sm:p-7 pt-3 max-h-[60vh] overflow-y-auto">
          {mode === 'login' ? (
            /* ======================================================== */
            /* SIGN IN FORM                                             */
            /* ======================================================== */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Quick 1-Click Demo Accounts Pill Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>⚡ Quick 1-Click Logins:</span>
                  <span className="text-slate-400">Click to autofill</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('student')}
                    className="py-1 px-2 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl text-[11px] font-extrabold text-slate-700 hover:text-[#ab3500] transition cursor-pointer text-left"
                  >
                    🎓 Student
                    <span className="block text-[9px] font-normal text-slate-400 truncate">+91 98765 43210</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('staff')}
                    className="py-1 px-2 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl text-[11px] font-extrabold text-slate-700 hover:text-[#ab3500] transition cursor-pointer text-left"
                  >
                    👨‍🍳 Kitchen
                    <span className="block text-[9px] font-normal text-slate-400 truncate">ramesh.counter1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="py-1 px-2 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl text-[11px] font-extrabold text-slate-700 hover:text-[#ab3500] transition cursor-pointer text-left"
                  >
                    👑 Admin
                    <span className="block text-[9px] font-normal text-slate-400 truncate">cafeteria.admin</span>
                  </button>
                </div>
              </div>

              {/* Login Method Toggle: Password vs OTP */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setUseOtpLogin(!useOtpLogin);
                    setErrorMessage('');
                  }}
                  className="text-[11px] font-bold text-[#ab3500] hover:underline cursor-pointer"
                >
                  {useOtpLogin ? '🔑 Sign in with Password instead' : '📲 Sign in with Mobile OTP instead'}
                </button>
              </div>

              {/* Mobile / Email Identifier */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700">Mobile Number or University Email</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#ab3500] focus-within:ring-2 focus-within:ring-orange-100 rounded-2xl px-3.5 py-2.5 transition">
                  <span className="text-slate-400 text-sm mr-2.5">📱</span>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or name@college.edu"
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                    required
                  />
                  {useOtpLogin && (
                    <button
                      type="button"
                      disabled={loading || otpTimer > 0}
                      onClick={() => handleSendOtp(loginIdentifier, true)}
                      className="ml-2 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {otpTimer > 0 ? `${otpTimer}s` : loginOtpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  )}
                </div>
              </div>

              {/* Password OR OTP input */}
              {useOtpLogin ? (
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700">Enter 6-digit Mobile OTP</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#ab3500] focus-within:ring-2 focus-within:ring-orange-100 rounded-2xl px-3.5 py-2.5 transition">
                    <span className="text-slate-400 text-sm mr-2.5">💬</span>
                    <input
                      type="text"
                      maxLength={6}
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value)}
                      placeholder="Enter 6-digit code (e.g. 123456)"
                      className="w-full bg-transparent text-xs font-mono font-bold tracking-widest text-slate-900 placeholder:text-slate-400 outline-none"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setLoginPassword('student123')}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      fill default pwd
                    </button>
                  </div>
                  <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#ab3500] focus-within:ring-2 focus-within:ring-orange-100 rounded-2xl px-3.5 py-2.5 transition">
                    <span className="text-slate-400 text-sm mr-2.5">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-700 text-xs font-semibold cursor-pointer ml-2"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-[#ab3500] hover:bg-[#8e2c00] active:scale-[0.99] text-white text-xs font-black shadow-lg shadow-orange-950/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In to FoodBooth</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-slate-500">
                  New student or customer?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage('');
                    }}
                    className="font-bold text-[#ab3500] hover:underline cursor-pointer"
                  >
                    Quick Mobile Sign Up (30s)
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* ======================================================== */
            /* MOBILE OTP SIGN UP FORM (NAME + PHONE + OTP + PASSWORD) */
            /* ======================================================== */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {/* Profile Details Can Be Added Later Callout */}
              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">📱</span>
                  <div>
                    <p className="text-xs font-black text-orange-950">Quick Mobile Sign Up</p>
                    <p className="text-[11px] text-orange-800">
                      Email, ID, department & meal preferences can be added later in your profile!
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700">Full Name</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#ab3500] focus-within:ring-2 focus-within:ring-orange-100 rounded-2xl px-3.5 py-2.5 transition">
                  <span className="text-slate-400 text-sm mr-2.5">👤</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                    required
                  />
                </div>
              </div>

              {/* 2. Mobile Number with "Send OTP" Button */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700">Mobile Number</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#ab3500] focus-within:ring-2 focus-within:ring-orange-100 rounded-2xl px-3.5 py-2.5 transition">
                  <span className="text-slate-400 text-sm mr-2.5">📱</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                    required
                  />
                  <button
                    type="button"
                    disabled={loading || otpTimer > 0 || !phone.trim()}
                    onClick={() => handleSendOtp(phone, false)}
                    className="ml-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {otpTimer > 0 ? `Resend (${otpTimer}s)` : otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {/* 3. Mobile OTP Code Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-700">Enter 6-Digit Mobile OTP</label>
                  {otpSent && (
                    <span className="text-[10px] text-emerald-600 font-bold">
                      ✓ OTP sent to {phone}
                    </span>
                  )}
                </div>
                <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#ab3500] focus-within:ring-2 focus-within:ring-orange-100 rounded-2xl px-3.5 py-2.5 transition">
                  <span className="text-slate-400 text-sm mr-2.5">💬</span>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="w-full bg-transparent text-xs font-mono font-bold tracking-widest text-slate-900 placeholder:text-slate-400 outline-none"
                    required
                  />
                </div>
              </div>

              {/* 4. Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700">Create Password</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#ab3500] focus-within:ring-2 focus-within:ring-orange-100 rounded-2xl px-3.5 py-2.5 transition">
                    <span className="text-slate-400 text-sm mr-2.5">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700">Confirm Password</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-[#ab3500] focus-within:ring-2 focus-within:ring-orange-100 rounded-2xl px-3.5 py-2.5 transition">
                    <span className="text-slate-400 text-sm mr-2.5">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-[#ab3500] hover:bg-[#8e2c00] active:scale-[0.99] text-white text-xs font-black shadow-lg shadow-orange-950/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Verify & Create Account</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <div className="text-center pt-0.5">
                <p className="text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                    }}
                    className="font-bold text-[#ab3500] hover:underline cursor-pointer"
                  >
                    Sign In instead
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
