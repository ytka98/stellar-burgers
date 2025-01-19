import { FC, useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { getOrdersThunk } from '../../services/slices/orders-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    dispatch(getOrdersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
