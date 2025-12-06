"use client";

import { extractVariables } from "@/lib/utils";
import { Copy, Edit, Heart, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

interface PromptCardProps {
  id: string;
  title: string;
  content: string;
  description?: string | null;
  isFavorite: boolean;
  createdAt: Date;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function PromptCard({
  id,
  title,
  content,
  description,
  isFavorite,
  onEdit,
  onDelete,
  onToggleFavorite,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const variables = extractVariables(content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white truncate flex-1">{title}</h3>
        <div className="flex items-center gap-2 ml-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isFavorite
                ? "text-red-500 bg-red-500/10"
                : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-20 bg-gray-700 rounded-lg shadow-lg py-1 min-w-[120px]">
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {description && <p className="text-sm text-gray-400 mb-3 line-clamp-2">{description}</p>}

      <div className="bg-gray-900/50 rounded-lg p-3 mb-3">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-4 font-mono">
          {content}
        </pre>
      </div>

      {variables.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {variables.map((v) => (
            <span
              key={v}
              className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full"
            >
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <Copy className="w-4 h-4" />
        {copied ? "已复制!" : "复制"}
      </button>
    </div>
  );
}
