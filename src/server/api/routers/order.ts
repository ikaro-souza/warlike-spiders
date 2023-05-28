import { TRPCError } from "@trpc/server";
import {
    orderCreationSchema,
    orderItemCreationSchema,
    orderSchema,
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
        .input(z.string().cuid())
        .output(orderSchema)
        .query(async ({ input, ctx }) => {
            const order = await ctx.prisma.order.findFirst({
                where: { customerId: input },
                include: { items: { include: { item: true } } },
            });
            if (!order) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return order;
        }),
});

const orderItemCreateManyDataSchema = orderItemCreationSchema
    .omit({ item: true })
    .array();
