import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

// Асинхронный экшен для получения заказов
export const getOrdersThunk = createAsyncThunk<TOrder[], void>(
  'orders/userOrders',
  getOrdersApi
);

type TOrdersState = {
  orders: TOrder[];
};

export const initialState: TOrdersState = {
  orders: []
};

// Слайс для заказов
const orders = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    // Селектор для получения заказов
    getOrders: (state: TOrdersState) => state.orders
  },
  extraReducers: (builder) => {
    builder
      // Обработка статусов асинхронного экшена
      .addCase(getOrdersThunk.pending, (state) => {
        // Логика при ожидании запроса (можно добавить индикатор загрузки)
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        // Логика при ошибке (например, добавление ошибки в стейт)
      })
      .addCase(getOrdersThunk.fulfilled, (state, action: PayloadAction<TOrder[]>) => {
        state.orders = action.payload; // Обновление состояния при успешном выполнении
      });
  }
});

// Экспорт редьюсера и селектора
export const ordersReducer = orders.reducer;
export const { getOrders } = orders.selectors;
