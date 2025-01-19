import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import {
  registerUserApi,
  loginUserApi,
  updateUserApi,
  logoutApi,
  getUserApi
} from '@api';
import { TUser } from '@utils-types';

// Тип для экшенов с ошибками
interface ErrorAction {
  type: string;
  error?: {
    message?: string;
  };
}

// Тип состояния пользователя
type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | null;
};

// Начальное состояние
const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  error: null
};

// Вспомогательные функции
const logoutCleanUp = () => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};

const handleAuthError = (state: any, action: ErrorAction) => {
  state.error = action.error?.message ?? null;
};

const handleAuthSuccess = (
  state: any,
  action: PayloadAction<{ user: TUser }>,
  setAuthChecked = true
) => {
  state.isAuthChecked = setAuthChecked;
  state.user = action.payload?.user ?? null;
  state.error = null;
};

// Слайс пользователя
const User = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(registerUserAsyncThunk.pending, () => {})
      .addCase(registerUserAsyncThunk.rejected, handleAuthError)
      .addCase(registerUserAsyncThunk.fulfilled, (state, action) =>
        handleAuthSuccess(state, action)
      )
      // Логин
      .addCase(loginUserAsyncThunk.rejected, handleAuthError)
      .addCase(loginUserAsyncThunk.fulfilled, (state, action) => {
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        handleAuthSuccess(state, action);
      })
      // Получение данных пользователя
      .addCase(fetchUserAsyncThunk.rejected, handleAuthError)
      .addCase(fetchUserAsyncThunk.fulfilled, (state, action) =>
        handleAuthSuccess(state, action)
      )
      // Обновление данных пользователя
      .addCase(updateUserAsyncThunk.rejected, handleAuthError)
      .addCase(updateUserAsyncThunk.fulfilled, (state, action) =>
        handleAuthSuccess(state, action)
      );
  }
});

// Асинхронные экшены
export const registerUserAsyncThunk = createAsyncThunk(
  'user/register',
  registerUserApi
);

export const loginUserAsyncThunk = createAsyncThunk('user/login', loginUserApi);

export const updateUserAsyncThunk = createAsyncThunk(
  'user/update',
  updateUserApi
);

export const fetchUserAsyncThunk = createAsyncThunk('user/request', getUserApi);

export const verifyUserAuthAsyncThunk = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const res = await getUserApi();
        dispatch(setUser(res.user));
      } catch {
        logoutCleanUp();
      } finally {
        dispatch(authCheck());
      }
    } else {
      dispatch(authCheck());
    }
  }
);

export const logoutUserAsyncThunk = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    await logoutApi();
    logoutCleanUp();
    dispatch(userLogout());
  }
);

// Экспорт редюсера и экшенов
export const userReducer = User.reducer;
export const { setUser, authCheck, userLogout } = User.actions;

// Селекторы
export const getUserData = (state: { user: TUserState }) => state.user;
export const getUserError = (state: { user: TUserState }) => state.user.error;
export const getUserIsAuth = (state: { user: TUserState }) =>
  state.user.isAuthChecked;
export const getUser = (state: { user: TUserState }) => state.user.user;
