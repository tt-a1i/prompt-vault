"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Tag as TagIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PromptCard } from "./prompt-card";
import { PromptForm } from "./prompt-form";
import { PromptPreview } from "./prompt-preview";
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
  const [previewPrompt, setPreviewPrompt] = useState<{
    id: string;
    title: string;
    content: string;
    description: string | null;
  } | null>(null);

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

  const handleCreate = (data: {
    title: string;
    content: string;
    description: string;
    tagIds: string[];
  }) => {
    createMutation.mutate({
      title: data.title,
      content: data.content,
      description: data.description || undefined,
      tagIds: data.tagIds.length > 0 ? data.tagIds : undefined,
    });
  };

  const handleUpdate = (data: {
    title: string;
    content: string;
    description: string;
    tagIds: string[];
  }) => {
    if (!editingPrompt) return;
    updateMutation.mutate({
      id: editingPrompt.id,
      title: data.title,
      content: data.content,
      description: data.description || undefined,
      tagIds: data.tagIds,
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

  const handlePreview = (id: string) => {
    const prompt = promptsQuery.data?.find((p) => p.id === id);
    if (prompt) {
      setPreviewPrompt({
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        description: prompt.description,
      });
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      createTagMutation.mutate({ name: newTagName.trim() });
    }
  };

  // Filter prompts
  const allPrompts = promptsQuery.data ?? [];
  const prompts = allPrompts.filter((prompt) => {
    if (selectedTagId && !prompt.tags?.some((t: Tag) => t.id === selectedTagId)) return false;
    return true;
  });

  const tags = tagsQuery.data ?? [];

  return (
    <div className="animate-fade-in">
      {/* Header - Compact & Editorial */}
      <div className="flex flex-col gap-6 mb-8">
        {/* Title row */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-display font-semibold text-[hsl(var(--text-primary))] tracking-tight">
              Prompts
            </h2>
            <p className="text-sm text-[hsl(var(--text-muted))] mt-1">
              {allPrompts.length === 0
                ? "开始创建你的第一个 Prompt"
                : `${allPrompts.length} 个模板`}
              {selectedTagId && " · 已筛选"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">新建 Prompt</span>
            <span className="sm:hidden">新建</span>
          </button>
        </div>

        {/* Search & Filters row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索..."
              className="input w-full pl-10 h-10"
            />
          </div>

          {/* Tags inline */}
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag: Tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTagId(selectedTagId === tag.id ? null : tag.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  selectedTagId === tag.id
                    ? "border shadow-sm"
                    : "bg-[hsl(var(--bg-elevated)_/_0.6)] text-[hsl(var(--text-muted))] border border-[hsl(var(--border)_/_0.5)] hover:border-[hsl(var(--accent)_/_0.5)]"
                }`}
                style={
                  selectedTagId === tag.id
                    ? {
                        backgroundColor: `${tag.color}18`,
                        color: tag.color,
                        borderColor: `${tag.color}40`,
                      }
                    : undefined
                }
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                {tag.name}
              </button>
            ))}

            {/* Add tag button */}
            {isCreatingTag ? (
              <div className="flex items-center gap-1.5">
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
                  placeholder="标签名"
                  // biome-ignore lint/a11y/noAutofocus: intentional UX for inline tag creation
                  autoFocus
                  className="w-20 px-2 py-1.5 bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--accent))] rounded-lg text-xs text-[hsl(var(--text-primary))] placeholder-[hsl(var(--text-muted))] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim() || createTagMutation.isPending}
                  className="p-1 rounded-md text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)_/_0.1)] disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingTag(false);
                    setNewTagName("");
                  }}
                  className="p-1 rounded-md text-[hsl(var(--text-muted))] hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreatingTag(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[hsl(var(--text-muted))] border border-dashed border-[hsl(var(--border)_/_0.5)] hover:border-[hsl(var(--accent)_/_0.5)] hover:text-[hsl(var(--accent))] transition-all duration-200"
              >
                <TagIcon className="w-3 h-3" />
                标签
              </button>
            )}

            {/* Clear filters */}
            {selectedTagId && (
              <button
                type="button"
                onClick={() => setSelectedTagId(null)}
                className="flex items-center gap-1 px-2 py-1 text-[10px] text-[hsl(var(--text-muted))] hover:text-rose-400 transition-colors"
              >
                <X className="w-3 h-3" />
                清除
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {promptsQuery.isLoading ? (
        <PromptSkeletonGrid />
      ) : prompts.length === 0 ? (
        <div className="text-center py-16">
          {/* Decorative background */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-3xl rounded-full" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--bg-secondary))] to-[hsl(var(--bg-card))] border border-[hsl(var(--border))]">
              <Plus className="w-10 h-10 text-[hsl(var(--accent-light))]" />
            </div>
          </div>

          <h3 className="text-2xl font-display font-semibold text-[hsl(var(--text-primary))] mb-3">
            {search || selectedTagId ? "没有找到匹配的 Prompt" : "开始你的 Prompt 之旅"}
          </h3>
          <p className="text-[hsl(var(--text-muted))] mb-8 max-w-md mx-auto leading-relaxed">
            {search
              ? "试试其他搜索词，或者创建一个新的 Prompt"
              : selectedTagId
                ? "这个标签下还没有 Prompt，尝试其他标签"
                : "创建你的第一个 Prompt，使用变量模板让你的提示词更加灵活复用"}
          </p>

          {!search && !selectedTagId && (
            <div className="space-y-6">
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="btn-primary inline-flex items-center gap-2 px-8 py-4"
              >
                <Plus className="w-5 h-5" />
                创建第一个 Prompt
              </button>

              {/* Tips */}
              <div className="flex flex-wrap justify-center gap-4 max-w-xl mx-auto">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--bg-card))] border border-[hsl(var(--border))]">
                  <span className="text-sm">💡</span>
                  <span className="text-xs text-[hsl(var(--text-muted))]">
                    使用 {"{{变量}}"} 创建模板
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--bg-card))] border border-[hsl(var(--border))]">
                  <span className="text-sm">🏷️</span>
                  <span className="text-xs text-[hsl(var(--text-muted))]">用标签整理分类</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              title={prompt.title}
              content={prompt.content}
              description={prompt.description}
              tags={prompt.tags}
              createdAt={new Date(prompt.created_at)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPreview={handlePreview}
            />
          ))}
        </div>
      )}

      {/* Create Form */}
      <PromptForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreate}
        availableTags={tags}
        isLoading={createMutation.isPending}
      />

      {/* Edit Form */}
      <PromptForm
        isOpen={!!editingPrompt}
        onClose={() => setEditingPrompt(null)}
        onSubmit={handleUpdate}
        initialData={editingPrompt ?? undefined}
        availableTags={tags}
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

      {/* Preview Modal */}
      <PromptPreview
        isOpen={!!previewPrompt}
        onClose={() => setPreviewPrompt(null)}
        title={previewPrompt?.title || ""}
        content={previewPrompt?.content || ""}
        description={previewPrompt?.description}
      />
    </div>
  );
}
