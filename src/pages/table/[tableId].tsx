import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import superjson from "superjson";
import { Button } from "y/components/button";
import { ListItem, ListItemImage } from "y/components/list-item";
import { Section, SectionBody, SectionHeader } from "y/components/section";
import { TopAppBar } from "y/components/top-app-bar";
import { appRouter } from "y/server/api/root";
import { createInnerTRPCContext } from "y/server/api/trpc";
import { getServerAuthSession } from "y/server/auth";
import { api } from "y/utils/api";
import { currencyFormatter, formatTableSessionOpenTime } from "y/utils/locale";

export async function getServerSideProps({
    req,
    res,
    query,
}: GetServerSidePropsContext) {
    const tableId = query.tableId as string | undefined;
    if (typeof tableId !== "string") return { notFound: true };

    const session = await getServerAuthSession({ req, res });

    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: createInnerTRPCContext({ session }),
        transformer: superjson,
    });

    await ssg.table.getTableSession.prefetch(tableId);

    return {
        props: {
            trpcState: ssg.dehydrate(),
            tableId,
        },
    };
}

function Page({
    tableId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { data } = api.table.getTableSession.useQuery(tableId, {
        refetchOnWindowFocus: false,
    });

    if (!data) return <></>;
    return (
        <>
            <TopAppBar showPreviousButton />
            <main>
                <header className="grid grid-cols-3 bg-white p-5">
                    <TableStat
                        label="Occupants"
                        value={data.occupants.length
                            .toString()
                            .padStart(2, "0")}
                    />
                    <TableStat
                        label="Total ordered"
                        value={currencyFormatter.format(data.totalOrdered)}
                    />
                    <TableStat
                        label="Open for"
                        value={formatTableSessionOpenTime(data.createdAt)}
                    />
                </header>
                <Section className="px-0">
                    <SectionHeader className="px-5">Clients</SectionHeader>
                    <SectionBody role="list">
                        {data.occupants.map(x => {
                            return (
                                <ListItem
                                    key={x.id}
                                    headline={x.name}
                                    leading={
                                        <ListItemImage
                                            alt={x.name}
                                            url={x.image}
                                        />
                                    }
                                    trailing={<Button>Serve</Button>}
                                />
                            );
                        })}
                    </SectionBody>
                </Section>
                <Section className="px-0">
                    <SectionHeader className="px-5">Orders</SectionHeader>
                    <SectionBody role="list">
                        {data.orderHistory.map(x => {
                            return (
                                <ListItem
                                    headline={`Has ordered ${x.itemQuantity} ${x.item.name}`}
                                    overline={x.client.name}
                                    leading={
                                        <ListItemImage
                                            alt={x.client.name}
                                            url={x.item.image}
                                            className="rounded-lg"
                                        />
                                    }
                                    key={x.id}
                                />
                            );
                        })}
                    </SectionBody>
                </Section>
            </main>
        </>
    );
}

export default Page;

const TableStat: React.FC<{ label: string; value: string }> = ({
    label,
    value,
}) => {
    return (
        <section
            className="flex flex-col items-center justify-center gap-1 text-sm"
            aria-labelledby="stat-label"
        >
            <p id="stat-label">{label}</p>
            <span className="font-medium">{value}</span>
        </section>
    );
};
