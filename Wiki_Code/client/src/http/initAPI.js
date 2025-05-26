import { $authHost } from './index';

export const fetchGroups = async () => {
    try {
        const { data } = await $authHost.get('group');
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке групп:', error);
        return [];
    }
};

export const fetchInitialData = async () => {
    try {
        const groupsData = await fetchGroups();
        return {
            groups: groupsData || []
        };
    } catch (error) {
        console.error('Ошибка при загрузке начальных данных:', error);
        return {
            groups: []
        };
    }
}; 