import { FC, useMemo, useCallback } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { resetConstructor } from '../../services/slices/constructor-slice';
import {
  newOrderThunk,
  clearOrder
} from '../../services/slices/newOrder-slice';
import { getUser } from '../../services/slices/user-slice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { orderRequest, order } = useSelector((state) => state.newOrder);
  const user = useSelector(getUser);

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrder());
    dispatch(resetConstructor());
    navigate('/');
  }, [dispatch, navigate]);

  const price = useMemo(() => {
    const totalBunPrice = bun ? bun.price * 2 : 0;
    const totalIngredientsPrice = ingredients.reduce(
      (sum: number, { price }: TConstructorIngredient) => sum + price,
      0
    );
    return totalBunPrice + totalIngredientsPrice; 
  }, [bun, ingredients]);
  const onOrderClick = useCallback(() => {
    if (!bun || orderRequest || !ingredients.length) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const dataToOrder = [
      bun._id,
      ...ingredients.map(({ _id }) => _id),
      bun._id
    ];
    dispatch(newOrderThunk(dataToOrder));
  }, [bun, ingredients, user, orderRequest, dispatch, navigate]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={order}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
