import { prisma } from "y/server/db";
import { createTRPCRouter } from "../trpc";

export const restaurantRouter = createTRPCRouter({});

async function createIdentifier(restaurantName: string): Promise<string> {
    const count = await prisma.restaurant.count({
        where: {
            name: restaurantName,
        },
    });

    const formattedName = restaurantName
        .split(" ")
        .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("");
    if (count === 0) {
        return formattedName;
    } else {
        return `${formattedName}-${count + 1}`;
    }
}

function normalizeRestaurantName(name: string): string {
    return name
        .split(" ")
        .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("");
}
