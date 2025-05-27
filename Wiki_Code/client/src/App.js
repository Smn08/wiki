import React, { useContext, useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { LOGIN_ROUTE, WIKIS_ROUTER, REGISTRATION_ROUTER } from './utils/consts';
import { check } from './http/userAPI';
import { Spinner } from 'react-bootstrap';
import NavBar from './components/NavBar';
import AppRouter from './components/AppRouter';
import Login from './pages/Login';
import Registration from './pages/Registration';

const App = observer(() => {
  const { user, users, text } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const isLoadAppDataCalled = useRef(false);

  const loadUserData = async () => {
    try {
      const usersData = await users.fetchUsers();
      if (usersData) {
        users.setUsers(usersData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [groupsData, textsData] = await Promise.all([
        text.fetchGroups(),
        text.fetchTexts()
      ]);

      if (groupsData) {
        text.setGroups(groupsData);
      }

      if (textsData) {
        text.setText(textsData.rows);
        text.setTotalCount(textsData.count);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
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
        {user.isAuth && <Route path={REGISTRATION_ROUTER} element={<Navigate to={WIKIS_ROUTER} replace />} />}
        
        {!user.isAuth && (
          <>
            <Route path={LOGIN_ROUTE} element={<Login />} />
            <Route path={REGISTRATION_ROUTER} element={<Registration />} />
            <Route path="*" element={<Navigate to={LOGIN_ROUTE} replace />} />
          </>
        )}
        
        {user.isAuth && <Route path="*" element={<AppRouter />} />}
      </Routes>
    </BrowserRouter>
  );
});

export default App;
