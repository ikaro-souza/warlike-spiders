import { IconChevronLeft, IconMinus, IconPlus } from "@tabler/icons-react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { TRPCError } from "@trpc/server";
import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import superjson from "superjson";
import {
    BottomAppBar,
    BottomAppBarPrimaryAction,
} from "y/components/bottom-app-bar";
import { Button } from "y/components/button";
import { appRouter } from "y/server/api/root";
import { createInnerTRPCContext } from "y/server/api/trpc";
import { getServerAuthSession } from "y/server/auth";
import { api } from "y/utils/api";
import { currencyFormatter } from "y/utils/locale";

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;
export default function Page({ itemId }: PageProps) {
    const router = useRouter();
    const { data } = api.menu.getMenuItem.useQuery(itemId);
    const [quantity, setQuantity] = React.useState(1);

    if (!data) return <></>;

    const changeQuantity = (action: "add" | "subtract") => {
        if (action === "add") {
            setQuantity(quantity + 1);
        } else {
            setQuantity(quantity - 1);
        }
    };

    return (
        <>
            <div className="flex h-screen flex-col pb-20">
                <header className="relative aspect-[4/3] overflow-clip">
                    <Image
                        src={data.image}
                        alt={data.name}
                        fill
                        sizes="400px"
                        aria-hidden
                        priority
                        className="object-cover"
                    />
                    <div
                        aria-hidden
                        className="absolute bottom-0 left-0 right-0 top-0 bg-black/50 backdrop-blur-md"
                    />
                    <div className="relative mx-auto aspect-square h-full">
                        <Image
                            src={data.image}
                            alt={data.name}
                            fill
                            sizes="400px"
                            aria-hidden
                            className="object-cover"
                        />
                    </div>
                    <div
                        role="toolbar"
                        className="fixed left-0 right-0 top-0 flex items-center p-4"
                    >
                        <div
                            className="bg-blur flex h-9 w-9 items-center justify-center rounded-full bg-white bg-opacity-10"
                            title="Go back"
                            aria-label="Go back"
                            role="button"
                            onClick={router.back}
                        >
                            <IconChevronLeft
                                aria-hidden
                                className="text-white"
                            />
                        </div>
                    </div>
                </header>
                <main className="flex flex-grow flex-col p-6">
                    <header className="flex flex-col gap-2 text-2xl">
                        <h1 className="line-clamp-3 flex-grow flex-wrap font-semibold">
                            {data.name}
                        </h1>
                        <p>{currencyFormatter.format(data.unitaryPrice)}</p>
                    </header>
                    <section aria-label="description" className="mt-4">
                        <p className="text-base">
                            {data.description ||
                                "Lorem ipsum dolor sit amet consectetur. Facilisi pretium gravida amet duis pellentesque ut morbi."}
                        </p>
                    </section>
                    <section className="mt-auto">
                        <OrderNote />
                    </section>
                </main>
            </div>
            <BottomAppBar>
                <div className="flex h-full flex-shrink items-center gap-2">
                    <Button
                        onClick={() => changeQuantity("subtract")}
                        className="h-12 w-12 text-black"
                        disabled={quantity === 1}
                    >
                        <IconMinus />
                    </Button>
                    <span className="font-medium">{quantity}</span>
                    <Button
                        onClick={() => changeQuantity("add")}
                        className="h-12 w-12 text-black"
                    >
                        <IconPlus />
                    </Button>
                </div>
                <BottomAppBarPrimaryAction className="flex flex-grow items-center">
                    <Button
                        variant="filled"
                        className="flex-grow rounded-full py-3"
                    >
                        Add{" "}
                        {currencyFormatter.format(quantity * data.unitaryPrice)}
                    </Button>
                </BottomAppBarPrimaryAction>
            </BottomAppBar>
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

function OrderNote() {
    return (
        <fieldset>
            <label htmlFor="order-note" className="sr-only">
                Note
            </label>
            <textarea
                id="order-note"
                placeholder="Please don't put this or that..."
                className="form-textarea w-full rounded ring-action"
                maxLength={255}
            ></textarea>
        </fieldset>
    );
}
