import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-xs sm:text-sm font-medium transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-[#063D29] text-white border-[#075C35]'
                : isError
                ? 'bg-red-700 text-white border-red-800'
                : 'bg-stone-900 text-white border-stone-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#E8C928] flex-shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-200 flex-shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-stone-300 flex-shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-3 p-1 text-white/60 hover:text-white rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
