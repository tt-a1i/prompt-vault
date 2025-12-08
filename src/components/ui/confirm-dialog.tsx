"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen || !mounted) return null;

  const isDanger = variant === "danger";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Scrim */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
      <div className="scrim absolute inset-0" onClick={onCancel} />

      {/* Dialog */}
      <div className="dialog relative w-full max-w-md mx-4 scale-in">
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-xl"
            style={{
              background: isDanger ? "hsl(var(--md-error) / 0.15)" : "hsl(45 100% 50% / 0.15)",
            }}
          >
            <AlertTriangle
              className="w-5 h-5"
              style={{
                color: isDanger ? "hsl(var(--md-error))" : "hsl(45 100% 40%)",
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-title-large mb-2" style={{ color: "hsl(var(--md-on-surface))" }}>
              {title}
            </h3>
            <p
              className="text-body-medium leading-relaxed"
              style={{ color: "hsl(var(--md-on-surface-variant))" }}
            >
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onCancel} className="btn-outlined flex-1">
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 font-medium text-label-large rounded-full transition-all duration-200"
            style={{
              background: isDanger ? "hsl(var(--md-error))" : "hsl(45 100% 45%)",
              color: isDanger ? "hsl(var(--md-on-error))" : "hsl(45 100% 10%)",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
