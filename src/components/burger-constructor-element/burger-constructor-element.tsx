import { FC, memo, useCallback } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveItemInConstructor,
  removeItemFromConstructor
} from '../../services/slices/constructor-slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Функция для перемещения элемента вверх
    const handleMoveUp = useCallback(() => {
      dispatch(moveItemInConstructor({ index, move: 'up' }));
    }, [dispatch, index]);

    // Функция для перемещения элемента вниз
    const handleMoveDown = useCallback(() => {
      dispatch(moveItemInConstructor({ index, move: 'down' }));
    }, [dispatch, index]);

    const handleClose = useCallback(() => {
      dispatch(removeItemFromConstructor(ingredient.id));
    }, [dispatch, ingredient.id]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
