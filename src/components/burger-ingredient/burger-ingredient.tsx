import { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addItemToConstructor } from '../../services/slices/constructor-slice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    // Получение текущего расположения (URL), используется для передачи состояния в React Router
    const dispatch = useDispatch();
    // Получение функции dispatch для отправки экшенов в Redux
    const handleAdd = useCallback(() => {
      dispatch(addItemToConstructor(ingredient));
      // Отправка экшена с данными ингредиента
    }, [dispatch, ingredient]);
    // Зависимости: пересоздавать функцию только если изменятся dispatch или ingredient

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
