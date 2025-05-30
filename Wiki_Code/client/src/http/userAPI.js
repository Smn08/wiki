import { $authHost, $host } from "./index";
import {jwtDecode as jwt_decode} from 'jwt-decode';

export const registration = async (email, password, fn, sn) => {
    const {data} = await $host.post('api/user/registration', {
        email, 
        password, 
        fn: fn,
        sn: sn,
        role: 'USER'
    })
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const {data} = await $authHost.get('api/user/auth');
        if (!data || !data.token) {
            throw new Error('Invalid response from server');
        }
        
        const decodedToken = jwt_decode(data.token);
        if (!decodedToken || !decodedToken.id) {
            throw new Error('Invalid token data');
        }

        // Получаем полные данные пользователя
        const userResponse = await $authHost.get(`api/user/${decodedToken.id}`);
        if (!userResponse.data) {
            throw new Error('Failed to fetch user data');
        }

        // Объединяем данные из токена и полные данные пользователя
        const userData = {
            ...decodedToken,
            ...userResponse.data,
            role: decodedToken.role // Убеждаемся, что роль берется из токена
        };

        localStorage.setItem('token', data.token);
        return userData;
    } catch (error) {
        localStorage.removeItem('token');
        throw error;
    }
}

export const setImg = async (id,img) => {
    const {data} = await $authHost.patch('api/user/img/' + id, img)
    return data
}

export const changePassword = async(id, password) =>{
    const {data} = await $authHost.patch('api/user/password/' + id, {password: password})
    return data
}

export const createUser = async (userData) => {
    const { data } = await $authHost.post('api/users', userData);
    return data;
};

export const updateUser = async (formData) => {
    const {data} = await $authHost.patch('api/user', formData)
    return data
}

export const deleteUser = async (id) => {
    const { data } = await $authHost.delete(`api/users/${id}`);
    return data;
};

export const getAllUsers = async () => {
    const { data } = await $authHost.get('api/users');
    return data;
};

export const fetchUsers = async () => {
    const {data} = await $authHost.get('api/user')
    return data
}

export const fetchOneUser = async (id) => {
    const {data} = await $authHost.get(`api/user/${id}`)
    return data
}