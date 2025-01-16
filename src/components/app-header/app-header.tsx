import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserData } from '../../services/slices/user-slice';

export const AppHeader: FC = () => (
  <AppHeaderUI userName={useSelector(getUserData)?.user?.name || ''} />
  // Получаем имя пользователя из состояния и передаем в компонент AppHeaderUI, если имя не найдено, передаем пустую строку
);
