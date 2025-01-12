import React from 'react';
import { Routes, Route } from 'react-router-dom';  // Убираем импорт Router
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { IngredientDetails } from '../ingredient-details';
import { useDispatch } from '../../services/store';
import { getIngredientsThunk } from '../../services/slices/burger-ingredients';
import { useEffect } from 'react';
const App = () => {
  const dispatch = useDispatch(); // Получаем функцию `dispatch` из Redux-хранилища для отправки экшенов
  useEffect(() => {
    dispatch(getIngredientsThunk());
    // При монтировании компонента загружаем данные об ингредиентах
  }, [dispatch]); 
  // Указываем зависимость от `dispatch`, чтобы эффект обновлялся корректно

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path="*" element={<NotFound404 />} />
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile">
          <Route index element={<Profile />} />
          <Route path="orders" element={<ProfileOrders />} />
        </Route>
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
      </Routes>
    </div>
  );
};

export default App;
