/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DateTime } from "luxon";
import * as uuid from "uuid";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";
import {
    tableSessionSchema,
    userSchema,
    waiterShiftSummarySchema,
    type WaiterShiftSummaryTable,
} from "y/server/schemas";
import { z } from "zod";

export const tableRouter = createTRPCRouter({
    getWaiterShiftSummary: publicProcedure
        .output(waiterShiftSummarySchema)
        .query(async ({ ctx }) => {
            await ctx.prisma.order.findFirst();

            const tables: WaiterShiftSummaryTable[] = [
                {
                    id: uuid.v4(),
                    lastOrder: DateTime.now().minus({ minutes: 25 }).toJSDate(),
                    number: 8,
                    status: "requesting_waiter",
                },
                {
                    id: uuid.v4(),
                    lastOrder: DateTime.now().minus({ minutes: 2 }).toJSDate(),
                    number: 3,
                    status: "waiting_order",
                },
                {
                    id: uuid.v4(),
                    lastOrder: DateTime.now().minus({ minutes: 15 }).toJSDate(),
                    number: 1,
                    status: "waiting_order",
                },
                {
                    id: uuid.v4(),
                    lastOrder: DateTime.now().minus({ minutes: 40 }).toJSDate(),
                    number: 4,
                    status: "open",
                },
                {
                    id: uuid.v4(),
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
            const users = await ctx.prisma.user.findMany({
                where: {
                    name: {
                        not: { contains: "ikaro" },
                    },
                },
                select: {
                    id: true,
                    image: true,
                    name: true,
                },
            });

            const occupants = users.map(x => userSchema.parse(x));
            return {
                occupants,
                orderHistory: [
                    {
                        client: occupants[0]!,
                        id: uuid.v4(),
                        item: {
                            name: "Product X",
                            unitaryPrice: 12.5,
                            image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8N3x8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
                        },
                        itemQuantity: 2,
                        createdAt: DateTime.now()
                            .minus({ minutes: 30 })
                            .toJSDate(),
                        updatedAt: DateTime.now()
                            .minus({ minutes: 30 })
                            .toJSDate(),
                    },
                    {
                        client: occupants[3]!,
                        id: uuid.v4(),
                        item: {
                            name: "Product Y",
                            unitaryPrice: 20.9,
                            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
                        },
                        itemQuantity: 1,
                        createdAt: DateTime.now()
                            .minus({ minutes: 32 })
                            .toJSDate(),
                        updatedAt: DateTime.now()
                            .minus({ minutes: 32 })
                            .toJSDate(),
                    },
                    {
                        client: occupants[2]!,
                        id: uuid.v4(),
                        item: {
                            name: "Product Z",
                            unitaryPrice: 8.5,
                            image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
                        },
                        itemQuantity: 2,
                        createdAt: DateTime.now()
                            .minus({ minutes: 52 })
                            .toJSDate(),
                        updatedAt: DateTime.now()
                            .minus({ minutes: 52 })
                            .toJSDate(),
                    },
                ],
                totalOrdered: 420.69,
                id: uuid.v4(),
                table: {
                    seats: 4,
                },
                createdAt: DateTime.now().minus({ minutes: 48 }).toJSDate(),
                updatedAt: DateTime.now().minus({ minutes: 48 }).toJSDate(),
            };
        }),
});
