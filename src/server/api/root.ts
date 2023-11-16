import { postRouter } from "~/server/api/routers/post";
import { generateRandomIdea } from "~/server/api/routers/generateRandomIdea";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  generateRandomIdea: generateRandomIdea,
});

// export type definition of API
export type AppRouter = typeof appRouter;
