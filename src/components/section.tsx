import clsx from "clsx";
import React from "react";
import { type MenuSection } from "y/server/schemas";
import { currencyFormatter } from "y/utils/locale";
import { BottomSheet } from "./bottom-sheet";
import { Button } from "./button";
import {
    ListItem,
    ListItemContent,
    ListItemHeadline,
    ListItemImage,
    ListItemSupportingText,
    ListItemTrailing,
} from "./list-item";
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
    menuSection: MenuSection;
};
export const ListSection: React.FC<ListSectionProps> = ({
    menuSection,
    ...props
}) => {
    const [open, setOpen] = React.useState(false);
    const { sectionBodyItems, sheetItems } = React.useMemo(() => {
        const sectionBodyItems = menuSection.items
            .slice(0, maxListSectionItems)
            .map((sectionItem) => {
                const href = `/menu/item/${sectionItem.id}`;
                return (
                    <ListItem key={sectionItem.id} href={href}>
                        <ListItemContent className="gap-2">
                            <ListItemHeadline className="text-base">
                                {currencyFormatter.format(
                                    Number(sectionItem.unitaryPrice),
                                )}
                            </ListItemHeadline>
                            <ListItemSupportingText>
                                {sectionItem.name}
                            </ListItemSupportingText>
                        </ListItemContent>
                        <ListItemTrailing>
                            <ListItemImage
                                className="rounded-lg"
                                alt={sectionItem.name}
                                url={sectionItem.image}
                            />
                        </ListItemTrailing>
                    </ListItem>
                );
            });
        const sheetItems = menuSection.items.map((sectionItem) => {
            const href = `/menu/item/${sectionItem.id}`;
            return (
                <ListItem key={sectionItem.id} href={href} className="!px-0">
                    <ListItemContent className="gap-2">
                        <ListItemHeadline className="text-base">
                            {currencyFormatter.format(
                                Number(sectionItem.unitaryPrice),
                            )}
                        </ListItemHeadline>
                        <ListItemSupportingText>
                            {sectionItem.name}
                        </ListItemSupportingText>
                    </ListItemContent>
                    <ListItemTrailing>
                        <ListItemImage
                            className="rounded-lg"
                            alt={sectionItem.name}
                            url={sectionItem.image}
                        />
                    </ListItemTrailing>
                </ListItem>
            );
        });
        return { sectionBodyItems, sheetItems };
    }, [menuSection.items]);

    return (
        <Section {...props}>
            <SectionHeader className="flex items-center justify-between gap-4 px-5">
                <SectionTitle>{menuSection.name}</SectionTitle>
                <Button onClick={() => setOpen(true)}>Show all</Button>
            </SectionHeader>
            <SectionBody role="list">{sectionBodyItems}</SectionBody>
            <BottomSheet open={open} onClose={() => setOpen(false)}>
                <BottomSheet.Title>
                    <h2>{menuSection.name}</h2>
                </BottomSheet.Title>
                <ul className="flex-grow overflow-y-scroll">{sheetItems}</ul>
            </BottomSheet>
        </Section>
    );
};
