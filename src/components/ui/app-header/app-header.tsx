import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const menuItems = [
    {
      to: '/',
      icon: <BurgerIcon type='primary' />,
      text: 'Конструктор',
      extraClass: 'mr-10'
    },
    {
      to: '/feed',
      icon: <ListIcon type='primary' />,
      text: 'Лента заказов'
    }
  ];

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {menuItems.map(({ to, icon, text, extraClass }, index) => (
            <NavLink
              key={index}
              to={to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.link_active : ''}`
              }
            >
              {icon}
              <p
                className={`text text_type_main-default ml-2 ${extraClass || ''}`}
              >
                {text}
              </p>
            </NavLink>
          ))}
        </div>
        <NavLink to='/'>
          <div className={styles.logo}>
            <Logo className='' />
          </div>
        </NavLink>
        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ProfileIcon type='primary' />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
