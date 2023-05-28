import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import React from "react";
import superjson from "superjson";
import {
    HighlightedSectionItem,
    HighlightedSectionItemContent,
    HighlightedSectionItemDescription,
    HighlightedSectionItemHeader,
    HighlightedSectionItemImage,
    HighlightedSectionItemTitle,
} from "y/components/highlighted-section-item";
import {
    ListItem,
    ListItemContent,
    ListItemHeadline,
    ListItemImage,
    ListItemSupportingText,
    ListItemTrailing,
} from "y/components/list-item";
import {
    ListSection,
    Section,
    SectionBody,
    SectionHeader,
    SectionTitle,
} from "y/components/section";
import { TopAppBar } from "y/components/top-app-bar";
import { appRouter } from "y/server/api/root";
import { createInnerTRPCContext } from "y/server/api/trpc";
import { getServerAuthSession } from "y/server/auth";
import { type MenuSection } from "y/server/schemas";
import { api } from "y/utils/api";
import { currencyFormatter } from "y/utils/locale";
import { useSetOrderCreation } from "y/utils/state";

function Page({
    customerId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data: menu } = api.menu.getMenu.useQuery(undefined, {
        staleTime: 360,
        refetchOnWindowFocus: false,
    });
    const { data: order } = api.order.getCustomerOrder.useQuery(
        customerId || "",
    );
    const setOrderCreationData = useSetOrderCreation();
    const sections = React.useMemo(() => {
        if (!menu) return;

        const highlighted: MenuSection[] = [];
        const regular: MenuSection[] = [];
        menu.sections.forEach((section) => {
            section.highlight
                ? highlighted.push(section)
                : regular.push(section);
        });

        return {
            highlighted,
            regular,
        };
    }, [menu]);

    React.useEffect(() => {
        if (!order) return;
        setOrderCreationData(order);
    }, [order, setOrderCreationData]);

    if (!(menu && sections)) return <></>;

    return (
        <>
            <TopAppBar showPreviousButton />
            <main>
                {sections.highlighted.map((section) => (
                    <Section key={section.id} className="py-5">
                        <SectionHeader className="px-5">
                            <SectionTitle>{section.name}</SectionTitle>
                        </SectionHeader>
                        <SectionBody
                            className="scroll flex w-screen flex-row gap-4 overflow-x-scroll px-5 scrollbar-hide"
                            role="list"
                        >
                            {section.items.map((sectionItem) => {
                                const href = `/menu/item/${sectionItem.id}`;

                                return (
                                    <HighlightedSectionItem
                                        className="flex-shrink-0"
                                        href={href}
                                        key={sectionItem.id}
                                    >
                                        <HighlightedSectionItemHeader
                                            title={sectionItem.name}
                                        >
                                            <HighlightedSectionItemImage
                                                alt={sectionItem.name}
                                                src={sectionItem.image}
                                            />
                                        </HighlightedSectionItemHeader>
                                        <HighlightedSectionItemContent>
                                            <HighlightedSectionItemTitle>
                                                {currencyFormatter.format(
                                                    sectionItem.unitaryPrice,
                                                )}
                                            </HighlightedSectionItemTitle>
                                            <HighlightedSectionItemDescription>
                                                {sectionItem.name}
                                            </HighlightedSectionItemDescription>
                                        </HighlightedSectionItemContent>
                                    </HighlightedSectionItem>
                                );
                            })}
                        </SectionBody>
                    </Section>
                ))}
                {sections.regular.map((section) => (
                    <ListSection
                        key={section.id}
                        className="py-5"
                        headerClassName="px-5"
                        sectionTitle={section.name}
                    >
                        {section.items.map((sectionItem) => {
                            const href = `/menu/item/${sectionItem.id}`;
                            return (
                                <ListItem key={sectionItem.id} href={href}>
                                    <ListItemContent className="gap-2">
                                        <ListItemHeadline className="text-base">
                                            {currencyFormatter.format(
                                                Number(
                                                    sectionItem.unitaryPrice,
                                                ),
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
                        })}
                    </ListSection>
                ))}
            </main>
        </>
    );
}

export default Page;

export async function getServerSideProps({
    req,
    res,
    query,
}: GetServerSidePropsContext) {
    const session = await getServerAuthSession({ req, res });
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: createInnerTRPCContext({ session }),
        transformer: superjson,
    });

    const customerId = query.customerId as string | undefined;
    if (customerId) await ssg.order.getCustomerOrder.prefetch(customerId);

    await ssg.menu.getMenu.prefetch();
    return {
        props: {
            trpcState: ssg.dehydrate(),
            customerId,
        },
    };
}
