import {
    ListItem,
    ListItemContent,
    ListItemHeadline,
    ListItemImage,
    ListItemSupportingText,
    ListItemTrailing,
} from "y/components/list-item";
import { QuantityCounter } from "y/components/quanitity-counter";
import { Section, SectionBody } from "y/components/section";
import { TopAppBar } from "y/components/top-app-bar";
import { type OrderItemCreationData } from "y/server/schemas";
import { currencyFormatter } from "y/utils/locale";
import {
    useOrderCreationValue,
    useRemoveItemFromOrder,
    useUpdateItemInOrder,
} from "y/utils/state";

function Page() {
    const order = useOrderCreationValue();

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
                <Section>
                    <SectionBody role="list">
                        {order.items.map((item) => (
                            <OrderItem key={item.itemId} orderItem={item} />
                        ))}
                    </SectionBody>
                </Section>
            </main>
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
        <ListItem className="bg-white">
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
                    className="rounded-lg"
                    priority
                />
            </ListItemTrailing>
        </ListItem>
    );
}
