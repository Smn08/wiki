import { $authHost, $host } from "./index";
import {jwtDecode as jwt_decode} from 'jwt-decode';

export const registration = async (email,password) => {
    const {data} = await $host.post('api/user/registration', {email,password,role: 'USER'})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const login = async (email,password) => {
    const {data} = await $host.post('api/user/login', {email,password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth' )
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const setImg = async (id,img) => {
    const {data} = await $authHost.patch('api/user/img/' + id, img)
    return data
}

export const  changePassword = async(id, password) =>{
    const {data} = await $authHost.patch('api/user/password/' + id, {password: password})
    return data
}