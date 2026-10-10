"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import clsx from "clsx";

export type ToastTone = "success" | "error" | "info" | "warning";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
};

type ToastContextValue = {
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toneStyles: Record<ToastTone, string> = {
  success: "border-emerald-400/40 text-emerald-50",
  error: "border-rose-400/40 text-rose-50",
  info: "border-sky-400/40 text-sky-50",
  warning: "border-amber-400/40 text-amber-50",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setItems((prev) => [...prev, { ...toast, id }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-3">
        {items.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              "pointer-events-auto overflow-hidden rounded-2xl border px-4 py-3 shadow-2xl",
              "backdrop-blur-2xl",
              "ring-1 ring-white/25",
              "animate-[toastIn_0.35s_ease-out]",
              toneStyles[toast.tone ?? "info"]
            )}
            style={{
              background:
                "linear-gradient(145deg, rgba(18,28,22,0.78), rgba(28,42,36,0.62))",
              boxShadow:
                "0 12px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.28)",
            }}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white drop-shadow">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-xs text-white/80">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-md px-1 text-white/70 hover:text-white"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
