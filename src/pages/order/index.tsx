import { IconCircleX, IconUserCircle } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import React from "react";
import {
    BottomAppBar,
    BottomAppBarAction,
    BottomAppBarActions,
    BottomAppBarPrimaryAction,
} from "y/components/bottom-app-bar";
import { type BottomSheetComposition } from "y/components/bottom-sheet";
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
    SectionTitle,
} from "y/components/section";
import { TopAppBar } from "y/components/top-app-bar";
import { useRouter } from "y/lib/router";
import { type OrderItemCreationData } from "y/server/schemas";
import { api } from "y/utils/api";
import { currencyFormatter } from "y/utils/locale";
import {
    useClearOrder,
    useCustomers,
    useOrderCreationValue,
    useRemoveItemFromOrder,
    useSetOrderCreationCustomer,
    useUpdateItemInOrder,
} from "y/utils/state";
const BottomSheet = dynamic(
    () => import("y/components/bottom-sheet").then((mod) => mod.BottomSheet),
    { ssr: false },
) as BottomSheetComposition;

function Page() {
    const order = useOrderCreationValue();
    const clearOrder = useClearOrder();
    const router = useRouter();
    const [bottomSheetIsOpen, setBottomSheetIsOpen] = React.useState(false);
    const customers = useCustomers();
    const setOrderCustomer = useSetOrderCreationCustomer();
    const {
        mutate: createOrder,
        isLoading,
        isSuccess,
    } = api.order.createOrder.useMutation({
        onSuccess: () => {
            clearOrder();
            router.go(-2);
        },
    });
    const totalOrdered = React.useMemo(() => {
        if (!order) return 0;
        return order.items.reduce(
            (acc, orderItem) =>
                acc + orderItem.itemQuantity * orderItem.item.unitaryPrice,
            0,
        );
    }, [order]);

    const onConfirmClick = () => {
        if (!order) return;
        createOrder(order);
    };

    const onClearOrderClick = () => {
        clearOrder();
        router.go(-2);
    };

    const onCustomerSelected = (customerId: string) => {
        if (!order) return;
        setOrderCustomer(customerId);
        setBottomSheetIsOpen(false);
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
                        <SectionTitle>order items</SectionTitle>
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
                    <SectionHeader className="sr-only">
                        <SectionTitle>customer</SectionTitle>
                    </SectionHeader>
                    <SelectedCustomer
                        customerId={order.customerId}
                        onClick={() => setBottomSheetIsOpen(true)}
                    />
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
                            onClick={() => setBottomSheetIsOpen(true)}
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
                        disabled={isLoading || isSuccess}
                    >
                        Confirm
                    </Button>
                </BottomAppBarPrimaryAction>
            </BottomAppBar>
            <BottomSheet
                open={bottomSheetIsOpen}
                onClose={() => setBottomSheetIsOpen(false)}
            >
                <BottomSheet.Title>Customers on table</BottomSheet.Title>
                <ul>
                    {customers.map((customer) => (
                        <ListItem
                            key={customer.id}
                            className="!px-0"
                            onClick={() => onCustomerSelected(customer.id)}
                        >
                            <ListItemLeading>
                                <ListItemImage
                                    alt={customer.name}
                                    url={customer.image}
                                />
                            </ListItemLeading>
                            <ListItemContent>
                                <ListItemHeadline>
                                    {customer.name}
                                </ListItemHeadline>
                            </ListItemContent>
                            <ListItemTrailing className="flex items-center">
                                <Button
                                    variant="text"
                                    onClick={() =>
                                        onCustomerSelected(customer.id)
                                    }
                                >
                                    Select
                                </Button>
                            </ListItemTrailing>
                        </ListItem>
                    ))}
                </ul>
            </BottomSheet>
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

type SelectedCustomerProps = {
    customerId: string | undefined;
    onClick: VoidFunction;
};
function SelectedCustomer({ customerId, onClick }: SelectedCustomerProps) {
    const customers = useCustomers();
    const customer = React.useMemo(
        () => customers.find((c) => c.id === customerId),
        [customers, customerId],
    );

    return (
        <ListItem role="button" onClick={onClick}>
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
                <Button onClick={onClick}>
                    {customer ? "Change" : "Choose"}
                </Button>
            </ListItemLeading>
        </ListItem>
    );
}
