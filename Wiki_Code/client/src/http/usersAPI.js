import {$authHost, $host} from "./index";

export const fetchUsers = async () => {
    const {data} = await $host.get('api/users')
    return data
}

export const changeUser = async (id,pole,value) =>{
    const {data} = await $authHost.patch('api/users/' + id, {pole: pole, value: value})
    return data
}

export const deleteUser = async (id) => {
    const {data} = await $host.delete('/api/users/' + id)
    return data
}