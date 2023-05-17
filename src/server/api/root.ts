import { createTRPCRouter } from "y/server/api/trpc";
import { menuRouter } from "./routers/menu";
import { orderRouter } from "./routers/order";
import { tableRouter } from "./routers/table";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    table: tableRouter,
    menu: menuRouter,
    order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
