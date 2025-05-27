const ApiError = require('../error/ApiError')
const {Text} = require('../models/models')

module.exports = async function (req, res, next) {
    try {
        const {id} = req.params
        const userId = req.user.id
        const userRole = req.user.role

        // Админы могут редактировать любые статьи
        if (userRole === 'ADMIN') {
            return next()
        }

        // Проверяем, является ли пользователь автором статьи
        const text = await Text.findOne({where: {id}})
        if (!text) {
            return next(ApiError.notFound('Статья не найдена'))
        }

        if (text.userId !== userId) {
            return next(ApiError.forbidden('У вас нет прав на редактирование этой статьи'))
        }

        next()
    } catch (e) {
        return next(ApiError.internal('Ошибка при проверке прав на редактирование'))
    }
} 