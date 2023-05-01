import { DateTime } from "luxon";

export const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export const formatTableSessionOpenTime = (createdAt: Date) => {
    const diff = DateTime.now().diff(DateTime.fromJSDate(createdAt));
    const diffInSeconds = diff.as("seconds");

    if (diffInSeconds < 60) {
        return "a few seconds";
    } else if (diffInSeconds < 120) {
        return "a minute";
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}min`;
    }

    const { hours, minutes } = diff.rescale().toObject();
    return `${hours as number}h${minutes ?? 0}m`;
};
