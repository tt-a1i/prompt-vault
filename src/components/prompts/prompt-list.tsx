"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTRPC } from "@/server/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Compass, LayoutGrid, Plus, Search } from "lucide-react";
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
      <div className="grid lg:grid-cols-[240px_1fr] gap-10 items-start">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block space-y-8 sticky top-24">
          <div className="space-y-4">
            <h3 className="px-3 text-xs font-semibold text-[hsl(var(--text-muted))] uppercase tracking-wider">
              Library
            </h3>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedTagId(null)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedTagId
                    ? "bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))]"
                    : "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-elevated)_/_0.5)]"
                }`}
              >
                <Compass className="w-4 h-4" />
                全部 Prompts
              </button>
              {/* Future: Favorites, Recent, etc. */}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-3">
              <h3 className="text-xs font-semibold text-[hsl(var(--text-muted))] uppercase tracking-wider">
                Tags
              </h3>
              <button
                type="button"
                onClick={() => setIsCreatingTag(!isCreatingTag)}
                className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--accent))] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {tags.map((tag: Tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedTagId(selectedTagId === tag.id ? null : tag.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                    selectedTagId === tag.id
                      ? "bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))]"
                      : "text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-elevated)_/_0.5)] hover:text-[hsl(var(--text-primary))]"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full transition-transform group-hover:scale-110"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="truncate flex-1 text-left">{tag.name}</span>
                  {selectedTagId === tag.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))]" />
                  )}
                </button>
              ))}

              {isCreatingTag && (
                <div className="px-3 pt-2">
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
                      placeholder="新标签..."
                      // biome-ignore lint/a11y/noAutofocus: intentional UX
                      autoFocus
                      className="w-full px-2 py-1.5 bg-[hsl(var(--bg-card))] border border-[hsl(var(--accent))] rounded text-xs text-[hsl(var(--text-primary))] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Header */}
        <div className="lg:hidden flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-semibold text-[hsl(var(--text-primary))]">
              Prompts
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="btn-primary flex items-center gap-2 px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              新建
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedTagId(null)}
              className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                !selectedTagId
                  ? "bg-[hsl(var(--text-primary))] text-[hsl(var(--bg-primary))] border-transparent"
                  : "bg-transparent text-[hsl(var(--text-muted))] border-[hsl(var(--border))] hover:border-[hsl(var(--text-muted))]"
              }`}
            >
              全部
            </button>
            {tags.map((tag: Tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTagId(selectedTagId === tag.id ? null : tag.id)}
                className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedTagId === tag.id
                    ? "bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))] border-[hsl(var(--accent))]"
                    : "bg-transparent text-[hsl(var(--text-muted))] border-[hsl(var(--border))] hover:border-[hsl(var(--text-muted))]"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6 min-w-0">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索 Prompt..."
                className="input w-full pl-10 h-11 bg-[hsl(var(--bg-elevated)_/_0.4)] hover:bg-[hsl(var(--bg-elevated)_/_0.7)] focus:bg-[hsl(var(--bg-elevated))]"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="hidden lg:flex btn-primary items-center gap-2 shadow-lg shadow-[hsl(var(--accent))]/20 hover:shadow-[hsl(var(--accent))]/40"
            >
              <Plus className="w-4 h-4" />
              <span>新建 Prompt</span>
            </button>
          </div>

          {/* Grid */}
          {promptsQuery.isLoading ? (
            <PromptSkeletonGrid />
          ) : prompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border-2 border-dashed border-[hsl(var(--border)_/_0.5)] bg-[hsl(var(--bg-elevated)_/_0.2)]">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-[hsl(var(--bg-elevated))] flex items-center justify-center">
                <LayoutGrid className="w-8 h-8 text-[hsl(var(--text-muted))]" />
              </div>
              <h3 className="text-xl font-medium text-[hsl(var(--text-primary))] mb-2">
                {search ? "未找到相关结果" : "暂无 Prompt"}
              </h3>
              <p className="text-[hsl(var(--text-muted))] max-w-xs mb-6">
                {search ? "尝试更换搜索关键词" : "创建一个新的 Prompt 开始你的创作之旅"}
              </p>
              {!search && (
                <button type="button" onClick={() => setIsFormOpen(true)} className="btn-secondary">
                  创建 Prompt
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 stagger-children">
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
        </div>
      </div>

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
