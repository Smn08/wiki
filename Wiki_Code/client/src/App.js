import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar'
import { Context } from './index';
import { check } from './http/userAPI';
import { Spinner } from 'react-bootstrap';
import { fetchUsers } from './http/usersAPI';
import { fetchInitialData } from './http/initAPI';

const App = () => {
  const { user, users, text } = useContext(Context);
  const [loading, setLoading] = useState(true);

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

        // Проверяем авторизацию
        const userData = await check();
        if (userData) {
          user.setUser(userData);
          user.setIsAuth(true);
          user.setId(userData.id);
          user.setIsAdmin(userData.role === 'ADMIN');

          try {
            // Загружаем остальные данные
            const [usersData, initialData] = await Promise.all([
              fetchUsers(),
              fetchInitialData()
            ]);

            if (usersData && Array.isArray(usersData)) {
              users.setUsers(usersData);
              if (usersData.length > 0) {
                const currentUser = usersData.find(u => u.id === userData.id);
                if (currentUser) {
                  user.setImg(currentUser.foto);
                }
              }
            }

            if (initialData && initialData.groups && Array.isArray(initialData.groups)) {
              if (initialData.groups.length > 0) {
                text.setGroup(initialData.groups);
              } else {
                console.warn('Нет доступных групп');
              }
            }
          } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        user.setIsAuth(false);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
