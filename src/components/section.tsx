import clsx from "clsx";
import React from "react";

type SectionProps = React.HTMLAttributes<HTMLDivElement>;

export const Section: React.FC<React.PropsWithChildren<SectionProps>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <section className={clsx("flex flex-col gap-4", className)} {...props}>
            {children}
        </section>
    );
};

type SectionHeaderProps = {
    flexDirection?: "row" | "column";
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    srRonly?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const SectionHeader: React.FC<
    React.PropsWithChildren<SectionHeaderProps>
> = ({ children, title, subtitle, srRonly, ...props }) => {
    const effectiveTitle = title || children;
    return (
        <header
            className={clsx(
                "flex w-full",
                title && subtitle ? "flex-col gap-1" : "flex-row gap-4",
            )}
            {...props}
        >
            {effectiveTitle && (
                <h2
                    className={clsx(
                        "text-xl font-semibold",
                        srRonly && "sr-only",
                    )}
                >
                    {effectiveTitle}
                </h2>
            )}
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
