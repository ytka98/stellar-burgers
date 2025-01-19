// Хуки React
import { useEffect } from 'react';

// Диспатч из хранилища
import { useDispatch } from '../../services/store';

// Асинхронные действия
import { getIngredientsThunk } from '../../services/slices/ingredients-slice'; // Загрузка ингредиентов
import { verifyUserAuthAsyncThunk } from '../../services/slices/user-slice'; // Проверка авторизации пользователя

// Хук для проверки соответствия маршрута
import { useMatch } from 'react-router-dom';

// Импорт маршрутов и хуков из react-router-dom
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Защищённый маршрут
import { ProtectedRoute } from '../../components/protected-route';

// Шапка приложения
import { AppHeader } from '@components';

// Импорт страниц приложения
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

// Стили для приложения
import styles from './app.module.css';

// Импорт компонентов
import { IngredientDetails, Modal, OrderInfo } from '@components';

const App = () => {
  const navigateTo = useNavigate();
  const currentLocation = useLocation();
  const modalBackground = currentLocation.state?.background;
  const appDispatch = useDispatch();

  const orderFromFeedMatch = useMatch('/feed/:number');
  const orderFromProfileMatch = useMatch('/profile/orders/:number');

  useEffect(() => {
    appDispatch(getIngredientsThunk());
    appDispatch(verifyUserAuthAsyncThunk());
  }, [appDispatch]);

  const handleCloseModal = () => navigateTo(-1);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={modalBackground || currentLocation}>
        {/* МАРШРУТЫ ДОСТУПНЫЕ ДЛЯ ВСЕХ */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute GuestRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute GuestRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute GuestRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute GuestRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Маршруты, доступные только для авторизованных пользователей */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* ЕСЛИ МАРШРУТ НЕ НАЙДЕН */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* МОДАЛЬНЫЕ ОКНА */}
      {modalBackground && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`Заказ #${orderFromFeedMatch?.params.number || ''}`}
                onClose={handleCloseModal}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={`Заказ #${orderFromProfileMatch?.params.number || ''}`}
                  onClose={handleCloseModal}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
