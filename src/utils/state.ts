import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type {
    OrderCreation,
    OrderItemCreationData,
    TableSessionCustomer,
} from "y/server/schemas";

const customersAtom = atomWithStorage<Array<TableSessionCustomer>>(
    "customers",
    [],
);
export const useCustomers = () => useAtomValue(customersAtom);

const setCustomersAtom = atom(
    null,
    (_, set, customers: TableSessionCustomer[]) => {
        set(customersAtom, customers);
    },
);
export const useSetCustomers = () => useSetAtom(setCustomersAtom);

const orderCreationAtom = atomWithStorage<OrderCreation | undefined>(
    "orderCreationData",
    undefined,
);
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

const addItemToOrderAtom = atom(
    null,
    (_, set, orderItem: OrderItemCreationData) => {
        set(orderCreationAtom, (order) => {
            if (!order) return;
            if (!order.items.some((x) => x.itemId === orderItem.itemId))
                order.items.push(orderItem);

            return order;
        });
    },
);
export const useAddItemToOrder = () => useSetAtom(addItemToOrderAtom);

const updateItemInOrderAtom = atom(
    null,
    (_, set, orderItem: OrderItemCreationData) => {
        set(orderCreationAtom, (order) => {
            if (!order) return;
            const itemIndex = order.items.findIndex(
                (x) => x.itemId === orderItem.itemId,
            );
            if (itemIndex === -1) return order;

            order.items[itemIndex] = orderItem;
            return { ...order };
        });
    },
);
export const useUpdateItemInOrder = () => useSetAtom(updateItemInOrderAtom);

const removeItemFromOrderAtom = atom(null, (_, set, itemId: string) => {
    set(orderCreationAtom, (order) => {
        if (!order) return;
        order.items = order.items.filter((x) => x.itemId !== itemId);
        return { ...order };
    });
});
export const useRemoveItemFromOrder = () => useSetAtom(removeItemFromOrderAtom);

const clearOrderAtom = atom(null, (_, set) => {
    set(orderCreationAtom, undefined);
});
export const useClearOrder = () => useSetAtom(clearOrderAtom);
