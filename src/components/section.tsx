import clsx from "clsx";
import React from "react";

type SectionProps = React.HTMLAttributes<HTMLDivElement>;

export const Section: React.FC<React.PropsWithChildren<SectionProps>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <article
            className={clsx("flex flex-col gap-4 p-5", className)}
            {...props}
        >
            {children}
        </article>
    );
};

type SectionHeaderProps = {
    flexDirection?: "row" | "column";
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const SectionHeader: React.FC<
    React.PropsWithChildren<SectionHeaderProps>
> = ({ children, title, subtitle, ...props }) => {
    return (
        <header
            className={clsx(
                "flex w-full",
                title && subtitle ? "flex-col gap-1" : "flex-row gap-4",
            )}
            {...props}
        >
            {!title && children}
            {title && <h3 className="text-xl font-semibold">{title}</h3>}
            {title && subtitle && <p className="text-sm">{subtitle}</p>}
        </header>
    );
};

type SectionBodyProps = React.HTMLAttributes<HTMLDivElement>;

export const SectionBody: React.FC<
    React.PropsWithChildren<SectionBodyProps>
> = ({ children, ...props }) => {
    return <section {...props}>{children}</section>;
};
