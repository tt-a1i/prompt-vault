import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../init";

/**
 * Input validation schemas
 */
const createPromptSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  tagIds: z.array(z.string().uuid()).optional(),
});

const updatePromptSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

/**
 * Prompt Router
 */
export const promptRouter = router({
  /**
   * List all prompts for the current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("prompts")
      .select(
        `
        *,
        prompt_tags (
          tags (*)
        )
      `
      )
      .eq("user_id", ctx.user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }

    // Flatten tags
    return data.map((prompt) => ({
      ...prompt,
      tags: prompt.prompt_tags?.map((pt: { tags: unknown }) => pt.tags) ?? [],
    }));
  }),

  /**
   * Get a single prompt by ID
   */
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("prompts")
        .select(
          `
          *,
          prompt_tags (
            tags (*)
          )
        `
        )
        .eq("id", input.id)
        .single();

      if (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

      // Check ownership
      if (data.user_id !== ctx.user.id && !data.is_public) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this prompt",
        });
      }

      return {
        ...data,
        tags: data.prompt_tags?.map((pt: { tags: unknown }) => pt.tags) ?? [],
      };
    }),

  /**
   * Create a new prompt
   */
  create: protectedProcedure.input(createPromptSchema).mutation(async ({ ctx, input }) => {
    const { tagIds, ...promptData } = input;

    // Create prompt
    const { data: prompt, error } = await ctx.supabase
      .from("prompts")
      .insert({
        ...promptData,
        user_id: ctx.user.id,
        is_public: promptData.isPublic,
      })
      .select()
      .single();

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }

    // Link tags
    if (tagIds && tagIds.length > 0) {
      const { error: tagError } = await ctx.supabase
        .from("prompt_tags")
        .insert(tagIds.map((tagId) => ({ prompt_id: prompt.id, tag_id: tagId })));

      if (tagError) {
        console.error("Failed to link tags:", tagError);
      }
    }

    return prompt;
  }),

  /**
   * Update an existing prompt
   */
  update: protectedProcedure.input(updatePromptSchema).mutation(async ({ ctx, input }) => {
    const { id, tagIds, isPublic, ...updates } = input;

    // Check ownership first
    const { data: existing } = await ctx.supabase
      .from("prompts")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existing || existing.user_id !== ctx.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You can only update your own prompts",
      });
    }

    // Update prompt
    const { data: prompt, error } = await ctx.supabase
      .from("prompts")
      .update({
        ...updates,
        is_public: isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }

    // Update tags if provided
    if (tagIds !== undefined) {
      // Remove existing tags
      await ctx.supabase.from("prompt_tags").delete().eq("prompt_id", id);

      // Add new tags
      if (tagIds.length > 0) {
        await ctx.supabase
          .from("prompt_tags")
          .insert(tagIds.map((tagId) => ({ prompt_id: id, tag_id: tagId })));
      }
    }

    return prompt;
  }),

  /**
   * Delete a prompt
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Check ownership first
      const { data: existing } = await ctx.supabase
        .from("prompts")
        .select("user_id")
        .eq("id", input.id)
        .single();

      if (!existing || existing.user_id !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own prompts",
        });
      }

      const { error } = await ctx.supabase.from("prompts").delete().eq("id", input.id);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return { success: true };
    }),

  /**
   * Search prompts by text
   */
  search: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("prompts")
        .select(
          `
          *,
          prompt_tags (
            tags (*)
          )
        `
        )
        .eq("user_id", ctx.user.id)
        .textSearch("fts", input.query)
        .order("updated_at", { ascending: false });

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      return data.map((prompt) => ({
        ...prompt,
        tags: prompt.prompt_tags?.map((pt: { tags: unknown }) => pt.tags) ?? [],
      }));
    }),
});
