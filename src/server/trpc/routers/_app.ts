import { router } from "../init";
import { promptRouter } from "./prompt";
import { tagRouter } from "./tag";

/**
 * Main application router
 * All sub-routers are merged here
 */
export const appRouter = router({
  prompt: promptRouter,
  tag: tagRouter,
});

export type AppRouter = typeof appRouter;
