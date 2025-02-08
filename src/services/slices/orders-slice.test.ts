import { initialState, ordersReducer, getOrdersThunk } from './orders-slice';
import { expect } from '@jest/globals';

describe('Тестирование слайса заказов', () => {
  const mockOrders = [
    {
      _id: '675c8927750864001d37116e',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa0942',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный spicy био-марсианский бургер',
      createdAt: '2024-12-13T19:21:11.198Z',
      updatedAt: '2024-12-13T19:21:12.139Z',
      number: 62729
    },
    {
      _id: '675c9296750864001d371198',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Space флюоресцентный био-марсианский метеоритный бургер',
      createdAt: '2024-12-13T20:01:26.739Z',
      updatedAt: '2024-12-13T20:01:27.727Z',
      number: 62743
    }
  ];

  const createAction = (type: string, payload?: any) => ({ type, payload });

  it('должен возвращать начальное состояние', () => {
    const newState = ordersReducer(undefined, createAction(''));
    expect(newState).toEqual(initialState);
  });

  it('Обработка экшна при начале загрузки', () => {
    const newState = ordersReducer(
      initialState,
      createAction(getOrdersThunk.pending.type)
    );
    expect(newState).toEqual(initialState);
  });

  it('Обработка экшна при успешной загрузке', () => {
    const newState = ordersReducer(
      initialState,
      createAction(getOrdersThunk.fulfilled.type, mockOrders)
    );
    expect(newState).toEqual({ ...initialState, orders: mockOrders });
  });

  it('Обработка экшна при загрузке с ошибкой', () => {
    const newState = ordersReducer(
      initialState,
      createAction(getOrdersThunk.rejected.type)
    );
    expect(newState).toEqual(initialState);
  });
});
