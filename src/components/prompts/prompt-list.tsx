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
        {/* Sidebar (Desktop) - MD3 Navigation Drawer */}
        <aside className="hidden lg:block space-y-8 sticky top-24">
          <div className="card p-4 space-y-4">
            <h3
              className="px-3 text-label-medium uppercase tracking-wider"
              style={{ color: "hsl(var(--md-on-surface-variant))" }}
            >
              Library
            </h3>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedTagId(null)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-label-large transition-all duration-200 state-layer ${
                  !selectedTagId ? "chip-selected" : ""
                }`}
                style={{
                  color: !selectedTagId
                    ? "hsl(var(--md-on-secondary-container))"
                    : "hsl(var(--md-on-surface-variant))",
                }}
              >
                <Compass className="w-4 h-4" />
                全部 Prompts
              </button>
            </div>
          </div>

          <div className="card p-4 space-y-4">
            <div className="flex items-center justify-between px-3">
              <h3
                className="text-label-medium uppercase tracking-wider"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                Tags
              </h3>
              <button
                type="button"
                onClick={() => setIsCreatingTag(!isCreatingTag)}
                className="icon-btn w-8 h-8"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {tags.map((tag: Tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedTagId(selectedTagId === tag.id ? null : tag.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-full text-label-large transition-all duration-200 state-layer ${
                    selectedTagId === tag.id ? "chip-selected" : ""
                  }`}
                  style={{
                    color:
                      selectedTagId === tag.id
                        ? "hsl(var(--md-on-secondary-container))"
                        : "hsl(var(--md-on-surface-variant))",
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="truncate flex-1 text-left">{tag.name}</span>
                  {selectedTagId === tag.id && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "hsl(var(--md-primary))" }}
                    />
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
                      className="input-outlined text-label-large py-2"
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
            <h2 className="text-headline-medium" style={{ color: "hsl(var(--md-on-surface))" }}>
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
              className={`flex-none chip ${!selectedTagId ? "chip-selected" : ""}`}
            >
              全部
            </button>
            {tags.map((tag: Tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTagId(selectedTagId === tag.id ? null : tag.id)}
                className={`flex-none chip ${selectedTagId === tag.id ? "chip-selected" : ""}`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
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
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索 Prompt..."
                className="input-outlined w-full pl-11 h-12"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="hidden lg:flex fab-extended"
            >
              <Plus className="w-5 h-5" />
              <span>新建 Prompt</span>
            </button>
          </div>

          {/* Grid */}
          {promptsQuery.isLoading ? (
            <PromptSkeletonGrid />
          ) : prompts.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-16 h-16 mb-4 rounded-2xl flex items-center justify-center"
                style={{ background: "hsl(var(--md-surface-container-high))" }}
              >
                <LayoutGrid
                  className="w-8 h-8"
                  style={{ color: "hsl(var(--md-on-surface-variant))" }}
                />
              </div>
              <h3 className="text-title-large mb-2" style={{ color: "hsl(var(--md-on-surface))" }}>
                {search ? "未找到相关结果" : "暂无 Prompt"}
              </h3>
              <p
                className="text-body-medium max-w-xs mb-6"
                style={{ color: "hsl(var(--md-on-surface-variant))" }}
              >
                {search ? "尝试更换搜索关键词" : "创建一个新的 Prompt 开始你的创作之旅"}
              </p>
              {!search && (
                <button type="button" onClick={() => setIsFormOpen(true)} className="btn-primary">
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
