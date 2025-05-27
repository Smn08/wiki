# Wiki Platform

Современная платформа для создания и управления вики-статьями с поддержкой групп, пользователей и административных функций.

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

## Лицензия

Custom License – Non-Commercial Use Only

Copyright (c) github.com/Smn08, 2025

Permission is hereby granted to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, and distribute the Software for non-commercial purposes only, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

2. Commercial use of the Software is strictly prohibited without prior written permission from the copyright holder. This includes, but is not limited to, use in proprietary software, SaaS platforms, or any for-profit activities.

3. Any modified versions or derivative works of the Software that are distributed must be made available under the same terms as this license, and accompanied by full source code.

4. The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the author be liable for any claim, damages or other liability arising from the use of the Software.

5. This Software is intended solely for lawful use, such as load testing and research purposes, by authorized users on systems they own or have explicit permission to test. The Software must not be used for unauthorized attacks, denial-of-service operations, or any activities prohibited by applicable law.  

This is not a virus, malware, or illegal tool.

For inquiries regarding commercial licensing, contact: staratushko@ya.ru

## Контакты

- Email: staratushko@ya.ru
- GitHub: [github.com/Smn08](https://github.com/Smn08) 