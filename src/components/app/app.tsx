import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
    <Router>
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
