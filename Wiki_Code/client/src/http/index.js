import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/';

const $host = axios.create({
    baseURL: API_URL
});

const $authHost = axios.create({
    baseURL: API_URL
});

const authInterceptor = config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

// Добавляем обработчик ответов
$authHost.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Очищаем токен и данные пользователя
            localStorage.removeItem('token');
            
            // Проверяем, не находимся ли мы уже на странице логина
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export {
    $host,
    $authHost
};