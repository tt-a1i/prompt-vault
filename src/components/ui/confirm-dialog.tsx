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
        className="absolute inset-0 bg-[hsl(var(--bg-dark)_/_0.8)] backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative card w-full max-w-md p-6 mx-4 slide-down">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl ${
              isDanger ? "bg-[hsl(var(--rose)_/_0.1)]" : "bg-[hsl(var(--amber)_/_0.1)]"
            }`}
          >
            <AlertTriangle
              className={`w-5 h-5 ${isDanger ? "text-[hsl(var(--rose))]" : "text-[hsl(var(--amber))]"}`}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[hsl(var(--text-dark-primary))] mb-2">
              {title}
            </h3>
            <p className="text-[hsl(var(--text-dark-muted))] text-sm">{message}</p>
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
                ? "bg-[hsl(var(--rose))] hover:bg-[hsl(var(--rose)_/_0.9)] text-white"
                : "bg-[hsl(var(--amber))] hover:bg-[hsl(var(--amber)_/_0.9)] text-[hsl(var(--bg-dark))]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
