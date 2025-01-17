import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

// Вспомогательная функция для перемещения элементов в массиве
const moveItemInArray = (
  arr: TConstructorIngredient[],
  index1: number,
  index2: number
): void => {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
};

const burgerConstructor = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addItemToConstructor: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        switch (action.payload.type) {
          case 'bun':
            state.bun = action.payload;
            break;
          default:
            state.ingredients.push(action.payload);
            break;
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },

    // Удаление ингредиента по ID
    removeItemFromConstructor: (state, action: PayloadAction<string>) => {
      const { payload: id } = action;
      state.ingredients = state.ingredients.filter((item) => item.id !== id);
    },

    // Перемещение ингредиента в конструкторе
    moveItemInConstructor: (
      state,
      {
        payload: { index, move }
      }: PayloadAction<{ index: number; move: 'up' | 'down' }>
    ) => {
      switch (move) {
        case 'up': {
          const targetIndex = index - 1;
          if (targetIndex >= 0 && targetIndex < state.ingredients.length) {
            moveItemInArray(state.ingredients, index, targetIndex);
          }
          break;
        }
        case 'down': {
          const targetIndex = index + 1;
          if (targetIndex >= 0 && targetIndex < state.ingredients.length) {
            moveItemInArray(state.ingredients, index, targetIndex);
          }
          break;
        }
      }
    },

    // Очистка конструктора
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const constructorReducer = burgerConstructor.reducer;
export const {
  addItemToConstructor,
  removeItemFromConstructor,
  moveItemInConstructor,
  resetConstructor
} = burgerConstructor.actions;

// Селектор для получения состояния конструктора
export const getConstructorState = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor;
