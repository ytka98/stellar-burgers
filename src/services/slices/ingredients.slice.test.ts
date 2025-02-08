import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import {
  initialState,
  ingredientsReducer,
  getIngredientsThunk
} from './ingredients-slice';

describe('Проверка слайса ингредиентов бургера', () => {
  const mockIngredients = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      id: 'TestBun'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      id: 'TestMain'
    },
    {
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
  ];

  // Функция для создания экшенов
  const createAction = (type: string, payload: any = {}) => ({
    type,
    payload
  });

  // Функция для создания ожидаемого состояния
  const getExpectedState = (overrides: Partial<typeof initialState> = {}) => ({
    ...initialState,
    ...overrides
  });

  it('Инициализация начального состояния', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = ingredientsReducer(undefined, action);
    expect(state).toEqual(initialState);
  });

  // При вызове экшена Request булевая переменная, отвечающая за текущий запрос (например, store.isLoading) меняется на true.

  it('Обработка экшена getIngredientsThunk.pending', () => {
    const action = createAction(getIngredientsThunk.pending.type);
    const expectedState = getExpectedState({ loading: true, error: null });
    const newState = ingredientsReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  it('Неизменное состояние при неизвестном экшене', () => {
    const action = createAction('UNKNOWN_ACTION');
    const newState = ingredientsReducer(initialState, action);
    expect(newState).toBe(initialState);
  });

  // При вызове экшена Success и передаче в него ингредиентов эти данные записываются в стор (например, в store.data) и store.isLoading меняется на false.

  it('Правильно обрабатывает экшен getIngredientsThunk.fulfilled при пустом списке ингредиентов', () => {
    const emptyIngredients: any[] = [];
    const action = createAction(
      getIngredientsThunk.fulfilled.type,
      emptyIngredients
    );
    const expectedState = getExpectedState({
      loading: false,
      ingredients: emptyIngredients,
      buns: [],
      mains: [],
      sauces: []
    });
    const newState = ingredientsReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  // Здесь loading меняется на false, а список ингредиентов сохраняется в store.ingredients (пусть он и пустой).

  it('Проверка распределения ингредиентов по типам', () => {
    const action = createAction(
      getIngredientsThunk.fulfilled.type,
      mockIngredients
    );
    const newState = ingredientsReducer(initialState, action);
    expect(newState.buns.length).toBe(1);
    expect(newState.mains.length).toBe(1);
    expect(newState.sauces.length).toBe(1);
  });

  it('Проверка состояния loading при получении ингредиентов', () => {
    const action = createAction(getIngredientsThunk.pending.type);
    const newState = ingredientsReducer(initialState, action);
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('Проверка, что в каждой категории есть хотя бы 1 элемент', () => {
    const action = createAction(
      getIngredientsThunk.fulfilled.type,
      mockIngredients
    );
    const newState = ingredientsReducer(initialState, action);

    // Проверка, что в каждой категории ингредиентов есть хотя бы один элемент
    expect(newState.buns.length).toBeGreaterThan(0);
    expect(newState.mains.length).toBeGreaterThan(0);
    expect(newState.sauces.length).toBeGreaterThan(0);
  });

  // При вызове экшена Failed и передаче в него ошибки она записывается в стор (например, store.error) и store.isLoading меняется на false.
  
  it('Обработка экшена getIngredientsThunk.rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const action = {
      type: getIngredientsThunk.rejected.type,
      error: { message: errorMessage },
    };
    const expectedState = getExpectedState({ loading: false, error: errorMessage });
    const newState = ingredientsReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });
  

  it('Проверка уникальности названия каждого ингредиента', () => {
    const action = createAction(
      getIngredientsThunk.fulfilled.type,
      mockIngredients
    );
    const newState = ingredientsReducer(initialState, action);

    // Проверка уникальности названий
    const names = newState.ingredients.map((ingredient) => ingredient.name);
    const uniqueNames = new Set(names);

    // Проверка, что все названия уникальны
    expect(names.length).toBe(uniqueNames.size);
  });
  
});
