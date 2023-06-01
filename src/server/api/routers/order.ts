import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
    orderCreationSchema,
    orderItemCreationSchema,
    orderSchema,
    orderStatus,
} from "y/server/schemas";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
    createOrder: publicProcedure
        .input(orderCreationSchema)
        .mutation(async ({ input, ctx }) => {
            if (!input.customerId) throw new TRPCError({ code: "BAD_REQUEST" });

            return await ctx.prisma.order.create({
                data: {
                    customerId: input.customerId,
                    items: {
                        createMany: {
                            data: orderItemCreateManyDataSchema.parse(
                                input.items,
                            ),
                        },
                    },
                },
            });
        }),
    getCustomerOrder: publicProcedure
        .input(
            z.object({
                customerId: z.string().cuid(),
                status: orderStatus.optional(),
            }),
        )
        .output(orderSchema)
        .query(async ({ input, ctx }) => {
            const where: Prisma.OrderWhereInput = {
                customerId: input.customerId,
            };
            if (input.status) {
                where.AND = {
                    status: input.status,
                };
            }

            const order = await ctx.prisma.order.findFirst({
                where,
                include: { items: { include: { item: true } } },
            });
            if (!order) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return order;
        }),
    deleteOrder: publicProcedure
        .input(z.string().cuid())
        .mutation(async ({ input, ctx }) => {
            const order = await ctx.prisma.order.findFirst({
                where: { id: input },
            });
            if (!order) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            await ctx.prisma.order.delete({ where: { id: order.id } });
        }),
});

const orderItemCreateManyDataSchema = orderItemCreationSchema
    .omit({ item: true })
    .array();
