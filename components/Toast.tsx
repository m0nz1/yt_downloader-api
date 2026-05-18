'use client';

import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '@/types';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-neo-green text-white border-white',
  error: 'bg-neo-red text-white border-white',
  warning: 'bg-neo-yellow text-neo-black border-neo-black',
  info: 'bg-neo-blue text-white border-white',
};

export function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border-3 shadow-neo-lg toast-enter ${styles[toast.type]}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold flex-1">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
