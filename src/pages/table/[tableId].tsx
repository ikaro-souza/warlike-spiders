import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import clsx from "clsx";
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import Link from "next/link";
import superjson from "superjson";
import { Button } from "y/components/button";
import {
    ListItem,
    ListItemContent,
    ListItemHeadline,
    ListItemImage,
    ListItemLeading,
    ListItemOverline,
    ListItemTrailing,
} from "y/components/list-item";
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
                        value={data.customers.length
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
                <div className="flex flex-col gap-5">
                    <Section className="pt-7">
                        <SectionHeader className="px-5">
                            Customers
                        </SectionHeader>
                        <SectionBody role="list">
                            {data.customers.map(x => {
                                return (
                                    <Link
                                        key={x.id}
                                        href={`/menu/?userId=${x.id}&tableId=${tableId}`}
                                        passHref
                                        legacyBehavior
                                    >
                                        <ListItem className="bg-white">
                                            <ListItemLeading>
                                                <ListItemImage
                                                    alt={x.name}
                                                    url={x.image}
                                                />
                                            </ListItemLeading>
                                            <ListItemContent>
                                                <ListItemHeadline>
                                                    {x.name}
                                                </ListItemHeadline>
                                            </ListItemContent>
                                            <ListItemTrailing className="flex items-center">
                                                <Button>Serve</Button>
                                            </ListItemTrailing>
                                        </ListItem>
                                    </Link>
                                );
                            })}
                        </SectionBody>
                    </Section>
                    <Section>
                        <SectionHeader className="px-5">Orders</SectionHeader>
                        <SectionBody role="list">
                            {data.orderHistory.map(x => {
                                const customer = data.customers.find(
                                    customer => customer.id === x.customerId,
                                );

                                return (
                                    <ListItem key={x.id} className="bg-white">
                                        <ListItemLeading>
                                            <ListItemImage
                                                alt={customer?.name ?? ""}
                                                url={customer?.image ?? ""}
                                            />
                                        </ListItemLeading>
                                        <ListItemContent>
                                            <ListItemOverline className="opacity-50">
                                                {customer?.name} has ordered:
                                            </ListItemOverline>
                                            <ListItemHeadline
                                                className={clsx(
                                                    x.items.length &&
                                                        "flex flex-col text-sm",
                                                )}
                                            >
                                                {x.items.map(item => {
                                                    return (
                                                        <span key={item.itemId}>
                                                            {item.itemQuantity
                                                                .toString()
                                                                .padStart(
                                                                    2,
                                                                    "0",
                                                                )}
                                                            &nbsp;
                                                            {item.name}
                                                        </span>
                                                    );
                                                })}
                                            </ListItemHeadline>
                                        </ListItemContent>
                                    </ListItem>
                                );
                            })}
                        </SectionBody>
                    </Section>
                </div>
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
            <h2 id="stat-label">{label}</h2>
            <p className="font-medium">{value}</p>
        </section>
    );
};
