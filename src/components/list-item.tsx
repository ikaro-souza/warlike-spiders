import clsx from "clsx";
import Image from "next/image";
import React from "react";

type ListItemProps = {
    className?: string;
    headline: React.ReactNode;
    overline?: string;
    supportingText?: React.ReactNode;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
};

export const ListItem: React.FC<ListItemProps> = ({
    className,
    headline,
    leading,
    overline,
    supportingText,
    trailing,
}) => {
    return (
        <div
            role="listitem"
            className={clsx("flex w-full gap-3 bg-white px-5 py-3", className)}
        >
            {leading}
            <div className="flex flex-grow flex-col justify-center gap-0.5">
                {overline && (
                    <span className="text-xs leading-none opacity-50">
                        {overline}
                    </span>
                )}
                {typeof headline === "string" ? (
                    <p className="text-sm leading-[18px]">{headline}</p>
                ) : (
                    headline
                )}
                {supportingText && (
                    <span
                        className={clsx(
                            "text-sm",
                            typeof supportingText === "string" && "opacity-50",
                        )}
                    >
                        {supportingText}
                    </span>
                )}
            </div>
            {trailing}
        </div>
    );
};

type ListItemImageProps = {
    alt: string;
    className?: string;
    url: string;
};
export const ListItemImage: React.FC<ListItemImageProps> = ({
    alt,
    className,
    url,
}) => {
    return (
        <Image
            alt={alt}
            src={url}
            height={48}
            width={48}
            className={clsx(
                "h-12 w-12 rounded-full bg-black object-cover",
                className,
            )}
        />
    );
};
