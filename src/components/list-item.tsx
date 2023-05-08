import clsx from "clsx";
import Image from "next/image";
import React from "react";

type ListItemProps = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "role"
>;
export const ListItem: React.FC<React.PropsWithChildren<ListItemProps>> = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            role="listitem"
            className={clsx(
                "flex w-full gap-3 bg-background px-5 py-3 text-black",
                className,
            )}
            {...props}
        >
            {children}
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
            className={clsx("h-12 w-12 rounded-full object-cover", className)}
        />
    );
};

type ListItemContentProps = React.HTMLAttributes<HTMLDivElement>;
export const ListItemContent: React.FC<
    React.PropsWithChildren<ListItemContentProps>
> = ({ children, className, ...props }) => {
    return (
        <div
            className={clsx(
                "flex flex-grow flex-col justify-center gap-0.5",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

type ListItemHeadlineProps = React.HTMLAttributes<HTMLParagraphElement>;
export const ListItemHeadline: React.FC<
    React.PropsWithChildren<ListItemHeadlineProps>
> = ({ children, ...props }) => {
    return (
        <p
            className={clsx("text-sm leading-[18px]", props.className)}
            {...props}
        >
            {children}
        </p>
    );
};

type ListItemOverlineProps = React.HTMLAttributes<HTMLSpanElement>;
export const ListItemOverline: React.FC<
    React.PropsWithChildren<ListItemOverlineProps>
> = ({ children, className, ...props }) => {
    return (
        <span className={clsx("text-xs leading-none", className)} {...props}>
            {children}
        </span>
    );
};

type ListItemSupportingTextProps = React.HTMLAttributes<HTMLSpanElement>;
export const ListItemSupportingText: React.FC<
    React.PropsWithChildren<ListItemSupportingTextProps>
> = ({ children, className, ...props }) => {
    return (
        <span className={clsx("text-sm", className)} {...props}>
            {children}
        </span>
    );
};

type ListItemLeadingProps = React.HTMLAttributes<HTMLDivElement>;
export const ListItemLeading: React.FC<
    React.PropsWithChildren<ListItemLeadingProps>
> = ({ children, className, ...props }) => {
    return (
        <div className={clsx("flex-shrink-0", className)} {...props}>
            {children}
        </div>
    );
};

type ListItemTrailingProps = React.HTMLAttributes<HTMLDivElement>;
export const ListItemTrailing: React.FC<
    React.PropsWithChildren<ListItemTrailingProps>
> = ({ children, className, ...props }) => {
    return (
        <div
            className={clsx("min-w-[40px] flex-shrink-0", className)}
            {...props}
        >
            {children}
        </div>
    );
};
