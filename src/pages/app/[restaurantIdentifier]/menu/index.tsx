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

type PageProps = Omit<
    InferGetServerSidePropsType<typeof getServerSideProps>,
    "trpcState"
>;
function Page({ customerId, restaurantIdentifier }: PageProps) {
    const { data: menu } = api.menu.getMenu.useQuery(
        { restaurantIdentifier },
        { staleTime: 60000 },
    );
    const { data: order } = api.order.getCustomerOrder.useQuery(
        {
            customerId: customerId ?? "",
            status: "created",
        },
        { retry: false },
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
                                return (
                                    <HighlightedSectionItem
                                        className="flex-shrink-0"
                                        href={sectionItem.href}
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
                        menuSection={section}
                    />
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

    try {
        const customerId = (query.customerId as string | undefined) ?? null;
        if (customerId)
            await ssg.order.getCustomerOrder.prefetch({
                customerId,
                status: "created",
            });

        const restaurantIdentifier = query.restaurantIdentifier as string;
        await ssg.menu.getMenu.prefetch({
            restaurantIdentifier: restaurantIdentifier,
        });

        return {
            props: {
                trpcState: ssg.dehydrate(),
                customerId,
                restaurantIdentifier,
            },
        };
    } catch (error) {
        return {
            redirect: "/404",
        };
    }
}
