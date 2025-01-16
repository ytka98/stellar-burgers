
import { TIngredient
 } from "@utils-types";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getIngredientsApi } from "../../utils/burger-api";


 export const getIngredientsThunk = createAsyncThunk<TIngredient[]>(
  'ingredients/getAll',
  getIngredientsApi
);

type TIngredientsState = {
  ingredients: TIngredient[];
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  buns: [],
  mains: [],
  sauces: [],
  loading: true,
  error: null
};

const burgerIngredients = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load ingredients';
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        const ingredients = action.payload;

        state.loading = false;
        state.ingredients = ingredients;

        // Очищение и распределение ингредиентов
        const buns: TIngredient[] = [];
        const mains: TIngredient[] = [];
        const sauces: TIngredient[] = [];

        ingredients.forEach((ingredient) => {
          if (ingredient.type === 'bun') buns.push(ingredient);
          else if (ingredient.type === 'main') mains.push(ingredient);
          else if (ingredient.type === 'sauce') sauces.push(ingredient);
        });

        state.buns = buns;
        state.mains = mains;
        state.sauces = sauces;
      });
  }
});

export const ingredientsReducer = burgerIngredients.reducer;

export const getIngredients = (state: { ingredients: TIngredientsState }) =>
  state.ingredients;

export const getIngredientsLoading = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.loading;
