const bcrypt = require('bcrypt');
const { User, Group } = require('./models/models');

const initDb = async () => {
    try {
        // Проверяем, существует ли уже администратор
        const adminExists = await User.findOne({
            where: { email: 'admin@admin.com' }
        });

        if (!adminExists) {
            // Создаем хеш пароля
            const hashPassword = await bcrypt.hash('admin', 5);
            
            // Создаем администратора
            await User.create({
                email: 'admin@admin.com',
                password: hashPassword,
                role: 'ADMIN',
                fullName: 'Administrator'
            });
            
            console.log('Администратор успешно создан');
        }

        // Проверяем наличие групп
        const groupsExist = await Group.findOne();
        if (!groupsExist) {
            // Создаем группы по умолчанию
            const defaultGroups = [
                { name: 'Общие статьи' },
                { name: 'Техническая документация' },
                { name: 'Руководства' }
            ];

            await Group.bulkCreate(defaultGroups);
            console.log('Группы по умолчанию успешно созданы');
        }
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
    }
};

module.exports = initDb; 