import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '@ui';

import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients-slice';

const maxIngredients = 4;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector(getIngredients).ingredients;

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientMap = ingredients.reduce(
      (map, ingredient) => {
        map[ingredient._id] = ingredient;
        return map;
      },
      {} as Record<string, TIngredient>
    );

    const ingredientsInfo = order.ingredients
      .map((ingredientId) => ingredientMap[ingredientId])
      .filter(Boolean);

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
