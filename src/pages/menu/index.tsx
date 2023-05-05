import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { GetServerSidePropsContext } from "next";
import superjson from "superjson";
import { ListItem, ListItemImage } from "y/components/list-item";
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
    await ssg.restaurant.getMenu.prefetch();

    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
    };
}

function Page() {
    const { data } = api.restaurant.getMenu.useQuery(undefined, {
        staleTime: 600,
        refetchOnWindowFocus: false,
    });
    if (!data) return <></>;

    return (
        <>
            <TopAppBar showPreviousButton />
            <main>
                {data.sections.map(x => (
                    <Section key={x.id}>
                        <SectionHeader>{x.name}</SectionHeader>
                        <SectionBody role="list">
                            {x.items.map(y => (
                                <ListItem
                                    key={y.id}
                                    className="bg-background"
                                    headline={
                                        <p className="text-base leading-[18px]">
                                            {currencyFormatter.format(
                                                Number(y.unitaryPrice),
                                            )}
                                        </p>
                                    }
                                    supportingText={<span>{y.name}</span>}
                                    trailing={
                                        <ListItemImage
                                            alt={y.name}
                                            url={y.image}
                                        />
                                    }
                                />
                            ))}
                        </SectionBody>
                    </Section>
                ))}
            </main>
        </>
    );
}

export default Page;
