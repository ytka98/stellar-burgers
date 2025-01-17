import { FC, useMemo, useCallback } from 'react';
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

  // Закрытие модального окна заказа
  const handleCloseModal = useCallback(() => {
    dispatch(clearOrder());
    dispatch(resetConstructor());
    navigate('/');
  }, [dispatch, navigate]);

  // Подсчёт общей стоимости
  const price = useMemo(() => {
    const bunCost = (bun?.price || 0) * 2;
    const ingredientsCost = ingredients
      .map((item) => item.price)
      .reduce((a, b) => a + b, 0);
    return bunCost + ingredientsCost;
  }, [bun, ingredients]);

  // Обработка клика на "оформить заказ"
  const onOrderClick = useCallback(() => {
    if (!bun || orderRequest || !ingredients.length) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const dataToOrder = [
      bun._id,
      ...ingredients.map((item) => item._id),
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
      closeOrderModal={handleCloseModal}
    />
  );
};
