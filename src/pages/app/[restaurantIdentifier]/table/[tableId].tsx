import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import clsx from "clsx";
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import React from "react";
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
import {
    Section,
    SectionBody,
    SectionHeader,
    SectionTitle,
} from "y/components/section";
import { TopAppBar } from "y/components/top-app-bar";
import { appRouter } from "y/server/api/root";
import { createInnerTRPCContext } from "y/server/api/trpc";
import { getServerAuthSession } from "y/server/auth";
import { api } from "y/utils/api";
import { currencyFormatter, formatTableSessionOpenTime } from "y/utils/locale";
import { useSetCustomers, useSetOrderCreationCustomer } from "y/utils/state";

type PageProps = Omit<
    InferGetServerSidePropsType<typeof getServerSideProps>,
    "trpcState"
>;

function Page({ tableId, restaurantIdentifier }: PageProps) {
    const { data } = api.table.getTableSession.useQuery(tableId, {
        refetchOnWindowFocus: false,
    });
    const setCustomers = useSetCustomers();
    const setOrderCreationCustomerAtom = useSetOrderCreationCustomer();

    const onCustomerClick = (customerId: string) => {
        setOrderCreationCustomerAtom(customerId);
    };

    if (!data) return <></>;

    setCustomers(data.customers);

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
                            <SectionTitle>Customers</SectionTitle>
                        </SectionHeader>
                        <SectionBody role="list">
                            {data.customers.map((x) => {
                                return (
                                    <ListItem
                                        key={x.id}
                                        className="bg-white"
                                        href={`/app/${restaurantIdentifier}/menu/?customerId=${x.id}`}
                                        onClick={() => onCustomerClick(x.id)}
                                    >
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
                                );
                            })}
                        </SectionBody>
                    </Section>
                    <Section>
                        <SectionHeader className="px-5">
                            <SectionTitle>Orders</SectionTitle>
                        </SectionHeader>
                        <SectionBody role="list">
                            {data.orderHistory.map((x) => {
                                const customer = data.customers.find(
                                    (customer) => customer.id === x.customerId,
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
                                                {x.items.map((item) => {
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
    const restaurantIdentifier = query.restaurantIdentifier as string;
    return {
        props: {
            trpcState: ssg.dehydrate(),
            tableId,
            restaurantIdentifier,
        },
    };
}

const TableStat: React.FC<{ label: string; value: string }> = ({
    label,
    value,
}) => {
    return (
        <section className="flex flex-col items-center justify-center gap-1 text-sm">
            <header>
                <h2>{label}</h2>
            </header>
            <p className="font-medium">{value}</p>
        </section>
    );
};
