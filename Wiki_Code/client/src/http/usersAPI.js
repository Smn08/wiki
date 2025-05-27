import { $authHost, $host } from './index';

export const fetchUsers = async () => {
    const {data} = await $authHost.get('api/users')
    return data
}

export const fetchAuthUser = async () => {
    const {data} = await $authHost.get('api/user/auth')
    return data
}

export const createUser = async (userData) => {
    const {data} = await $authHost.post('api/user/registration', {
        email: userData.email,
        password: userData.password,
        fn: userData.fn,
        sn: userData.sn,
        role: userData.role
    })
    return data
}

export const changeUser = async (id, pole, value) => {
    const {data} = await $authHost.patch('api/users/' + id, {
        pole: pole === 'fn' ? 'firstName' : pole === 'sn' ? 'lastName' : pole,
        value: value
    })
    return data
}

export const deleteUser = async (id) => {
    const {data} = await $authHost.delete('api/users/' + id)
    return data
}