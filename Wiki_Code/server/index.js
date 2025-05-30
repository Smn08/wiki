require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHondler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const initDb = require('./initDb')

const PORT = process.env.PORT || 5000

const app = express()

app.get('/health', (req, res) => res.send('OK'));

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
// Логирование запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}))
app.use('/api', router)

//Обработка ошибкиб идет последним middleware
app.use(errorHondler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        await initDb() // Инициализация базы данных с администратором
        app.listen(PORT, () => console.log('start server in port ' + PORT))
    } catch (error) {
        console.log(error);
    }
}

start();
