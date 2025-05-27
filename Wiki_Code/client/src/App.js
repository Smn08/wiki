import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar'
import { Context } from './index';
import { check, getAllUsers } from './http/userAPI';
import { Spinner } from 'react-bootstrap';
import { fetchInitialData } from './http/initAPI';
import { LOGIN_ROUTE, WIKIS_ROUTER } from './utils/consts';
import Login from './pages/Login';

const App = () => {
  const { user, users, text } = useContext(Context);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const usersData = await getAllUsers();
      if (usersData && Array.isArray(usersData)) {
        users.setUsers(usersData);
        const currentUser = usersData.find(u => u.id === user.id);
        if (currentUser) {
          user.setImg(currentUser.foto);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователей:', error);
    }
  };
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Проверяем наличие токена
        const token = localStorage.getItem('token');
        if (!token) {
          user.setIsAuth(false);
          setLoading(false);
          return;
        }

        // Проверяем авторизацию и получаем данные пользователя
        const userData = await check();
        if (!userData) {
          throw new Error('Не удалось получить данные пользователя');
        }

        // Устанавливаем данные пользователя
        user.setUser(userData);
        user.setIsAuth(true);
        user.setId(userData.id);
        user.setIsAdmin(userData.role === 'ADMIN');

        // Загружаем данные пользователей сразу после авторизации
        await loadUserData();

        // Загружаем группы
        const initialData = await fetchInitialData();
        if (initialData && initialData.groups && Array.isArray(initialData.groups)) {
          if (initialData.groups.length > 0) {
            text.setGroups(initialData.groups);
          } else {
            console.warn('Нет доступных групп');
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        user.setIsAuth(false);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Добавляем эффект для обновления данных пользователей при изменении состояния авторизации
  useEffect(() => {
    if (user.isAuth) {
      loadUserData();
    }
  }, [user.isAuth]);

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: window.innerHeight }}
      >
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path={LOGIN_ROUTE} element={<Login />} />
        <Route path="*" element={
          <>
            {user.isAuth && <NavBar />}
      <AppRouter />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
