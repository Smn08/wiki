import React, { useContext, useEffect, useState, useRef } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar'
import { Context } from './index';
import { check, getAllUsers } from './http/userAPI';
import { Spinner } from 'react-bootstrap';
import { fetchInitialData } from './http/initAPI';
import { LOGIN_ROUTE, WIKIS_ROUTER } from './utils/consts';
import Login from './pages/Login';
import { observer } from 'mobx-react-lite';

const App = observer(() => {
  const { user, users, text } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const isLoadAppDataCalled = useRef(false);

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
  
  const loadAppData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        user.setIsInitialized(true);
        setLoading(false);
        return;
      }

      const userData = await check();
      
      if (!userData) {
        throw new Error('Invalid user data');
      }

      // Set user data first
      user.setUser(userData);
      user.setIsAuth(true);
      user.setId(userData.id);
      user.setIsAdmin(userData.role === 'ADMIN');

      // Then load additional data
      try {
        await Promise.all([
          loadUserData(),
          fetchInitialData()
        ]);
      } catch (error) {
        console.error('Error loading additional data:', error);
        // Don't throw here, as we still have basic user data
      }

    } catch (error) {
      console.error('Ошибка при инициализации приложения:', error);
      user.setUser({});
      user.setIsAuth(false);
      user.setIsAdmin(false);
      user.setId(null);
      localStorage.removeItem('token');
    } finally {
      user.setIsInitialized(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.isInitialized || isLoadAppDataCalled.current) {
      setLoading(false);
      return;
    }

    isLoadAppDataCalled.current = true;
    setLoading(true);
    loadAppData();
  }, [user.isInitialized]);

  if (!user.isInitialized) {
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
      <Routes>
        {user.isAuth && <Route path={LOGIN_ROUTE} element={<Navigate to={WIKIS_ROUTER} replace />} />}
        {!user.isAuth && <Route path="*" element={<Navigate to={LOGIN_ROUTE} replace />} />}
        
        {user.isAuth && <Route path="*" element={<AppRouter />} />}

        {!user.isAuth && <Route path={LOGIN_ROUTE} element={<Login />} />}

      </Routes>
    </BrowserRouter>
  );
});

export default App;
