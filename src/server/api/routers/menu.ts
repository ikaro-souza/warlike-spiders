import { TRPCError } from "@trpc/server";
import {
    menuItemSchema,
    menuSectionSchema,
    type MenuItem,
    type MenuSection,
} from "y/server/schemas";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const menuRouter = createTRPCRouter({
    getMenu: publicProcedure.query(async ({ ctx }) => {
        const menu = await ctx.prisma.menu.findFirstOrThrow({
            include: {
                sections: {
                    include: {
                        items: {
                            include: {
                                ingredient: {
                                    select: { ingredient: true },
                                },
                                recipe: {
                                    select: { recipe: true },
                                },
                            },
                        },
                    },
                    orderBy: {
                        highlight: "desc",
                    },
                },
            },
        });

        const sections: MenuSection[] = [];

        for (let index = 0; index < menu.sections.length; index++) {
            const section = menu.sections[index];
            if (!section) break;

            const items: MenuItem[] = [];

            for (let j = 0; index < section.items.length; j++) {
                const menuItem = section.items[j];
                if (!menuItem) break;

                items.push(
                    menuItemSchema.parse({
                        ...menuItem,
                        image:
                            menuItem.recipe?.recipe.image ??
                            menuItem.ingredient?.ingredient.image,
                    }),
                );
            }

            sections.push(menuSectionSchema.parse({ ...section, items }));
        }

        return {
            ...menu,
            sections,
        };
    }),
    getMenuItem: publicProcedure
        .input(z.string().cuid())
        .output(menuItemSchema)
        .query(async ({ ctx, input }) => {
            try {
                const item = await ctx.prisma.menuItem.findFirstOrThrow({
                    where: {
                        id: input,
                    },
                });
                return item;
            } catch (error) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
        }),
});
