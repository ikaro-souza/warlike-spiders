import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type {
    OrderCreation,
    OrderItemCreationData,
    TableSessionCustomer,
} from "y/server/schemas";

const customersAtom = atom<TableSessionCustomer[]>([]);
export const useCustomers = () => useAtom(customersAtom);

export const useSetCustomers = () => {
    const set = useSetAtom(customersAtom);
    return (customers: TableSessionCustomer[]) => set(customers);
};

const orderCreationAtom = atomWithStorage<OrderCreation | undefined>(
    "orderCreationData",
    undefined,
);
export const useOrderCreation = () => useAtom(orderCreationAtom);
export const useOrderCreationValue = () => useAtomValue(orderCreationAtom);

const setOrderCreationAtom = atom(
    null,
    (_, set, orderCreation: OrderCreation) => {
        set(orderCreationAtom, orderCreation);
    },
);
export const useSetOrderCreation = () => useSetAtom(setOrderCreationAtom);

const setOrderCreationCustomerAtom = atom(
    null,
    (_, set, customerId: string) => {
        set(orderCreationAtom, (order) => {
            if (!order) {
                order = {
                    customerId,
                    items: [],
                };
            } else {
                order.customerId = customerId;
            }
            return order;
        });
    },
);
export const useSetOrderCreationCustomer = () =>
    useSetAtom(setOrderCreationCustomerAtom);

const addItemToOrderAtom = atom(null, (_, set, item: OrderItemCreationData) => {
    set(orderCreationAtom, (order) => {
        if (!order) return;
        if (!order.items.some((i) => i.itemId === item.itemId))
            order.items.push(item);

        return order;
    });
});
export const useAddItemToOrder = () => useSetAtom(addItemToOrderAtom);

const updateItemInOrderAtom = atom(
    null,
    (_, set, item: OrderItemCreationData) => {
        set(orderCreationAtom, (order) => {
            if (!order) return;
            const itemIndex = order.items.findIndex(
                (x) => x.itemId === item.itemId,
            );
            if (itemIndex === -1) return order;

            order.items[itemIndex] = item;
            return { ...order };
        });
    },
);
export const useUpdateItemInOrder = () => useSetAtom(updateItemInOrderAtom);

const removeItemFromOrderAtom = atom(null, (_, set, itemId: string) => {
    set(orderCreationAtom, (order) => {
        if (!order) return;
        order.items = order.items.filter((i) => i.itemId !== itemId);
        return { ...order };
    });
});
export const useRemoveItemFromOrder = () => useSetAtom(removeItemFromOrderAtom);
