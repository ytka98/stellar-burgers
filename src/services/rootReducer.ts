import { combineReducers } from '@reduxjs/toolkit';
import * as slices from '@slices';

const rootReducer = combineReducers({
  user: slices.userReducer,
  ingredients: slices.ingredientsReducer,
  orders: slices.ordersReducer,
  newOrder: slices.newOrderReducer,
  burgerConstructor: slices.constructorReducer,
  feeds: slices.feedsReducer
});

export { rootReducer };
