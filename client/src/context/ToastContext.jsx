import React, { createContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast container overlay */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-slide-in transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800/80'
                : toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800/80'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 text-amber-200 border-amber-800/80'
                : 'bg-navy-900/90 text-navy-200 border-navy-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl shrink-0">
                {toast.type === 'success' && <FiCheckCircle className="text-emerald-400" />}
                {toast.type === 'error' && <FiAlertCircle className="text-rose-400" />}
                {toast.type === 'warning' && <FiAlertCircle className="text-amber-400" />}
                {toast.type === 'info' && <FiInfo className="text-brand-400" />}
              </span>
              <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-navy-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 shrink-0"
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
