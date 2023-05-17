import { IconChevronLeft } from "@tabler/icons-react";
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
            {showPreviousButton && (
                <div className="w-10" title="Go back" onClick={router.back}>
                    <IconChevronLeft aria-hidden />
                </div>
            )}
            <h1 className="flex-1 text-center text-xs font-medium uppercase leading-snug">
                {title ?? "restaurant's name"}
            </h1>
        </header>
    );
};
