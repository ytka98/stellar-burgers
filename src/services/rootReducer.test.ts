import { rootReducer } from './rootReducer';
import { describe, expect, test } from '@jest/globals';
import store from './store';

describe('Тест rootReducer', () => {
  test('Состояние store после инициализации соответствует начальному состоянию rootReducer', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(store.getState()).toEqual(initialState);
  });
});
