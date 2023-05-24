import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import clsx from "clsx";
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
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
import { Section, SectionBody, SectionHeader } from "y/components/section";
import { TopAppBar } from "y/components/top-app-bar";
import { appRouter } from "y/server/api/root";
import { createInnerTRPCContext } from "y/server/api/trpc";
import { getServerAuthSession } from "y/server/auth";
import { api } from "y/utils/api";
import { currencyFormatter } from "y/utils/locale";
import { useOrderCreation } from "y/utils/state";

function Page({
    customerId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data: menu } = api.menu.getMenu.useQuery(undefined, {
        staleTime: 360,
        refetchOnWindowFocus: false,
    });
    const [orderCreationData, setOrderCreationData] = useOrderCreation();

    if (!menu) return <></>;

    return (
        <>
            <TopAppBar showPreviousButton />
            <main>
                {menu.sections.map((section) => (
                    <Section key={section.id} className="py-5">
                        <SectionHeader className="px-5">
                            {section.name}
                        </SectionHeader>
                        <SectionBody
                            className={clsx(
                                section.highlight &&
                                    "scroll flex w-screen flex-row gap-4 overflow-x-scroll px-5 scrollbar-hide",
                            )}
                            role="list"
                        >
                            {section.items.map((sectionItem) => {
                                const href = `/menu/item/${sectionItem.id}`;

                                if (section.highlight)
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
                        </SectionBody>
                    </Section>
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
    await ssg.menu.getMenu.prefetch();

    const customerId = query.customerId as string | undefined;

    return {
        props: {
            trpcState: ssg.dehydrate(),
            customerId,
        },
    };
}
