import {$authHost, $host} from "./index";

export const isMark = async (userId) => {
    const {data} = await $host.get('api/mark/' + userId)
    const mas = data.map(mark => mark.textId)
    return mas
}

export const pushMark = async(userId, textId) =>{
    const {data} = await $host.post('api/mark', {userId: userId, textId: textId})
    return data
}

export const delMark = async(userId, textId) =>{
    const {data} = await $host.delete('api/mark', {data: {userId: userId, textId: textId}})
    return data
}