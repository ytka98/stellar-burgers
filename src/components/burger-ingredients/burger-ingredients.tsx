import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients-slice';

export const BurgerIngredients: FC = () => {
  // Получаем ингредиенты из Redux-хранилища
  const { buns, mains, sauces } = useSelector(getIngredients);
  // Состояние текущей активной вкладки
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  // Рефы для заголовков секций
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });
  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });
  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // Обновление текущей вкладки при изменении видимости секций
  useEffect(() => {
    switch (true) {
      case inViewBuns:
        setCurrentTab('bun');
        break;
      case inViewSauces:
        setCurrentTab('sauce');
        break;
      case inViewFilling:
        setCurrentTab('main');
        break;
      default:
        break;
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);

    // Прокрутка к соответствующей секции при клике
    switch (tab) {
      case 'bun':
        titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'main':
        titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'sauce':
        titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
