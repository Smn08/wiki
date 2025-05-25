# Wiki Platform

Современная платформа для создания и управления статьями с системой авторизации и административной панелью.

## Функциональность

- 🔐 Аутентификация и авторизация пользователей
- 📝 Создание и редактирование статей
- 🏷️ Категоризация статей
- 👤 Управление профилем пользователя
- 👨‍💼 Административная панель
- ❤️ Система лайков
- 🔍 Поиск по статьям

## Технологии

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication

### Frontend
- React
- Material-UI
- Redux Toolkit
- React Router
- Formik & Yup

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/wiki-platform.git
cd wiki-platform
```

2. Создайте файл .env в корневой директории:
```env
DB_NAME=wiki_db
DB_USER=postgres
DB_PASSWORD=your_password
SECRET_KEY=your_secret_key
```

3. Запустите приложение с помощью Docker:
```bash
docker-compose up --build
```

Приложение будет доступно по адресам:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Структура проекта

```
wiki-platform/
├── client/                 # Frontend приложение
│   ├── public/            # Статические файлы
│   └── src/               # Исходный код React
├── server/                # Backend приложение
│   ├── controllers/       # Контроллеры
│   ├── models/           # Модели данных
│   ├── routes/           # Маршруты API
│   └── middleware/       # Middleware функции
└── docker-compose.yml    # Конфигурация Docker
```

## Лицензия
