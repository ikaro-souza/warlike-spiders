import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { DateTime } from "luxon";
import type { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import superjson from "superjson";
import { Section, SectionBody, SectionHeader } from "y/components/section";
import { TopAppBar } from "y/components/top-app-bar";
import { appRouter } from "y/server/api/root";
import { createInnerTRPCContext } from "y/server/api/trpc";
import { getServerAuthSession } from "y/server/auth";
import { type TableStatus, type WaiterShiftSummary } from "y/server/schemas";
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
    await ssg.table.getWaiterShiftSummary.prefetch();

    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
    };
}

function Page() {
    const { data } = api.table.getWaiterShiftSummary.useQuery();

    return (
        <>
            <TopAppBar />
            <main className="container flex flex-col gap-9 pb-5 pt-4">
                <header className="flex shrink-0 flex-col items-center gap-3">
                    <Image
                        src="https://api.dicebear.com/6.x/avataaars/svg?seed=Sammy"
                        alt="Sammy's profile picture"
                        height={PROFILE_IMAGE_SIZE}
                        width={PROFILE_IMAGE_SIZE}
                        className="rounded-full bg-black"
                    />
                    <p>Sammy Scooter</p>
                </header>
                <Summary data={data} />
                <Section>
                    <SectionHeader
                        title="Tables"
                        subtitle={
                            <>
                                {data &&
                                    `You are serving ${data.servingTables.length
                                        .toString()
                                        .padStart(2, "0")} tables`}
                                {!data && "loading"}
                            </>
                        }
                        className="px-5"
                    />
                    <SectionBody
                        aria-label="Tables being served"
                        className="flex flex-col gap-3"
                    >
                        {data &&
                            data.servingTables.map(x => (
                                <TableItem key={x.number} {...x} />
                            ))}
                    </SectionBody>
                </Section>
            </main>
        </>
    );
}

export default Page;

const PROFILE_IMAGE_SIZE = 120;

type SummaryProps = {
    data: WaiterShiftSummary | undefined;
};

const Summary: React.FC<SummaryProps> = ({ data }) => {
    return !data ? (
        <p>loading...</p>
    ) : (
        <section
            aria-label="Shift summary"
            className="grid w-full grid-cols-2 grid-rows-2"
        >
            <SummaryItem
                label={"Estimated tips"}
                value={currencyFormatter.format(data.estimatedTips)}
            />
            <SummaryItem
                label={"Total sold"}
                value={currencyFormatter.format(data.totalSold)}
            />
            <SummaryItem label={"Tables closed"} value={data.totalOrdered} />
            <SummaryItem
                label={"Serving Tables"}
                value={data.servingTables.length.toString().padStart(2, "0")}
            />
        </section>
    );
};

type SummaryItemProps = {
    label: string;
    value: React.ReactNode;
};
const SummaryItem: React.FC<SummaryItemProps> = ({ label, value }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 bg-white px-5 py-4 text-center">
            <h3 className="text-sm">{label}</h3>
            <p className="text-2xl font-semibold">{value}</p>
        </div>
    );
};

type TableItemProps = {
    id: string;
    lastOrder: Date;
    number: number;
    status: TableStatus;
};
const TableItem: React.FC<TableItemProps> = ({
    id,
    lastOrder,
    number,
    status,
}) => {
    const statusText = React.useMemo(() => {
        switch (status) {
            case "requesting_waiter":
                return "Calling for you";
            case "ordering":
                return "Ordering";
            case "waiting_order":
                return "Waiting order";
            default:
                return "Idle";
        }
    }, [status]);

    const lastOrderText = React.useMemo((): [
        number,
        "seconds" | "minutes" | "hours",
    ] => {
        const timeDiff =
            DateTime.now().diff(DateTime.fromJSDate(lastOrder)).toMillis() /
            1000;
        const unit =
            timeDiff < 60 ? "seconds" : timeDiff < 3600 ? "minutes" : "hours";
        const value =
            timeDiff < 60
                ? timeDiff
                : timeDiff < 3600
                ? timeDiff / 60
                : timeDiff / 3600;

        return [Math.round(-value), unit];
    }, [lastOrder]);

    return (
        <Link passHref href={`/table/${id}`}>
            <li className="grid grid-cols-2 grid-rows-[auto_1fr] gap-2 rounded-xl bg-white px-2 py-3">
                <p className="col-span-2 row-span-1 text-center text-xs">
                    Table {number.toString().padStart(2, "0")}
                </p>
                <div className="col-start-1 col-end-1 row-span-2 flex flex-col gap-0.5 text-center text-sm">
                    <span>Last order</span>
                    <span className="font-medium">
                        {new Intl.RelativeTimeFormat("en-US", {
                            style: "short",
                            numeric: "always",
                        }).format(...lastOrderText)}
                    </span>
                </div>
                <div className="col-start-2 row-span-2 flex flex-col gap-0.5 text-center text-sm">
                    <span>Status</span>
                    <span className="font-medium">{statusText}</span>
                </div>
            </li>
        </Link>
    );
};
