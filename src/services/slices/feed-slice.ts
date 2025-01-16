import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

export const getFeedsThunk = createAsyncThunk('orders/getAll', getFeedsApi);

type TFeeds = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: TFeeds = {
  orders: [],
  total: 0,
  totalToday: 0
};

const feedsSlice = createSlice({
  name: 'feeds',
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
export const getFeedsState = (state: { feeds: TFeeds }) => state.feeds;
