"use client";

import { extractVariables } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; description: string }) => void;
  initialData?: {
    title: string;
    content: string;
    description: string;
  };
  isLoading?: boolean;
}

export function PromptForm({ isOpen, onClose, onSubmit, initialData, isLoading }: PromptFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset form when modal opens/closes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setDescription(initialData.description);
    } else {
      setTitle("");
      setContent("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  const variables = extractVariables(content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, description });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {initialData ? "编辑 Prompt" : "新建 Prompt"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1.5">
              标题 *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给你的 Prompt 起个名字"
              required
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1.5">
              描述
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单描述这个 Prompt 的用途"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1.5">
              内容 *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入你的 Prompt 内容，使用 {{变量名}} 定义变量"
              required
              rows={8}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm resize-none"
            />
          </div>

          {variables.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">检测到的变量:</p>
              <div className="flex flex-wrap gap-1.5">
                {variables.map((v) => (
                  <span
                    key={v}
                    className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 text-sm rounded-full"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
