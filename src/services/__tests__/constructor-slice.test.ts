import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import {
  constructorReducer,
  addItemToConstructor,
  resetConstructor,
  removeItemFromConstructor,
  moveItemInConstructor,
  initialState
} from '../slices/constructor-slice';

type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  id: string;
};

const mockIngredients: Record<'bun' | 'main' | 'sauce', TIngredient> = {
  bun: {
    _id: '743e70b6d4f8c9002dfa194d',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 75,
    fat: 22,
    carbohydrates: 50,
    calories: 400,
    price: 1300,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    id: 'BunTestItemNew'
  },
  main: {
    _id: '743e70b6d4f8c9002dfa195e',
    name: 'Хрустящие минеральные кольца',
    type: 'main',
    proteins: 820,
    fat: 700,
    carbohydrates: 620,
    calories: 1000,
    price: 310,
    image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
    image_mobile:
      'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
    image_large:
      'https://code.s3.yandex.net/react/code/mineral_rings-large.png',
    id: 'MainDishTestNew'
  },
  sauce: {
    _id: '743e70b6d4f8c9002dfa196f',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 35,
    fat: 18,
    carbohydrates: 42,
    calories: 35,
    price: 95,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    id: 'SauceTestItemNew'
  }
};

describe('Проверка слайса конструктора бургера', () => {
  it('Добавление булки: экшен выполняется правильно', () => {
    const newState = constructorReducer(
      initialState,
      addItemToConstructor(mockIngredients.bun)
    );
    expect(newState.bun).toEqual({
      ...mockIngredients.bun,
      id: newState.bun?.id
    });
  });

  it('Добавление ингредиента: экшен выполняется правильно', () => {
    const newState = constructorReducer(
      initialState,
      addItemToConstructor(mockIngredients.main)
    );
    const expectedResult = [
      { ...mockIngredients.main, id: newState.ingredients[0].id }
    ];
    expect(newState.ingredients).toEqual(expectedResult);
  });

  it('Удаление ингредиента: экшен выполняется правильно', () => {
    const preloadedState = {
      ...initialState,
      ingredients: [{ ...mockIngredients.sauce }]
    };
    const newState = constructorReducer(
      preloadedState,
      removeItemFromConstructor(mockIngredients.sauce.id)
    );
    expect(newState.ingredients).toEqual([]);
  });

  describe('Перемещение ингредиента: экшен выполняется правильно', () => {
    it('Перемещение ингредиента вверх: экшен выполняется правильно', () => {
      const initialStateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredients.main, mockIngredients.sauce]
      };
      const action = moveItemInConstructor({ index: 1, move: 'up' });
      const newState = constructorReducer(initialStateWithIngredients, action);
      expect(newState.ingredients[0]).toEqual(mockIngredients.sauce);
      expect(newState.ingredients[1]).toEqual(mockIngredients.main);
    });

    it('Перемещение ингредиента вниз: экшен выполняется правильно', () => {
      const initialStateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredients.main, mockIngredients.sauce]
      };
      const action = moveItemInConstructor({ index: 0, move: 'down' });
      const newState = constructorReducer(initialStateWithIngredients, action);
      expect(newState.ingredients[0]).toEqual(mockIngredients.sauce);
      expect(newState.ingredients[1]).toEqual(mockIngredients.main);
    });
  });

  it('Очистка конструктора: экшен выполняется правильно', () => {
    const preloadedState = {
      ...initialState,
      ingredients: [mockIngredients.sauce, mockIngredients.main],
      bun: mockIngredients.bun
    };
    const newState = constructorReducer(preloadedState, resetConstructor());
    expect(newState).toEqual(initialState);
  });

  it('Неизвестный экшен: состояние остается неизменным', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' } as any;
    const newState = constructorReducer(initialState, unknownAction);
    expect(newState).toEqual(initialState);
  });
});
