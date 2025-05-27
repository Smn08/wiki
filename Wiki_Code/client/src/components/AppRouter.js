import React from 'react';
import { useContext } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from '../routes';
import Wikis from '../pages/Wikis';
import UserPage from '../pages/UserPage';
import WikiRedact from '../pages/WikiRedact';
import { Context } from "../index";
import { LOGIN_ROUTE, WIKIS_ROUTER, REGISTRATION_ROUTER, USER_ROUTER, REDACT_ROUTER } from '../utils/consts';
import Login from '../pages/Login';
import Registration from '../pages/Registration';

const PrivateRoute = ({ children }) => {
    const { user } = useContext(Context);
    return user.isAuth ? children : <Navigate to={LOGIN_ROUTE} />;
};

const AdminRoute = ({ children }) => {
    const { user } = useContext(Context);
    return user.isAuth && user.isAdmin ? children : <Navigate to={LOGIN_ROUTE} />;
};

const AppRouter = () => {
    const { user } = useContext(Context);
    
    return (
        <Routes>
            <Route 
                path={LOGIN_ROUTE} 
                element={user.isAuth ? <Navigate to={WIKIS_ROUTER} /> : <Login />} 
            />
            <Route 
                path={REGISTRATION_ROUTER} 
                element={user.isAuth ? <Navigate to={WIKIS_ROUTER} /> : <Registration />} 
            />
            
            {/* Маршруты только для администраторов */}
            {authRoutes.filter(route => route.path.startsWith('/admin')).map(({ path, Component }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        <AdminRoute>
                            <Component />
                        </AdminRoute>
                    }
                />
            ))}
            
            {/* Маршрут редактирования статей */}
            <Route
                path={REDACT_ROUTER + '/:id'}
                element={
                    <PrivateRoute>
                        <WikiRedact />
                    </PrivateRoute>
                }
            />
            
            {/* Маршрут профиля пользователя */}
            <Route
                path={USER_ROUTER + '/:id'}
                element={
                    <PrivateRoute>
                        <UserPage />
                    </PrivateRoute>
                }
            />
            
            {/* Публичные маршруты */}
            {publicRoutes.map(({ path, Component }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        <PrivateRoute>
                            <Component />
                        </PrivateRoute>
                    }
                />
            ))}
            
            <Route 
                path="*" 
                element={user.isAuth ? <Wikis /> : <Navigate to={LOGIN_ROUTE} />} 
            />
        </Routes>
    );
};

export default AppRouter;