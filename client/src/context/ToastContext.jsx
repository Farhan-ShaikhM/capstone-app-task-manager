import { useCallback, useState } from "react";
import { ToastContext } from "./ToastContextValue";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((previousToasts) => previousToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((previousToasts) => [...previousToasts, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  const toast = {
    success: (message) => addToast(message, "success"),
    error: (message) => addToast(message, "error"),
    info: (message) => addToast(message, "info")
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((toastItem) => (
          <div key={toastItem.id} className={`toast toast-${toastItem.type}`}>
            <span>{toastItem.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toastItem.id)}
              aria-label="Dismiss notification"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

