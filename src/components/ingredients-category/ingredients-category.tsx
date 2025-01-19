import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '@ui';
import { useSelector } from '../../services/store';
import { getConstructorState } from '../../services/slices/constructor-slice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector(getConstructorState);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    // Используем reduce для подсчета количества ингредиентов
    const counters = ingredients.reduce(
      (acc: { [key: string]: number }, ingredient: TIngredient) => {
        // Увеличиваем счетчик ингредиента, если он уже есть, или инициализируем его с 1
        acc[ingredient._id] = (acc[ingredient._id] || 0) + 1;
        return acc;
      },
      {}
    );
    if (bun) {
      // Если есть булочка (bun), устанавливаем ее количество равным 2
      counters[bun._id] = 2;
    }
    // Возвращаем объект с подсчитанными ингредиентами
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
