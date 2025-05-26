import React from 'react';
import { useContext } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from '../routes';
import Wikis from '../pages/Wikis';
import UserPage from '../pages/UserPage';
import { Context } from "../index";
import { LOGIN_ROUTE } from '../utils/consts';
import Login from '../pages/Login';

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
            <Route path={LOGIN_ROUTE} element={<Login />} />
            
            {authRoutes.map(({ path, Component }) => (
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
            
            <Route
                path="/user/:id"
                element={
                    <PrivateRoute>
                        <UserPage />
                    </PrivateRoute>
                }
            />
            
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
            
            <Route path="*" element={<Wikis />} />
    </Routes>
    );
};

export default AppRouter;