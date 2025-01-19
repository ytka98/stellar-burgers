import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

export const newOrderThunk = createAsyncThunk('order/new', orderBurgerApi);

type TNewOrderState = {
  order: TOrder | null;
  name: string;
  orderRequest: boolean;
};

const initialState: TNewOrderState = {
  order: null,
  name: '',
  orderRequest: false
};

const newOrder = createSlice({
  name: 'newOrder',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.name = '';
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(newOrderThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(newOrderThunk.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(newOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload.order;
        state.name = action.payload.name;
      });
  }
});

export const newOrderReducer = newOrder.reducer;
export const { clearOrder } = newOrder.actions;

export const getNewOrderState = (state: { newOrder: TNewOrderState }) =>
  state.newOrder;
