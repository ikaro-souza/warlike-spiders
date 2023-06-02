import { IconChevronLeft } from "@tabler/icons-react";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";

type TopAppBarProps = {
    showPreviousButton?: boolean;
    title?: string;
};

export const TopAppBar: React.FunctionComponent<TopAppBarProps> = ({
    showPreviousButton,
    title,
}) => {
    const router = useRouter();

    return (
        <header className="flex h-10 items-center bg-white px-5">
            <button
                className={clsx(
                    "flex h-10 w-10 items-center justify-center",
                    showPreviousButton
                        ? "pointer-events-auto visible"
                        : "pointer-events-none invisible",
                )}
                title="Go back"
                onClick={router.back}
            >
                {showPreviousButton && <IconChevronLeft aria-hidden />}
            </button>
            <h1 className="flex-1 text-center text-xs font-medium uppercase leading-snug">
                {title ?? "restaurant's name"}
            </h1>
            <div className="invisible w-10" />
        </header>
    );
};
