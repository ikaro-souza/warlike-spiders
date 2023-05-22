import { IconCircleX, IconUserCircle } from "@tabler/icons-react";
import React from "react";
import {
    BottomAppBar,
    BottomAppBarAction,
    BottomAppBarActions,
    BottomAppBarPrimaryAction,
} from "y/components/bottom-app-bar";
import { Button } from "y/components/button";
import {
    ListItem,
    ListItemContent,
    ListItemHeadline,
    ListItemImage,
    ListItemLeading,
    ListItemOverline,
    ListItemSupportingText,
    ListItemTrailing,
} from "y/components/list-item";
import { QuantityCounter } from "y/components/quanitity-counter";
import {
    Section,
    SectionBody,
    SectionFooter,
    SectionHeader,
} from "y/components/section";
import { TopAppBar } from "y/components/top-app-bar";
import { useRouter } from "y/lib/router";
import { type OrderItemCreationData } from "y/server/schemas";
import { currencyFormatter } from "y/utils/locale";
import {
    useClearOrder,
    useCustomers,
    useOrderCreationValue,
    useRemoveItemFromOrder,
    useUpdateItemInOrder,
} from "y/utils/state";

function Page() {
    const order = useOrderCreationValue();
    const clearOrder = useClearOrder();
    const router = useRouter();
    const totalOrdered = React.useMemo(() => {
        if (!order) return 0;
        return order.items.reduce(
            (acc, orderItem) =>
                acc + orderItem.itemQuantity * orderItem.item.unitaryPrice,
            0,
        );
    }, [order]);

    const onConfirmClick = () => {
        clearOrder();
        router.go(-2);
    };

    const onClearOrderClick = () => {
        clearOrder();
        router.go(-2);
    };

    if (!order) {
        return (
            <>
                <TopAppBar title={"Table's 08 order"} showPreviousButton />
                <main className="flex flex-col gap-4 pt-5">Empty</main>
            </>
        );
    }

    return (
        <>
            <TopAppBar title={"Table's 08 order"} showPreviousButton />
            <main className="flex flex-col gap-4 pt-5">
                <Section className="bg-white">
                    <SectionHeader className="sr-only">
                        order items
                    </SectionHeader>
                    <SectionBody role="list">
                        {order.items.map((orderItem) => (
                            <OrderItem
                                key={orderItem.itemId}
                                orderItem={orderItem}
                            />
                        ))}
                    </SectionBody>
                    <SectionFooter className="-mt-4 px-5 py-3">
                        <p className="text-xl font-medium">
                            Total: {currencyFormatter.format(totalOrdered)}
                        </p>
                    </SectionFooter>
                </Section>
                <Section className="bg-white">
                    <SectionHeader className="sr-only">customer</SectionHeader>
                    <SelectedCustomer customerId={order.customerId} />
                </Section>
            </main>
            <BottomAppBar>
                <BottomAppBarActions shrink>
                    <BottomAppBarAction>
                        <Button
                            variant="icon"
                            className="h-full w-full text-black"
                            onClick={onClearOrderClick}
                        >
                            <IconCircleX />
                        </Button>
                    </BottomAppBarAction>
                    <BottomAppBarAction>
                        <Button
                            variant="icon"
                            className="h-full w-full text-black"
                        >
                            <IconUserCircle />
                        </Button>
                    </BottomAppBarAction>
                </BottomAppBarActions>
                <BottomAppBarPrimaryAction className="flex flex-grow items-center">
                    <Button
                        variant="filled"
                        className="flex-grow rounded-full py-3"
                        onClick={onConfirmClick}
                    >
                        Confirm
                    </Button>
                </BottomAppBarPrimaryAction>
            </BottomAppBar>
        </>
    );
}

export default Page;

function OrderItem({ orderItem }: { orderItem: OrderItemCreationData }) {
    const updateItem = useUpdateItemInOrder();
    const removeItem = useRemoveItemFromOrder();

    const { image, name, unitaryPrice } = orderItem.item;

    const onQuantityChange = (quantity: number) => {
        if (quantity === 0) {
            removeItem(orderItem.itemId);
        } else {
            orderItem.itemQuantity = quantity;
            updateItem(orderItem);
        }
    };

    return (
        <ListItem>
            <ListItemContent>
                <ListItemHeadline className="font-medium">
                    {name}
                </ListItemHeadline>
                <ListItemSupportingText>
                    {currencyFormatter.format(
                        unitaryPrice * orderItem.itemQuantity,
                    )}
                </ListItemSupportingText>
                <ListItemSupportingText>
                    <QuantityCounter
                        buttonsClassName="w-8 h-8"
                        quantity={orderItem.itemQuantity}
                        onChange={onQuantityChange}
                    />
                </ListItemSupportingText>
            </ListItemContent>
            <ListItemTrailing>
                <ListItemImage
                    url={image}
                    alt={name}
                    className="h-16 w-16 rounded-lg"
                    priority
                />
            </ListItemTrailing>
        </ListItem>
    );
}

type SelectedCustomerProps = { customerId: string | undefined };
function SelectedCustomer({ customerId }: SelectedCustomerProps) {
    const customers = useCustomers();
    const customer = React.useMemo(
        () => customers.find((c) => c.id === customerId),
        [customers, customerId],
    );

    return (
        <ListItem role="button">
            {customer ? (
                <>
                    <ListItemLeading>
                        <ListItemImage
                            alt={customer.name}
                            url={customer.image}
                        />
                    </ListItemLeading>
                    <ListItemContent>
                        <ListItemOverline className="opacity-50">
                            Ordering for
                        </ListItemOverline>
                        <ListItemHeadline>{customer.name}</ListItemHeadline>
                    </ListItemContent>
                </>
            ) : (
                <>
                    <ListItemContent>
                        <ListItemHeadline>
                            Who is this order for?
                        </ListItemHeadline>
                    </ListItemContent>
                </>
            )}
            <ListItemLeading className="flex items-center">
                <Button>{customer ? "Change" : "Choose"}</Button>
            </ListItemLeading>
        </ListItem>
    );
}
