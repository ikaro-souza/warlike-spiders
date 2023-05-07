/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createId } from "@paralleldrive/cuid2";
import { DateTime } from "luxon";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";
import {
    orderHistorySchema,
    orderSchema,
    tableSessionCustomerSchema,
    tableSessionSchema,
    waiterShiftSummarySchema,
    type Order,
    type OrderHistoryItem,
    type TableSessionCustomer,
    type WaiterShiftSummaryTable,
} from "y/server/schemas";
import { z } from "zod";

export const tableRouter = createTRPCRouter({
    getWaiterShiftSummary: publicProcedure
        .output(waiterShiftSummarySchema)
        .query(async ({ ctx }) => {
            await ctx.prisma.restaurant.findFirst();

            const tables: WaiterShiftSummaryTable[] = [
                {
                    id: createId(),
                    lastOrder: DateTime.now().minus({ minutes: 25 }).toJSDate(),
                    number: 8,
                    status: "requesting_waiter",
                },
                {
                    id: createId(),
                    lastOrder: DateTime.now().minus({ minutes: 2 }).toJSDate(),
                    number: 3,
                    status: "waiting_order",
                },
                {
                    id: createId(),
                    lastOrder: DateTime.now().minus({ minutes: 15 }).toJSDate(),
                    number: 1,
                    status: "waiting_order",
                },
                {
                    id: createId(),
                    lastOrder: DateTime.now().minus({ minutes: 40 }).toJSDate(),
                    number: 4,
                    status: "open",
                },
                {
                    id: createId(),
                    lastOrder: DateTime.now().minus({ minutes: 63 }).toJSDate(),
                    number: 9,
                    status: "open",
                },
            ];

            return {
                estimatedTips: 108,
                servingTables: tables,
                totalOrdered: 12,
                totalSold: 1080,
            };
        }),
    getTableSession: publicProcedure
        .input(z.string())
        .output(tableSessionSchema)
        .query(async ({ ctx }) => {
            const tableSession = await ctx.prisma.tableSession.findFirstOrThrow(
                {
                    include: {
                        customers: {
                            select: {
                                customer: {
                                    select: {
                                        id: true,
                                        name: true,
                                        image: true,
                                    },
                                },
                                orders: {
                                    include: {
                                        items: {
                                            include: {
                                                item: true,
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: "desc" },
                                },
                            },
                        },
                    },
                },
            );

            const customers: TableSessionCustomer[] = [];
            const orders: Order[] = [];
            const items: OrderHistoryItem[] = [];

            for (
                let index = 0;
                index < tableSession.customers.length;
                index++
            ) {
                const customer = tableSession.customers[index];
                if (customer) {
                    customers.push(
                        tableSessionCustomerSchema.parse(customer.customer),
                    );
                    orders.push(
                        ...customer.orders.map(x =>
                            orderSchema.parse({
                                ...x,
                                customerId: customer.customer.id,
                            }),
                        ),
                    );

                    orders.forEach((order, index) => {
                        items.push(
                            ...order.items.map<OrderHistoryItem>(orderItem => {
                                return {
                                    description: orderItem.item.description,
                                    image: orderItem.item.image,
                                    itemId: orderItem.itemId,
                                    itemQuantity: orderItem.itemQuantity,
                                    name: orderItem.item.name,
                                    unitaryPrice: orderItem.item.unitaryPrice,
                                };
                            }),
                        );
                        orders[index] = {
                            ...order,
                            customerId: customer.customer.id,
                        };
                    });
                }
            }

            let totalOrdered = 0;
            for (let index = 0; index < orders.length; index++) {
                const order = orders[index];
                if (order) {
                    totalOrdered += order.items.reduce(
                        (acc, item) =>
                            acc + item.itemQuantity * item.item.unitaryPrice,
                        0,
                    );
                }
            }
            return {
                customers: customers,
                id: tableSession.id,
                orderHistory: orderHistorySchema.parse(
                    orders.map(order => ({ ...order, items })),
                ),
                totalOrdered,
                createdAt: DateTime.now().minus({ minutes: 48 }).toJSDate(),
                updatedAt: tableSession.updatedAt,
                closedAt: tableSession.closedAt,
            };
        }),
});
