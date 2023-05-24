import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ListItemProps = React.HTMLAttributes<HTMLDivElement> & {
    href?: string;
};
export const ListItem = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<ListItemProps>
>(({ children, className: classNameProp, href, ...props }, ref) => {
    const className = clsx(
        "flex w-full gap-3 px-5 py-3 text-black ",
        classNameProp,
    );

    return (
        <div
            ref={ref}
            role="listitem"
            className={href ? undefined : className}
            {...props}
        >
            {href ? (
                <Link href={href} className={className}>
                    {children}
                </Link>
            ) : (
                children
            )}
        </div>
    );
});
ListItem.displayName = "ListItem";

type ListItemImageProps = {
    alt: string;
    className?: string;
    url: string;
    priority?: boolean;
};
export const ListItemImage: React.FC<ListItemImageProps> = ({
    alt,
    className,
    url,
    priority,
}) => {
    return (
        <Image
            alt={alt}
            src={url}
            height={56}
            width={56}
            className={clsx("h-14 w-14 rounded-full object-cover", className)}
            sizes="56px"
            priority={priority}
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
