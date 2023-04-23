import { z } from "zod";

export const waiterShiftSummarySchema = z.object({
  totalSold: z.number(),
  servingTables: z.number(),
  estimatedTips: z.number(),
  tablesClosed: z.number(),
});

export type WaiterShiftSummary = z.infer<typeof waiterShiftSummarySchema>;
