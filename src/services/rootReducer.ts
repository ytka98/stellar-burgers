import { combineReducers } from '@reduxjs/toolkit';
import * as slices from '@slices';

const rootReducer = combineReducers({
  user: slices.userReducer,
  feeds: slices.feedsReducer,
  burgerConstructor: slices.constructorReducer,
  newOrder: slices.newOrderReducer,
  orders: slices.ordersReducer,
  ingredients: slices.ingredientsReducer
});

export { rootReducer };
