import {$authHost, $host} from "./index";

export const fetchUsers = async () => {
    const {data} = await $host.get('api/user')
    return data
}

export const createUser = async (userData) => {
    const {data} = await $authHost.post('api/user/registration', userData)
    return data
}

export const changeUser = async (id, pole, value) => {
    const {data} = await $authHost.patch('api/user/' + id, {pole: pole, value: value})
    return data
}

export const deleteUser = async (id) => {
    const {data} = await $host.delete('api/user/' + id)
    return data
}