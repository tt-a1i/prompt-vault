import { describe, expect, it, vi } from "vitest";
import { createCallerFactory } from "../init";
import { promptRouter } from "./prompt";

// Mock the context
const createMockCtx = (orSpy: any) => {
  const orderSpy = vi.fn().mockResolvedValue({ data: [], error: null });
  const eqSpy = vi.fn().mockReturnValue({
    or: orSpy,
    order: orderSpy,
  });
  const selectSpy = vi.fn().mockReturnValue({ eq: eqSpy });
  const fromSpy = vi.fn().mockReturnValue({ select: selectSpy });

  return {
    supabase: {
      from: fromSpy,
    },
    user: { id: "user-123" },
  };
};

describe("promptRouter.list", () => {
  it("should escape commas in search query", async () => {
    // We want to verify that the query string passed to .or() is correctly formatted
    // when the search input contains a comma.

    // Setup spy
    const orderSpy = vi.fn().mockResolvedValue({ data: [], error: null });
    // Chain: .or().order()
    const orSpy = vi.fn().mockReturnValue({ order: orderSpy });

    // Chain: .from().select().eq() -> returns object with .or
    const eqSpy = vi.fn().mockReturnValue({
      or: orSpy,
      order: orderSpy, // In case .or is skipped (not in this test case)
    });
    const selectSpy = vi.fn().mockReturnValue({ eq: eqSpy });
    const fromSpy = vi.fn().mockReturnValue({ select: selectSpy });

    const mockCtx = {
      supabase: {
        from: fromSpy,
      },
      user: { id: "user-123" },
    };

    const caller = createCallerFactory(promptRouter)(mockCtx as any);

    const searchInput = "foo,bar";
    await caller.list({ search: searchInput });

    expect(orSpy).toHaveBeenCalled();
    const arg = orSpy.mock.calls[0][0];

    // We expect the argument to be properly escaped.
    const expected = `title.ilike."%${searchInput}%",content.ilike."%${searchInput}%"`;
    expect(arg).toBe(expected);
  });
});
