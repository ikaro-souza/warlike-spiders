/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DateTime } from "luxon";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";
import {
  waiterShiftSummarySchema,
  type WaiterShiftSummaryTable,
} from "y/server/schemas";

export const tableRouter = createTRPCRouter({
  getWaiterShiftSummary: publicProcedure
    .output(waiterShiftSummarySchema)
    .query(async ({ ctx }) => {
      await ctx.prisma.order.findFirst();

      const tables: WaiterShiftSummaryTable[] = [
        {
          number: 8,
          lastOrder: DateTime.now().minus({ minutes: 25 }).toJSDate(),
          status: "requesting_waiter",
        },
        {
          number: 3,
          lastOrder: DateTime.now().minus({ seconds: 5 }).toJSDate(),
          status: "waiting_order",
        },
        {
          number: 1,
          lastOrder: DateTime.now().minus({ minutes: 3 }).toJSDate(),
          status: "waiting_order",
        },
        {
          number: 4,
          lastOrder: DateTime.now().minus({ minutes: 36 }).toJSDate(),
          status: "open",
        },
        {
          number: 9,
          lastOrder: DateTime.now().minus({ minutes: 63 }).toJSDate(),
          status: "open",
        },
      ];

      return {
        estimatedTips: 108,
        servingTables: tables,
        tablesClosed: 12,
        totalSold: 1080,
      };
    }),
});
