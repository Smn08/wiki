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
            const hashPassword = await bcrypt.hash('xxXX1234', 5);
            
            // Создаем администратора
            await User.create({
                email: 'admin@admin.com',
                password: hashPassword,
                role: 'ADMIN',
                fn: 'Administrator',
                sn: 'Хуйницкий',
                img: 'https://i.pinimg.com/originals/0d/35/88/0d3588465d463a5160a4384e8ea4c4cd.png',
                text: 'Я администратор'
            });
            
            console.log('Администратор Хуйницкий успешно создан');
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