import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

export const getFeedsThunk = createAsyncThunk('orders/getAll', getFeedsApi);

type TFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: TFeed = {
  orders: [],
  total: 0,
  totalToday: 0
};

const feedsSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeedsThunk.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
  }
});

export const feedsReducer = feedsSlice.reducer;
export const getFeedsState = (state: { feeds: TFeed }) => state.feeds;
