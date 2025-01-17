import { FC, useMemo } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui';
import { useSelector } from '../../services/store';
import { getFeedsState } from '../../services/slices/feed-slice';

// Функция для получения заказов по статусу
function getOrders(orders: TOrder[], status: string): number[] {
  return orders
    .filter(function (order) {
      return order.status === status;
    })
    .map(function (order) {
      return order.number;
    })
    .slice(0, 20);
}

export const FeedInfo: FC = function () {
  // Извлечение данных из хранилища
  const { orders, total, totalToday } = useSelector(getFeedsState);

  // Мемоизация данных о ленте
  const feed = useMemo(
    function () {
      return { total, totalToday };
    },
    [total, totalToday]
  );

  // Мемоизация готовых и ожидающих заказов
  const readyOrders = useMemo(
    function () {
      return getOrders(orders, 'done');
    },
    [orders]
  );

  const pendingOrders = useMemo(
    function () {
      return getOrders(orders, 'pending');
    },
    [orders]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
