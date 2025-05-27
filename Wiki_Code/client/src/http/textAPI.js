import { $host, $authHost } from "./index";

export const createGroup = async (group) => {
    const {data} = await $authHost.post('api/group', group)
    return data
}

export const fetchGroup = async () => {
    const {data} = await $host.get('api/group')
    return data
}

export const createText = async (title, text, userId, groupId) => {
    const {data} = await $authHost.post('api/text', {title: title, text: text, userId:userId, groupId: groupId})
    return data
}

export const fetchText = async (groupId, userId, page, limit = 3, id = null) => {
    const {data} = await $host.get('api/text', {params:{
        groupId, page, limit, userId, id
    }})
    return data
}

export const changeText = async (id, title, text, groupId) => {
    try {
        const {data} = await $authHost.patch(`api/text/${id}`, {
            title: title,
            text: text,
            groupId: groupId
        });
        return data;
    } catch (error) {
        console.error('Error in changeText:', error);
        throw error;
    }
}

export const delText = async(id) => {
    const {data} = await $authHost.delete('api/text/' + id)
    return data
}
