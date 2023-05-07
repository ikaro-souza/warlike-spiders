import { z } from "zod";

const baseSchema = z.object({
    id: z.string(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
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

export const menuItemSchema = z
    .object({
        name: z.string().max(30),
        description: z.string().max(100),
        unitaryPrice: z.number(),
        image: z.string().url(),
    })
    .extend(baseSchema.shape);
export type MenuItem = z.infer<typeof menuItemSchema>;

export const menuSectionSchema = z
    .object({
        name: z.string().max(30),
        highlight: z.boolean(),
        items: menuItemSchema.array(),
    })
    .extend(baseSchema.shape);
export type MenuSection = z.infer<typeof menuSectionSchema>;

export const orderItemSchema = z
    .object({
        itemId: z.string().cuid(),
        item: menuItemSchema,
        itemQuantity: z.number().positive(),
    })
    .extend(baseSchema.shape);

export const orderSchema = z
    .object({
        completedAt: z.date().nullable(),
        canceled: z.boolean(),
        customerId: z.string(),
        items: orderItemSchema.array(),
    })
    .extend(baseSchema.shape);
export type Order = z.infer<typeof orderSchema>;

const orderHistoryItemSchema = orderItemSchema
    .pick({ itemId: true, itemQuantity: true })
    .merge(
        menuItemSchema.pick({
            name: true,
            description: true,
            unitaryPrice: true,
            image: true,
        }),
    );
export type OrderHistoryItem = z.infer<typeof orderHistoryItemSchema>;

export const orderHistorySchema = orderSchema
    .pick({ id: true, customerId: true })
    .merge(z.object({ items: orderHistoryItemSchema.array().nonempty() }))
    .array();
export type OrderHistory = z.infer<typeof orderHistorySchema>;

export const tableSessionCustomerSchema = userSchema.pick({
    name: true,
    id: true,
    image: true,
});
export type TableSessionCustomer = z.infer<typeof tableSessionCustomerSchema>;

export const tableSessionSchema = z
    .object({
        totalOrdered: z.number(),
        customers: tableSessionCustomerSchema.array(),
        orderHistory: orderHistorySchema,
        closedAt: z.date().nullable(),
    })
    .extend(baseSchema.shape);
export type TableSession = z.infer<typeof tableSessionSchema>;
