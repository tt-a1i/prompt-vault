"use client";

import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { PromptCard } from "./prompt-card";
import { PromptForm } from "./prompt-form";

export function PromptList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<{
    id: string;
    title: string;
    content: string;
    description: string;
  } | null>(null);

  const promptsQuery = useQuery(trpc.prompt.list.queryOptions({ search: search || undefined }));

  const createMutation = useMutation(
    trpc.prompt.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
        setIsFormOpen(false);
      },
    })
  );

  const updateMutation = useMutation(
    trpc.prompt.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
        setEditingPrompt(null);
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.prompt.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
      },
    })
  );

  const toggleFavoriteMutation = useMutation(
    trpc.prompt.toggleFavorite.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
      },
    })
  );

  const handleCreate = (data: { title: string; content: string; description: string }) => {
    createMutation.mutate({
      title: data.title,
      content: data.content,
      description: data.description || undefined,
    });
  };

  const handleUpdate = (data: { title: string; content: string; description: string }) => {
    if (!editingPrompt) return;
    updateMutation.mutate({
      id: editingPrompt.id,
      title: data.title,
      content: data.content,
      description: data.description || undefined,
    });
  };

  const handleEdit = (id: string) => {
    const prompt = promptsQuery.data?.find((p) => p.id === id);
    if (prompt) {
      setEditingPrompt({
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        description: prompt.description || "",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个 Prompt 吗？")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteMutation.mutate({ id });
  };

  const prompts = promptsQuery.data ?? [];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-white">我的 Prompts</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索 Prompts..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            新建
          </button>
        </div>
      </div>

      {/* Content */}
      {promptsQuery.isLoading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">加载中...</p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {search ? "没有找到匹配的 Prompt" : "还没有 Prompt"}
          </h3>
          <p className="text-gray-400 mb-6">
            {search ? "试试其他搜索词" : "创建你的第一个 Prompt 开始使用"}
          </p>
          {!search && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              新建 Prompt
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              title={prompt.title}
              content={prompt.content}
              description={prompt.description}
              isFavorite={prompt.is_favorite}
              createdAt={new Date(prompt.created_at)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Create Form */}
      <PromptForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit Form */}
      <PromptForm
        isOpen={!!editingPrompt}
        onClose={() => setEditingPrompt(null)}
        onSubmit={handleUpdate}
        initialData={editingPrompt ?? undefined}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
