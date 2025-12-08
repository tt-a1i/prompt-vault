import { describe, expect, it, vi, beforeEach } from "vitest";
import { promptRouter } from "./prompt";
import { TRPCError } from "@trpc/server";

// Mock supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null,
        })),
        single: vi.fn(() => ({
          data: {},
          error: null,
        })),
      })),
      order: vi.fn(() => ({
        data: [],
        error: null,
      })),
    })),
  })),
};

const mockCtx = {
  supabase: mockSupabase as any,
  user: { id: "user-123" },
};

describe("promptRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("should handle search queries with commas correctly", async () => {
      // Setup mock chain for list query
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockOr = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq = vi.fn().mockReturnValue({ or: mockOr, order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      mockSupabase.from = mockFrom;

      const caller = promptRouter.createCaller(mockCtx as any);

      // Test search with comma
      await caller.list({ search: "hello, world" });

      // Verify the query structure
      expect(mockOr).toHaveBeenCalledWith(
        expect.stringContaining('title.ilike."%hello, world%"')
      );
    });

    it("should escape double quotes in search queries", async () => {
        // Setup mock chain for list query
        const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
        const mockOr = vi.fn().mockReturnValue({ order: mockOrder });
        const mockEq = vi.fn().mockReturnValue({ or: mockOr, order: mockOrder });
        const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

        mockSupabase.from = mockFrom;

        const caller = promptRouter.createCaller(mockCtx as any);

        // Test search with double quote
        await caller.list({ search: 'hello "world"' });

        // Verify the query structure has escaped quotes
        expect(mockOr).toHaveBeenCalledWith(
          expect.stringContaining('title.ilike."%hello \\"world\\"%"')
        );
      });
  });
});
