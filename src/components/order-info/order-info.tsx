import { FC, useMemo, useEffect, useState } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients-slice';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  // Функция для получения номера заказа из параметров URL
  const id = useParams().number;

  const [orderData, setOrderData] = useState<TOrder>();

  // Функция для получения ингредиентов из хранилища
  const ingredients = useSelector(getIngredients).ingredients;

  // Хук для получения данных о заказе при монтировании компонента
  useEffect(() => {
    getOrderByNumberApi(Number(id)).then((data) => {
      setOrderData(data.orders[0]);
    });
  }, []); // Пустой массив зависимостей для вызова только один раз при монтировании

  // Функция для вычисления информации о заказе, включая ингредиенты и общую стоимость
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: { [key: string]: TIngredient & { count: number } }, item) => {
        switch (acc[item] === undefined) {
          case true:
            const ingredient = ingredients.find((ing) => ing._id === item);
            if (ingredient) {
              acc[item] = {
                ...ingredient,
                count: 1
              };
            }
            break;

          default:
            acc[item].count++;
            break;
        }

        return acc;
      },
      {}
    );

    // Функция для вычисления общей стоимости
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    // Возвращаем информацию о заказе, включая ингредиенты и общую стоимость
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
