import { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "default") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="toast-container">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.type}`}>
              <span className="material-icons-round" style={{ fontSize: "1.1rem" }}>
                {t.type === "success" ? "check_circle" : t.type === "error" ? "error" : "info"}
              </span>
              {t.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
