FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 5000

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Запускаем dev-сервер
CMD ["npm", "run", "dev"]
