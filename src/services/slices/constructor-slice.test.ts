import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import {
  constructorReducer,
  addItemToConstructor,
  resetConstructor,
  removeItemFromConstructor,
  moveItemInConstructor,
  initialState
} from './constructor-slice';

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
    _id: "643d69a5c3f7b9001cfa093c",
    name: "Краторная булка N-200i",
    type: "bun",
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: "https://code.s3.yandex.net/react/code/bun-02.png",
    image_mobile: "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
    image_large: "https://code.s3.yandex.net/react/code/bun-02-large.png",
    id: 'TestBun'
  },
  main: {
    _id: "643d69a5c3f7b9001cfa0946",
    name: "Хрустящие минеральные кольца",
    type: "main",
    proteins: 808,
    fat: 689,
    carbohydrates: 609,
    calories: 986,
    price: 300,
    image: "https://code.s3.yandex.net/react/code/mineral_rings.png",
    image_mobile: "https://code.s3.yandex.net/react/code/mineral_rings-mobile.png",
    image_large: "https://code.s3.yandex.net/react/code/mineral_rings-large.png",
    id: 'TestMain'
  },
  sauce: {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    id: 'TestSauce'
  }
};

describe('Проверка слайса конструктора бургера', () => {
  it('Добавление булки', () => {
    const newState = constructorReducer(
      initialState,
      addItemToConstructor(mockIngredients.bun)
    );
    expect(newState.bun).toEqual({
      ...mockIngredients.bun,
      id: newState.bun?.id
    });
  }); 
  
  it('Проверяет обработку экшена добавления ингредиента', () => {
    const newState = constructorReducer(
      initialState,
      addItemToConstructor(mockIngredients.main)
    );
    const expectedResult = [
      { ...mockIngredients.main, id: newState.ingredients[0].id }
    ];
    expect(newState.ingredients).toEqual(expectedResult);
  });

  it('Проверяет обработку экшена удаления ингредиента', () => {
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

  describe('Проверяет обработку экшена перемещения ингредиента', () => {
    it('Проверяет перемещение ингредиента "вверх"', () => {
      const initialStateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredients.main, mockIngredients.sauce]
      };
      const action = moveItemInConstructor({ index: 1, move: 'up' });
      const newState = constructorReducer(initialStateWithIngredients, action);
      expect(newState.ingredients[0]).toEqual(mockIngredients.sauce);
      expect(newState.ingredients[1]).toEqual(mockIngredients.main);
    });

    it('Проверяет перемещение ингредиента "вниз"', () => {
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

  it('Очистка конструктора', () => {
    const preloadedState = {
      ...initialState,
      ingredients: [mockIngredients.sauce, mockIngredients.main],
      bun: mockIngredients.bun
    };
    const newState = constructorReducer(preloadedState, resetConstructor());
    expect(newState).toEqual(initialState);
  });

  it('Неизменность состояния при неизвестном экшене', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' } as any;
    const newState = constructorReducer(initialState, unknownAction);
    expect(newState).toEqual(initialState);
  });
});
