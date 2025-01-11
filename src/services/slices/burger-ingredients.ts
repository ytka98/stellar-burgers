
import { TIngredient
 } from "@utils-types";
type TIngredientsState = {
  ingredients: TIngredient[];
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  loading: boolean;
  error: string | null;
};

export const getIngredients = (state: { ingredients: TIngredientsState }) =>
  state.ingredients;
