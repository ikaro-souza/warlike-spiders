import { z } from "zod";

const baseSchema = z.object({
    id: z.string(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
    deletedAt: z.date().nullable().default(null),
});

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    image: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const tableStatus = z.enum([
    "open",
    "requesting_waiter",
    "ordering",
    "waiting_order",
    "closed",
]);
export type TableStatus = z.infer<typeof tableStatus>;

export const waiterShiftSummaryTableSchema = z.object({
    id: z.string(),
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
    totalOrdered: z.number(),
});
export type WaiterShiftSummary = z.infer<typeof waiterShiftSummarySchema>;

export const tableSessionSchema = z
    .object({
        table: z.object({
            seats: z.number(),
        }),
        totalOrdered: z.number(), // TODO: make this a calculated column
        occupants: userSchema.array(),
        orderHistory: z
            .object({
                client: userSchema,
                itemQuantity: z.number(),
                item: z.object({
                    name: z.string(),
                    unitaryPrice: z.number(),
                    image: z.string(),
                }),
            })
            .extend(baseSchema.shape)
            .array(),
    })
    .extend(baseSchema.shape);
export type TableSession = z.infer<typeof tableSessionSchema>;
