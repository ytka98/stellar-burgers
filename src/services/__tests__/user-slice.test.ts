import { test, expect } from '@jest/globals';
import { AsyncThunk } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import {
  initialState,
  userReducer,
  loginUserAsyncThunk,
  updateUserAsyncThunk,
  fetchUserAsyncThunk,
  logoutUserAsyncThunk,
  registerUserAsyncThunk,
  setUser,
  authCheck,
  userLogout,
  getUserData,
  getUserError,
  getUserIsAuth,
  getUser
} from '../slices/user-slice';

describe('Тестирование userSlice', () => {
  const mockUserData = {
    email: 'TestUser456@example.com',
    name: 'Alex Johnson'
  };

  const createMockAction = (
    type: string,
    payload: any = undefined,
    error: any = null
  ) => ({
    type,
    payload,
    error
  });

  const testStateTransition = (
    action: any,
    initialState: any,
    expectedState: any
  ) => {
    const newState = userReducer(initialState, action);
    expect(newState).toEqual(expectedState);
  };

  // Тесты на синхронные действия
  test('Должен корректно обновлять состояние при установке пользователя', () => {
    const action = setUser(mockUserData);
    const expectedState = { ...initialState, user: mockUserData };
    testStateTransition(action, initialState, expectedState);
  });

  test('Должен корректно обновлять состояние при проверке авторизации', () => {
    const action = authCheck();
    const expectedState = { ...initialState, isAuthChecked: true };
    testStateTransition(action, initialState, expectedState);
  });

  test('Должен корректно обновлять состояние при выходе пользователя', () => {
    const action = userLogout();
    const stateWithUser = { ...initialState, user: mockUserData };
    const expectedState = { ...initialState, user: null };
    testStateTransition(action, stateWithUser, expectedState);
  });

  // Тесты на асинхронные действия (pending, rejected, fulfilled)
  test.each<[string, AsyncThunk<any, any, any>]>([
    ['Регистрация пользователя', registerUserAsyncThunk],
    ['Вход пользователя', loginUserAsyncThunk],
    ['Получение данных пользователя', fetchUserAsyncThunk],
    ['Обновление данных пользователя', updateUserAsyncThunk]
  ])(
    'Должен корректно обрабатывать состояние pending для %s',
    (description, asyncThunk) => {
      console.log(description);
      const action = createMockAction(asyncThunk.pending.type);
      const expectedState = { ...initialState };
      testStateTransition(action, initialState, expectedState);
    }
  );
  
  test.each<[string, AsyncThunk<any, any, any>]>([
    ['Регистрация пользователя', registerUserAsyncThunk],
    ['Вход пользователя', loginUserAsyncThunk],
    ['Получение данных пользователя', fetchUserAsyncThunk],
    ['Обновление данных пользователя', updateUserAsyncThunk]
  ])(
    'Должен корректно обрабатывать состояние rejected для %s',
    (description, asyncThunk) => {
      console.log(description);
      const action = createMockAction(asyncThunk.rejected.type, undefined, {
        message: 'Ошибка'
      });
      const expectedState = { ...initialState, error: 'Ошибка' };
      testStateTransition(action, initialState, expectedState);
    }
  );

  test('Должен корректно обновлять состояние при успешной регистрации пользователя', () => {
    const action = createMockAction(registerUserAsyncThunk.fulfilled.type, {
      user: mockUserData
    });
    const expectedState = {
      ...initialState,
      isAuthChecked: true,
      user: mockUserData
    };
    testStateTransition(action, initialState, expectedState);
  });

  test('Должен корректно обновлять состояние при успешном получении данных пользователя', () => {
    const action = createMockAction(fetchUserAsyncThunk.fulfilled.type, {
      user: mockUserData
    });
    const expectedState = {
      ...initialState,
      isAuthChecked: true,
      user: mockUserData
    };
    testStateTransition(action, initialState, expectedState);
  });

  test('Должен корректно обновлять состояние при успешном обновлении данных пользователя', () => {
    const updatedUserData = { ...mockUserData, name: 'Обновленное имя' };
    const action = createMockAction(updateUserAsyncThunk.fulfilled.type, {
      user: updatedUserData
    });
    const stateWithUser = { ...initialState, user: mockUserData };
    const expectedState = {
      ...stateWithUser,
      user: updatedUserData,
      error: null,
      isAuthChecked: true
    };
    testStateTransition(action, stateWithUser, expectedState);
  });

  test('Должен корректно обновлять состояние при успешном выходе пользователя', () => {
    const action = createMockAction(logoutUserAsyncThunk.fulfilled.type);
    const expectedState = { ...initialState };
    testStateTransition(action, initialState, expectedState);
  });

  // Тесты на селекторы
  test('Должен корректно возвращать данные пользователя из состояния', () => {
    const stateWithUser = { user: { ...initialState, user: mockUserData } };
    expect(getUserData(stateWithUser)).toEqual({
      ...initialState,
      user: mockUserData
    });
    expect(getUserError(stateWithUser)).toEqual(null);
    expect(getUserIsAuth(stateWithUser)).toEqual(false);
    expect(getUser(stateWithUser)).toEqual(mockUserData);
  });
});
