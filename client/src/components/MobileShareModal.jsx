// client/src/components/MobileShareModal.jsx
import React, { useState, useEffect } from 'react';

export default function MobileShareModal({ isOpen, onClose }) {
  const [networkInfo, setNetworkInfo] = useState({
    networkUrl: window.location.origin,
    localUrl: 'http://localhost:3000',
    publicUrl: null,
    ip: window.location.hostname,
    port: window.location.port || '3000',
    qrCodeDataUrl: null,
    publicQrCode: null,
  });
  const [activeTab, setActiveTab] = useState('public'); // 'public' | 'wifi'
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/network-info')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setNetworkInfo(data);
          // If publicUrl is available, default to public, otherwise fallback to wifi
          if (!data.publicUrl) {
            setActiveTab('wifi');
          } else {
            setActiveTab('public');
          }
        }
      })
      .catch(() => {
        const port = window.location.port || '3000';
        const hostname = window.location.hostname === 'localhost' ? '192.168.29.219' : window.location.hostname;
        setNetworkInfo({
          networkUrl: `http://${hostname}:${port}`,
          localUrl: window.location.origin,
          publicUrl: null,
          ip: hostname,
          port,
          qrCodeDataUrl: null,
          publicQrCode: null,
        });
        setActiveTab('wifi');
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = activeTab === 'public' && networkInfo.publicUrl
    ? networkInfo.publicUrl
    : networkInfo.networkUrl;

  const currentQr = activeTab === 'public' && networkInfo.publicQrCode
    ? networkInfo.publicQrCode
    : networkInfo.qrCodeDataUrl;

  const handleCopy = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 pb-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ab3500] text-white flex items-center justify-center shadow-lg shadow-orange-950/20">
              <span className="text-lg">📱</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight font-display">Open on Any Device</h3>
              <p className="text-xs text-slate-300">Scan QR or share the link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-4 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('public')}
            className={`flex-1 py-2 px-3 rounded-t-xl text-xs font-black transition flex items-center justify-center space-x-1.5 border-t border-x ${
              activeTab === 'public'
                ? 'bg-white text-slate-900 border-slate-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            <span>🌐</span>
            <span>Anywhere (Public)</span>
          </button>

          <button
            onClick={() => setActiveTab('wifi')}
            className={`flex-1 py-2 px-3 rounded-t-xl text-xs font-black transition flex items-center justify-center space-x-1.5 border-t border-x ${
              activeTab === 'wifi'
                ? 'bg-white text-slate-900 border-slate-200 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 border-transparent'
            }`}
          >
            <span>📶</span>
            <span>Same Wi-Fi / LAN</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Status Badge */}
          {activeTab === 'public' ? (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Works on Any Mobile Data & External Wi-Fi</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200 mb-3">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span>Works on Same Router (Even without internet)</span>
            </div>
          )}

          {/* QR Code Frame */}
          <div className="p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl mb-4 relative flex items-center justify-center min-h-[210px] min-w-[210px]">
            {loading ? (
              <div className="flex flex-col items-center space-y-2 text-slate-400">
                <div className="w-8 h-8 border-3 border-[#ab3500] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold">Generating QR Code...</span>
              </div>
            ) : currentQr ? (
              <img
                src={currentQr}
                alt="QR Code"
                className="w-48 h-48 object-contain rounded-lg shadow-xs"
              />
            ) : (
              <div className="w-48 h-48 bg-slate-100 rounded-lg flex flex-col items-center justify-center text-xs text-slate-500 font-bold p-3">
                <span className="text-2xl mb-1">🔗</span>
                <span>Use link below</span>
              </div>
            )}
          </div>

          {/* URL Box */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between mb-3">
            <div className="text-left overflow-hidden mr-2">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                {activeTab === 'public' ? 'Global HTTPS URL' : 'Local Network URL'}
              </span>
              <span className="text-xs font-extrabold text-slate-900 font-mono select-all truncate block">
                {currentUrl || 'Connecting...'}
              </span>
            </div>
            <button
              onClick={handleCopy}
              disabled={!currentUrl}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer disabled:opacity-50'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Instructions */}
          <div className="w-full text-left bg-orange-50/70 border border-orange-100 rounded-2xl p-3 text-xs text-orange-950 space-y-1">
            <p className="font-extrabold flex items-center space-x-1.5 text-xs text-[#ab3500]">
              <span>💡</span>
              <span>{activeTab === 'public' ? 'No Wi-Fi Sharing Needed:' : 'Local Wi-Fi Mode:'}</span>
            </p>
            {activeTab === 'public' ? (
              <p className="text-[11px] text-orange-900/90 leading-relaxed">
                Open this URL or scan this QR code from <strong>any phone, laptop, or desktop</strong> connected to cellular 4G/5G or any other network anywhere in the world!
              </p>
            ) : (
              <p className="text-[11px] text-orange-900/90 leading-relaxed">
                Both devices must be on the same Wi-Fi router or phone mobile hotspot. Works entirely offline without active internet.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
