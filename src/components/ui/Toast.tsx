import { useToast } from '../../context/ToastContext';

export default function Toast() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-stone-800 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-4 animate-slide-up text-sm max-w-sm"
        >
          <span className="flex-1">{toast.message}</span>
          <div className="flex items-center gap-2">
            {toast.action && (
              <button
                onClick={() => { toast.action!.onClick(); dismissToast(toast.id); }}
                className="text-amber-400 hover:text-amber-300 font-bold text-sm underline cursor-pointer transition"
              >
                {toast.action.label}
              </button>
            )}
            <button onClick={() => dismissToast(toast.id)} className="text-stone-400 hover:text-white cursor-pointer transition">&times;</button>
          </div>
        </div>
      ))}
    </div>
  );
}
