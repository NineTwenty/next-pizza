import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { PositionState } from 'hooks/usePositionForm';

export type OrderEntry = {
  categoryId: number;
  positionId: number;
  positionName: string;
  amount: number;
  totalPrice: number;
  order: PositionState[];
};

type OrderParams = Omit<OrderEntry, 'amount'>;

type OrdersContextValue = {
  orders: OrderEntry[];
  ordersIds: number[];
  addOrder: (order: OrderParams) => void;
  updateOrder: (order: OrderParams, amount?: number) => void;
  deleteOrder: (orderId: number) => void;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function useOrders() {
  const values = useContext(OrdersContext);

  if (values === undefined) {
    throw new Error(
      'Context value is undefined. Hook must be within OrdersProvider'
    );
  }

  return values;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [ordersIds, setOrdersIds] = useState<number[]>([]);
  const [ordersMap, setOrdersMap] = useState<{ [key: number]: OrderEntry }>({});
  const orders = useMemo(
    () =>
      ordersIds
        .map((id) => ordersMap[id])
        .filter((order): order is OrderEntry => !!order?.positionName),
    [ordersIds, ordersMap]
  );

  const addOrder = useCallback(
    ({
      order,
      categoryId,
      positionId,
      positionName,
      totalPrice,
    }: OrderParams) => {
      if (!ordersIds.includes(positionId)) {
        setOrdersMap((currentOrders) => ({
          ...currentOrders,
          [positionId]: {
            amount: 1,
            order,
            categoryId,
            positionId,
            positionName,
            totalPrice,
          },
        }));
        setOrdersIds((currentOrdersIds) => [...currentOrdersIds, positionId]);
      }
    },
    [ordersIds]
  );

  const updateOrder = useCallback(
    (
      { order, categoryId, positionId, positionName, totalPrice }: OrderParams,
      amount = 1
    ) => {
      if (ordersIds.includes(positionId)) {
        setOrdersMap((currentOrders) => ({
          ...currentOrders,
          [positionId]: {
            amount,
            order,
            categoryId,
            positionId,
            positionName,
            totalPrice,
          },
        }));
      }
    },
    [ordersIds]
  );

  const deleteOrder = useCallback(
    (orderId: number) => {
      if (ordersIds.includes(orderId)) {
        setOrdersMap((currentOrders) => {
          const { [orderId]: deletedOrder, ...rest } = currentOrders;
          return rest;
        });

        setOrdersIds((currentOrdersIds) =>
          currentOrdersIds.filter((id) => id !== orderId)
        );
      }
    },
    [ordersIds]
  );

  const values = useMemo(
    () => ({
      orders,
      ordersIds,
      addOrder,
      updateOrder,
      deleteOrder,
    }),
    [orders, ordersIds, addOrder, deleteOrder, updateOrder]
  );

  return (
    <OrdersContext.Provider value={values}>{children}</OrdersContext.Provider>
  );
}
