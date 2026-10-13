import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage, dismissToast } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#0F3932] text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-800/40 flex items-center justify-between gap-3 text-sm animate-fade-in">
      <div className="flex items-center gap-2.5">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="font-medium text-emerald-50 text-xs sm:text-sm">{toastMessage}</span>
      </div>
      <button
        onClick={dismissToast}
        className="text-emerald-300 hover:text-white p-1 rounded-md"
        aria-label="Dismiss message"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
