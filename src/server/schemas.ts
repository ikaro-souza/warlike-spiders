import { z } from "zod";

const baseSchema = z.object({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  deletedAt: z.date().nullable(),
});

export const tableStatus = z.enum([
  "open",
  "requesting_waiter",
  "ordering",
  "waiting_order",
  "closed",
]);

export const waiterShiftSummaryTableSchema = z.object({
  number: z.number(),
  status: tableStatus,
  lastOrder: z.date(),
});
export type WaiterShiftSummaryTable = z.infer<
  typeof waiterShiftSummaryTableSchema
>;

export const waiterShiftSummarySchema = z.object({
  totalSold: z.number(),
  servingTables: waiterShiftSummaryTableSchema.array(),
  estimatedTips: z.number(),
  tablesClosed: z.number(),
});

export type WaiterShiftSummary = z.infer<typeof waiterShiftSummarySchema>;
export type TableStatus = z.infer<typeof tableStatus>;
