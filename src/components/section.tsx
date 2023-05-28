import clsx from "clsx";
import React from "react";
import { Button } from "./button";

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

type SectionHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const SectionHeader: React.FC<
    React.PropsWithChildren<SectionHeaderProps>
> = ({ children, ...props }) => {
    return <header {...props}>{children}</header>;
};

export const SectionTitleAndSubtitle: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return <div className="flex flex-col gap-1">{children}</div>;
};

type SectionTitleProps = { srRonly?: boolean };
export const SectionTitle: React.FC<
    React.PropsWithChildren<SectionTitleProps>
> = ({ children, srRonly }) => {
    return (
        <h2 className={clsx("text-xl font-semibold", srRonly && "sr-only")}>
            {children}
        </h2>
    );
};

export const SectionSubtitle: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    return <p className="text-sm">{children}</p>;
};

type SectionBodyProps = React.HTMLAttributes<HTMLDivElement>;
export const SectionBody: React.FC<
    React.PropsWithChildren<SectionBodyProps>
> = ({ children, ...props }) => {
    return <section {...props}>{children}</section>;
};

type SectionFooterProps = React.HTMLAttributes<HTMLDivElement>;
export const SectionFooter: React.FC<
    React.PropsWithChildren<SectionFooterProps>
> = ({ children, ...props }) => {
    return (
        <footer className={clsx("px-5 py-3")} {...props}>
            {children}
        </footer>
    );
};

const maxListSectionItems = 5;
type ListSectionProps = SectionProps & {
    sectionTitle: React.ReactNode;
    headerClassName?: string;
};
export const ListSection: React.FC<
    React.PropsWithChildren<ListSectionProps>
> = ({ children, sectionTitle, headerClassName, ...props }) => {
    return (
        <Section {...props}>
            <SectionHeader
                className={clsx(
                    "flex items-center justify-between gap-4",
                    headerClassName,
                )}
            >
                <SectionTitle>{sectionTitle}</SectionTitle>
                <Button>Mostrar todos</Button>
            </SectionHeader>
            <SectionBody role="list">
                {React.Children.toArray(children).slice(0, maxListSectionItems)}
            </SectionBody>
        </Section>
    );
};
