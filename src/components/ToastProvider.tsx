"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-[#FFFEF9] border border-[#DDDCCF] text-[#292E28] p-3.5 rounded-xl shadow-lg flex items-center gap-3 transition-transform duration-200 transform translate-y-0 scale-100 animate-in fade-in slide-in-from-bottom-2"
          >
            {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#244B36] shrink-0" />}
            {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {t.type === "info" && <Info className="w-5 h-5 text-[#A8B9A0] shrink-0" />}
            <span className="font-sans text-sm leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
