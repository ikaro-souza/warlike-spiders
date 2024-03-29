import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type HighlightedSectionItemProps = React.HTMLAttributes<HTMLDivElement> & {
    href: string;
};
export const HighlightedSectionItem: React.FC<
    React.PropsWithChildren<HighlightedSectionItemProps>
> = ({ children, className: classNameProp, href, ...props }) => {
    const className = clsx(
        "block aspect-[4/5] w-1/2 overflow-hidden rounded-xl bg-white",
        classNameProp,
    );
    return (
        <article role="listitem" className={className} {...props}>
            <Link href={href} className="h-full w-full">
                {children}
            </Link>
        </article>
    );
};

type HighlightedSectionItemHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export const HighlightedSectionItemHeader: React.FC<
    React.PropsWithChildren<HighlightedSectionItemHeaderProps>
> = ({ children, className, ...props }) => {
    return (
        <header className={clsx("relative h-[60%]", className)} {...props}>
            {children}
        </header>
    );
};

type HighlightedSectionItemImageProps = {
    alt: string;
    src: string;
};
export const HighlightedSectionItemImage: React.FC<
    HighlightedSectionItemImageProps
> = ({ alt, src }) => {
    return (
        <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="200px"
            priority
        />
    );
};

type HighlightedSectionItemContentProps = React.HTMLAttributes<HTMLDivElement>;
export const HighlightedSectionItemContent: React.FC<
    React.PropsWithChildren<HighlightedSectionItemContentProps>
> = ({ children, className, ...props }) => {
    return (
        <section
            className={clsx("flex flex-col gap-1 p-3", className)}
            {...props}
        >
            {children}
        </section>
    );
};

type HighlightedSectionItemTitleProps =
    React.HTMLAttributes<HTMLParagraphElement>;
export const HighlightedSectionItemTitle: React.FC<
    React.PropsWithChildren<HighlightedSectionItemTitleProps>
> = ({ children, ...props }) => {
    return (
        <p className="text-base font-medium leading-5" {...props}>
            {children}
        </p>
    );
};

type HighlightedSectionItemDescriptionProps =
    React.HTMLAttributes<HTMLSpanElement>;
export const HighlightedSectionItemDescription: React.FC<
    React.PropsWithChildren<HighlightedSectionItemDescriptionProps>
> = ({ children, ...props }) => {
    return (
        <span
            className="line-clamp-2 overflow-hidden text-ellipsis text-sm font-light leading-4"
            {...props}
        >
            {children}
        </span>
    );
};
