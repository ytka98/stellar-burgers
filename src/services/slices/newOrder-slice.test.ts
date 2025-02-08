import { initialState, newOrderReducer, newOrderThunk } from './newOrder-slice';
import { expect } from '@jest/globals';

describe('Проверка слайса нового заказа', () => {
  const mockOrder = {
    success: true,
    name: 'Краторный spicy био-марсианский бургер',
    order: {
      ingredients: [
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
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
          __v: 0
        },
        {
          _id: '643d69a5c3f7b9001cfa093e',
          name: 'Филе Люминесцентного тетраодонтимформа',
          type: 'main',
          proteins: 44,
          fat: 26,
          carbohydrates: 85,
          calories: 643,
          price: 988,
          image: 'https://code.s3.yandex.net/react/code/meat-03.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-03-large.png',
          __v: 0
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
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-02-large.png',
          __v: 0
        }
      ],
      _id: '1234567890abcdef12345678',
      owner: {
        name: 'Test User',
        email: 'testuser@example.com',
        createdAt: '2025-02-08T12:00:00.000Z',
        updatedAt: '2025-02-08T12:05:00.000Z'
      },
      status: 'done',
      name: 'Краторный spicy био-марсианский бургер',
      createdAt: '2025-02-08T12:00:00.000Z',
      updatedAt: '2025-02-08T12:00:00.000Z',
      number: 62729,
      price: 3024
    }
  };

  // Функция для создания действия с типом и данными
  const createAction = (type: string, payload: any = undefined) => ({
    type,
    payload
  });

  const testStateChange = (action: any, expectedState: any) => {
    const newState = newOrderReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  };

  test('Тестирование при обработке запроса', () => {
    const action = createAction(newOrderThunk.pending.type);
    const expectedState = { ...initialState, orderRequest: true };
    testStateChange(action, expectedState);
  });

  test('Тестирование при ошибке запроса', () => {
    const action = createAction(newOrderThunk.rejected.type);
    const expectedState = { ...initialState, orderRequest: false };
    testStateChange(action, expectedState);
  });

  test('Тестирование при успешной обработке запроса', () => {
    const action = createAction(newOrderThunk.fulfilled.type, mockOrder);
    const expectedState = {
      ...initialState,
      orderRequest: false,
      order: mockOrder.order,
      name: mockOrder.name
    };
    testStateChange(action, expectedState);
  });
});
