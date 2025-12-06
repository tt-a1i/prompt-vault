"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Plus, Search, Tag as TagIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PromptCard } from "./prompt-card";
import { PromptForm } from "./prompt-form";
import { PromptSkeletonGrid } from "./prompt-skeleton";

interface Tag {
  id: string;
  name: string;
  color: string;
}

export function PromptList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<{
    id: string;
    title: string;
    content: string;
    description: string;
    tagIds: string[];
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // New tag creation state
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const promptsQuery = useQuery(trpc.prompt.list.queryOptions({ search: search || undefined }));
  const tagsQuery = useQuery(trpc.tag.list.queryOptions());

  const createMutation = useMutation(
    trpc.prompt.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
        setIsFormOpen(false);
        toast.success("Prompt 创建成功");
      },
      onError: (error) => {
        toast.error(`创建失败: ${error.message}`);
      },
    })
  );

  const updateMutation = useMutation(
    trpc.prompt.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
        setEditingPrompt(null);
        toast.success("Prompt 更新成功");
      },
      onError: (error) => {
        toast.error(`更新失败: ${error.message}`);
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.prompt.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
        setDeleteTarget(null);
        toast.success("Prompt 已删除");
      },
      onError: (error) => {
        toast.error(`删除失败: ${error.message}`);
      },
    })
  );

  const toggleFavoriteMutation = useMutation(
    trpc.prompt.toggleFavorite.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: trpc.prompt.list.queryKey() });
        toast.success(data.is_favorite ? "已添加到收藏" : "已取消收藏");
      },
      onError: (error) => {
        toast.error(`操作失败: ${error.message}`);
      },
    })
  );

  const createTagMutation = useMutation(
    trpc.tag.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.tag.list.queryKey() });
        setIsCreatingTag(false);
        setNewTagName("");
        toast.success("标签创建成功");
      },
      onError: (error) => {
        toast.error(`创建标签失败: ${error.message}`);
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
        tagIds: prompt.tags?.map((t: Tag) => t.id) || [],
      });
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate({ id: deleteTarget });
    }
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteMutation.mutate({ id });
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      createTagMutation.mutate({ name: newTagName.trim() });
    }
  };

  // Filter prompts
  const allPrompts = promptsQuery.data ?? [];
  const prompts = allPrompts.filter((prompt) => {
    if (showFavoritesOnly && !prompt.is_favorite) return false;
    if (selectedTagId && !prompt.tags?.some((t: Tag) => t.id === selectedTagId)) return false;
    return true;
  });

  const tags = tagsQuery.data ?? [];

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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {/* Favorites filter */}
        <button
          type="button"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showFavoritesOnly
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
          }`}
        >
          <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
          收藏
        </button>

        {/* Divider */}
        {tags.length > 0 && <div className="h-6 w-px bg-gray-700" />}

        {/* Tag filters */}
        {tags.map((tag: Tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => setSelectedTagId(selectedTagId === tag.id ? null : tag.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedTagId === tag.id
                ? "border"
                : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
            }`}
            style={
              selectedTagId === tag.id
                ? {
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    borderColor: `${tag.color}50`,
                  }
                : undefined
            }
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
            {tag.name}
          </button>
        ))}

        {/* Add tag button */}
        {isCreatingTag ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateTag();
                if (e.key === "Escape") {
                  setIsCreatingTag(false);
                  setNewTagName("");
                }
              }}
              placeholder="标签名称"
              // biome-ignore lint/a11y/noAutofocus: intentional UX for inline tag creation
              autoFocus
              className="w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || createTagMutation.isPending}
              className="p-1 text-green-500 hover:text-green-400 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreatingTag(false);
                setNewTagName("");
              }}
              className="p-1 text-gray-400 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCreatingTag(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800 text-gray-400 border border-dashed border-gray-600 hover:border-gray-500 transition-colors"
          >
            <TagIcon className="w-3.5 h-3.5" />
            添加标签
          </button>
        )}

        {/* Clear filters */}
        {(showFavoritesOnly || selectedTagId) && (
          <button
            type="button"
            onClick={() => {
              setShowFavoritesOnly(false);
              setSelectedTagId(null);
            }}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-500 hover:text-gray-400 transition-colors"
          >
            <X className="w-3 h-3" />
            清除筛选
          </button>
        )}
      </div>

      {/* Content */}
      {promptsQuery.isLoading ? (
        <PromptSkeletonGrid />
      ) : prompts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {search || showFavoritesOnly || selectedTagId
              ? "没有找到匹配的 Prompt"
              : "还没有 Prompt"}
          </h3>
          <p className="text-gray-400 mb-6">
            {search
              ? "试试其他搜索词"
              : showFavoritesOnly
                ? "还没有收藏任何 Prompt"
                : selectedTagId
                  ? "这个标签下还没有 Prompt"
                  : "创建你的第一个 Prompt 开始使用"}
          </p>
          {!search && !showFavoritesOnly && !selectedTagId && (
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="删除 Prompt"
        message="确定要删除这个 Prompt 吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
