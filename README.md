# Wiki Platform

Современная платформа для создания и управления вики-статьями с поддержкой групп, пользователей и административных функций. Все для диплома

## Быстрый старт с Docker

1. Убедитесь, что у вас установлен Docker и Docker Compose

2. Клонируйте репозиторий:
```bash
git clone https://github.com/Smn08/wiki-platform.git
cd wiki-platform
```

3. Запустите приложение:
```bash
docker-compose up --build
```

Приложение будет доступно по адресам:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

4. Для остановки:
```bash
docker-compose down -v
```

## Основные возможности

- 🔐 Аутентификация и авторизация пользователей
- 👥 Управление пользователями (для администраторов)
- 📝 Создание и редактирование статей
- 🏷️ Группировка статей по категориям
- ⭐ Система рейтинга статей
- 👤 Профили пользователей
- 🔍 Поиск по статьям
- 📱 Адаптивный дизайн

## Технологии

- Frontend:
  - React.js
  - React Router
  - MobX
  - Bootstrap
  - Axios
  - JWT Authentication

- Backend:
  - Node.js
  - Express.js
  - PostgreSQL
  - Sequelize ORM
  - JWT Authentication

- Инфраструктура:
  - Docker
  - Docker Compose
  - Nginx (для production)

## Ручная установка (без Docker)

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Smn08/wiki-platform.git
```

2. Установите зависимости:
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. Настройте переменные окружения:
- Создайте файл `.env` в папке `server`
- Добавьте необходимые переменные (см. `.env.example`)

4. Запустите приложение:
```bash
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm start
```

## Структура проекта

```
wiki-platform/
├── client/                 # Frontend приложение
│   ├── public/            # Статические файлы
│   └── src/               # Исходный код React
│       ├── components/    # React компоненты
│       ├── http/         # API клиент
│       ├── pages/        # Страницы приложения
│       └── store/        # MobX store
│
├── server/                # Backend приложение
│   ├── controllers/      # Контроллеры
│   ├── middleware/       # Middleware
│   ├── models/          # Модели базы данных
│   ├── routes/          # Маршруты API
│   └── utils/           # Вспомогательные функции
│
├── docker/               # Docker конфигурации
│   ├── nginx/           # Nginx конфигурации
│   └── postgres/        # PostgreSQL конфигурации
│
├── docker-compose.yml    # Docker Compose конфигурация
└── Dockerfile           # Основной Dockerfile
```

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.

You are free to:

- Share — copy and redistribute the material in any medium or format  
- Adapt — remix, transform, and build upon the material  

**Under the following terms:**

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- **NonCommercial** — You may not use the material for commercial purposes.

Read the full license text here: [https://creativecommons.org/licenses/by-nc/4.0/](https://creativecommons.org/licenses/by-nc/4.0/)

© 2025 [Smn08](https://github.com/Smn08)

## Контакты

- Email: staratushko@ya.ru
- GitHub: [github.com/Smn08](https://github.com/Smn08) 
