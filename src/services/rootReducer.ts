import { combineReducers } from '@reduxjs/toolkit';
import { 
  ingredientsReducer, 
} from './slices/burger-ingredients';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,   // Состояние ингредиентов
});

export { rootReducer }; // Экспорт объединённого; корневого редьюсера

/*
rootReducer:

Объединяет все редьюсеры в единый редьюсер.
Создает глобальное состояние приложения.
Делает приложение масштабируемым и модульным.
Облегчает добавление новой логики.
Интегрируется с инструментами и middleware для упрощения разработки. 

*/
