import { createTRPCRouter, publicProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
    getMenu: publicProcedure.query(async ({ input, ctx }) => {
        const menu = await ctx.prisma.menu.findFirstOrThrow({
            include: {
                sections: {
                    include: {
                        items: true,
                    },
                },
            },
        });

        return menu;
    }),
});
