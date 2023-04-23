import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";
import { waiterShiftSummarySchema } from "y/server/schemas";

export const tableRouter = createTRPCRouter({
  getWaiterShiftSummary: publicProcedure
    .output(waiterShiftSummarySchema)
    .query(async ({ ctx }) => {
      await ctx.prisma.order.findFirst();

      return {
        estimatedTips: 108,
        servingTables: 5,
        tablesClosed: 12,
        totalSold: 1080,
      };
    }),
});
