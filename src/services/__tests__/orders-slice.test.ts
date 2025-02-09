import {
  initialState,
  ordersReducer,
  getOrdersThunk
} from '../slices/orders-slice';
import { expect } from '@jest/globals';

describe('Тестирование слайса заказов', () => {
  const mockOrders = [
    {
      _id: '675d1234750864001d371200',
      ingredients: [
        '643d69a5c3f7b9001cfa1001',
        '643d69a5c3f7b9001cfa1002',
        '643d69a5c3f7b9001cfa1003',
        '643d69a5c3f7b9001cfa1001'
      ],
      status: 'done',
      name: 'Краторный spicy био-марсианский бургер',
      createdAt: '2025-02-09T15:30:45.123Z',
      updatedAt: '2025-02-09T15:31:12.987Z',
      number: 62729
    },
    {
      _id: '675d5678750864001d371250',
      ingredients: [
        '643d69a5c3f7b9001cfa2001',
        '643d69a5c3f7b9001cfa2002',
        '643d69a5c3f7b9001cfa2003',
        '643d69a5c3f7b9001cfa2004',
        '643d69a5c3f7b9001cfa2001'
      ],
      status: 'done',
      name: 'Space флюоресцентный био-марсианский метеоритный бургер',
      createdAt: '2025-02-09T16:45:30.456Z',
      updatedAt: '2025-02-09T16:46:10.789Z',
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
