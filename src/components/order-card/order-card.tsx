import { useLocation } from 'react-router-dom';
import { FC, memo, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '@ui';
import { OrderCardProps } from './type';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients-slice';

const maxIngredients = 4;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const { ingredients } = useSelector(getIngredients);

  if (ingredients.length === 0) return null;
  // Используем useMemo для оптимизации вычислений и предотвращения лишних рендеров.
  const orderInfo = useMemo(() => {
    const ingredientMap = Object.fromEntries(
      ingredients.map((ingredient) => [ingredient._id, ingredient])
    );

    // Получаем информацию о каждом ингредиенте из заказа, исключая несуществующие.
    const ingredientsInfo = order.ingredients
      .map((ingredientId) => ingredientMap[ingredientId])
      .filter((item) => item !== undefined);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow: ingredientsInfo.slice(0, maxIngredients),
      remains: Math.max(0, ingredientsInfo.length - maxIngredients),
      total: ingredientsInfo.reduce((sum, item) => sum + item.price, 0),
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);

  return orderInfo ? (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  ) : null;
});
