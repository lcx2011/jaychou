import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, action?: { label: string; onClick: () => void }) => void;
  dismissToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, action?: { label: string; onClick: () => void }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, action }]);
    setTimeout(() => dismissToast(id), 4000);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
