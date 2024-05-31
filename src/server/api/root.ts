import { createTRPCRouter } from "~/server/api/trpc";
import { utilsRouter } from "./routers/utils";
import { ticketRouter } from "./routers/ticket";
import { commentRouter } from "./routers/comment";
import { departmentRouter } from "./routers/department";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  department: departmentRouter,
  ticket: ticketRouter,
  comment: commentRouter,
  utils: utilsRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
