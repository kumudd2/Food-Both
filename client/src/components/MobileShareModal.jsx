// client/src/components/MobileShareModal.jsx
import React, { useState, useEffect } from 'react';

export default function MobileShareModal({ isOpen, onClose }) {
  const [networkInfo, setNetworkInfo] = useState({
    networkUrl: window.location.origin,
    localUrl: 'http://localhost:3000',
    ip: window.location.hostname,
    port: window.location.port || '3000',
    qrCodeDataUrl: null,
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/network-info')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.networkUrl) {
          setNetworkInfo(data);
        }
      })
      .catch(() => {
        // Fallback using browser's current host
        const port = window.location.port || '3000';
        const hostname = window.location.hostname === 'localhost' ? '10.236.14.111' : window.location.hostname;
        setNetworkInfo({
          networkUrl: `http://${hostname}:${port}`,
          localUrl: window.location.origin,
          ip: hostname,
          port,
          qrCodeDataUrl: null,
        });
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(networkInfo.networkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ab3500] text-white flex items-center justify-center shadow-lg shadow-orange-950/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight font-display">Open on Mobile Devices</h3>
              <p className="text-xs text-slate-300">Scan QR or share the network link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* QR Code Frame */}
          <div className="p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl mb-4 relative flex items-center justify-center min-h-[220px] min-w-[220px]">
            {loading ? (
              <div className="flex flex-col items-center space-y-2 text-slate-400">
                <div className="w-8 h-8 border-3 border-[#ab3500] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold">Generating QR Code...</span>
              </div>
            ) : networkInfo.qrCodeDataUrl ? (
              <img
                src={networkInfo.qrCodeDataUrl}
                alt="QR Code to open on mobile"
                className="w-52 h-52 object-contain rounded-lg shadow-xs"
              />
            ) : (
              <div className="w-52 h-52 bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-bold p-4">
                Scan link below
              </div>
            )}
          </div>

          {/* Wi-Fi Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Connect to same Wi-Fi network</span>
          </div>

          {/* Network URL Box */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between mb-4">
            <div className="text-left overflow-hidden mr-2">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Device URL</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono select-all truncate block">
                {networkInfo.networkUrl}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
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
          <div className="w-full text-left bg-orange-50/60 border border-orange-100 rounded-2xl p-3.5 text-xs text-orange-900 space-y-1">
            <p className="font-extrabold flex items-center space-x-1.5">
              <span>💡</span>
              <span>How to test on phone or tablet:</span>
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-orange-800/90 pl-1">
              <li>Ensure your phone is connected to the same Wi-Fi router.</li>
              <li>Open your phone's Camera app and point it at the QR code above.</li>
              <li>Tap the pop-up link to open FoodBooth instantly in Safari / Chrome!</li>
            </ol>
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
