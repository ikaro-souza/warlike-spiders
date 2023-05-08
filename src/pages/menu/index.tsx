import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import clsx from "clsx";
import type { GetServerSidePropsContext } from "next";
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

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    const session = await getServerAuthSession({ req, res });
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: createInnerTRPCContext({ session }),
        transformer: superjson,
    });
    await ssg.menu.getMenu.prefetch();

    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
    };
}

function Page() {
    const { data } = api.menu.getMenu.useQuery(undefined, {
        staleTime: 600,
        refetchOnWindowFocus: false,
    });
    if (!data) return <></>;

    return (
        <>
            <TopAppBar showPreviousButton />
            <main>
                {data.sections.map(x => (
                    <Section key={x.id} className="py-5">
                        <SectionHeader className="px-5">{x.name}</SectionHeader>
                        <SectionBody
                            className={clsx(
                                x.highlight &&
                                    "scroll flex w-screen flex-row gap-4 overflow-x-scroll px-5 scrollbar-hide",
                            )}
                            role="list"
                        >
                            {x.items.map(y => {
                                if (x.highlight)
                                    return (
                                        <HighlightedSectionItem
                                            className="flex-shrink-0"
                                            key={y.id}
                                        >
                                            <HighlightedSectionItemHeader
                                                title={y.name}
                                            >
                                                <HighlightedSectionItemImage
                                                    alt={y.name}
                                                    src={y.image}
                                                />
                                            </HighlightedSectionItemHeader>
                                            <HighlightedSectionItemContent>
                                                <HighlightedSectionItemTitle>
                                                    {currencyFormatter.format(
                                                        y.unitaryPrice,
                                                    )}
                                                </HighlightedSectionItemTitle>
                                                <HighlightedSectionItemDescription>
                                                    {y.name}
                                                </HighlightedSectionItemDescription>
                                            </HighlightedSectionItemContent>
                                        </HighlightedSectionItem>
                                    );

                                return (
                                    <ListItem key={y.id}>
                                        <ListItemContent className="gap-2">
                                            <ListItemHeadline className="text-base">
                                                {currencyFormatter.format(
                                                    Number(y.unitaryPrice),
                                                )}
                                            </ListItemHeadline>
                                            <ListItemSupportingText>
                                                {y.name}
                                            </ListItemSupportingText>
                                        </ListItemContent>
                                        <ListItemTrailing>
                                            <ListItemImage
                                                className="rounded-lg"
                                                alt={y.name}
                                                url={y.image}
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
