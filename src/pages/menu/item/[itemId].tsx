import { IconChevronLeft } from "@tabler/icons-react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { TRPCError } from "@trpc/server";
import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import superjson from "superjson";
import { appRouter } from "y/server/api/root";
import { createInnerTRPCContext } from "y/server/api/trpc";
import { getServerAuthSession } from "y/server/auth";
import { api } from "y/utils/api";
import { currencyFormatter } from "y/utils/locale";

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
export default function Page({ itemId }: PageProps) {
    const router = useRouter();
    const { data } = api.menu.getMenuItem.useQuery(itemId);
    if (!data) return <></>;

    return (
        <>
            <header className="relative aspect-video overflow-clip bg-black">
                <Image
                    src={data.image}
                    alt={data.name}
                    fill
                    className="object-cover blur-[80px]"
                    aria-hidden
                />
                <div className="aspect-square">
                    <Image
                        src={data.image}
                        alt={data.name}
                        fill
                        aria-hidden
                        className="object-contain"
                    />
                </div>
                <div
                    role="toolbar"
                    className="fixed left-0 right-0 top-0 flex items-center p-4"
                >
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white bg-opacity-[.12]"
                        title="Go back"
                        aria-label="Go back"
                        role="button"
                        onClick={router.back}
                    >
                        <IconChevronLeft aria-hidden className="text-white" />
                    </div>
                </div>
            </header>
            <main className="p-6">
                <header className="flex items-center gap-3 text-2xl">
                    <h1 className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                        {data.name}
                    </h1>
                    <p>{currencyFormatter.format(data.unitaryPrice)}</p>
                </header>
                <p className="mt-4 text-base">
                    {data.description ||
                        "Lorem ipsum dolor sit amet consectetur. Facilisi pretium gravida amet duis pellentesque ut morbi."}
                </p>
            </main>
        </>
    );
}

export async function getServerSideProps({
    req,
    res,
    params,
}: GetServerSidePropsContext) {
    const itemId = params?.itemId as string | undefined;
    if (!itemId) {
        return {
            notFound: true,
        };
    }

    const session = await getServerAuthSession({ req, res });

    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: createInnerTRPCContext({ session }),
        transformer: superjson,
    });

    try {
        await ssg.menu.getMenuItem.prefetch(itemId);
    } catch (error) {
        if (error instanceof TRPCError && error.code === "NOT_FOUND") {
            return {
                notFound: true,
            };
        }
    }

    return {
        props: {
            trpcState: ssg.dehydrate(),
            itemId,
        },
    };
}
