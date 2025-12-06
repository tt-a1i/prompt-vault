"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "确定",
  cancelText = "取消",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
      <div
        className="absolute inset-0 bg-[hsl(var(--bg-primary)_/_0.8)] backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative card w-full max-w-md p-6 mx-4 slide-down">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${isDanger ? "bg-rose-400/10" : "bg-amber-400/10"}`}>
            <AlertTriangle className={`w-5 h-5 ${isDanger ? "text-rose-400" : "text-amber-400"}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-display font-semibold text-[hsl(var(--text-primary))] mb-2">
              {title}
            </h3>
            <p className="text-[hsl(var(--text-muted))] text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 font-medium text-sm rounded-xl transition-all duration-200 ${
              isDanger
                ? "bg-rose-500 hover:bg-rose-500/90 text-white shadow-lg shadow-rose-500/20"
                : "bg-amber-500 hover:bg-amber-500/90 text-[hsl(var(--bg-primary))] shadow-lg shadow-amber-500/20"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
