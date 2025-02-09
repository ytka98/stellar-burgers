import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import {
  initialState,
  feedsReducer,
  getFeedsThunk
} from '../slices/feed-slice';

describe('Проверка слайса feeds', () => {
  const mockFeedsOrders = {
    orders: [
      {
        _id: '675c8927750864001d37116e',
        ingredients: [
          '743d69a5c3f7b9001cfa095a',
          '743d69a5c3f7b9001cfa095a',
          '743d69a5c3f7b9001cfa096b',
          '743d69a5c3f7b9001cfa095a'
        ],
        owner: '675bdfb6750864001d370f49',
        status: 'done',
        name: 'Краторный spicy био-марсианский бургер',
        createdAt: '2025-02-08T12:34:56.198Z',
        updatedAt: '2025-02-08T12:34:57.139Z',
        number: 62729,
        __v: 0
      },
      {
        _id: '675c9296750864001d371198',
        ingredients: [
          '743d69a5c3f7b9001cfa095b',
          '743d69a5c3f7b9001cfa096c',
          '743d69a5c3f7b9001cfa096d',
          '743d69a5c3f7b9001cfa096e',
          '743d69a5c3f7b9001cfa095b'
        ],
        owner: '675bdfb6750864001d370f49',
        status: 'done',
        name: 'Space флюоресцентный био-марсианский метеоритный бургер',
        createdAt: '2025-02-08T13:45:12.739Z',
        updatedAt: '2025-02-08T13:45:13.727Z',
        number: 62743,
        __v: 0
      }
    ],
    total: 62369,
    totalToday: 86
  };

  const createAction = (type: string, payload: any = undefined) => ({
    type,
    payload
  });

  const testStateChange = (action: any, expectedState: any) => {
    const newState = feedsReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  };

  test('Успешная загрузка данных и обновление состояния', () => {
    const action = createAction(getFeedsThunk.fulfilled.type, mockFeedsOrders);
    const expectedResult = {
      ...initialState,
      orders: mockFeedsOrders.orders,
      total: mockFeedsOrders.total,
      totalToday: mockFeedsOrders.totalToday
    };
    testStateChange(action, expectedResult);
  });

  test('Запрос данных в процессе загрузки', () => {
    const action = createAction(getFeedsThunk.pending.type);
    const expectedResult = {
      ...initialState
    };
    testStateChange(action, expectedResult);
  });

  test('Ошибка при загрузке данных', () => {
    const action = createAction(getFeedsThunk.rejected.type);
    const expectedResult = {
      ...initialState
    };
    testStateChange(action, expectedResult);
  });

  test('Проверка начального состояния', () => {
    const action = createAction('');
    const expectedResult = {
      ...initialState
    };
    testStateChange(action, expectedResult);
  });
});
