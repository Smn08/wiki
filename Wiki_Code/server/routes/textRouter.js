const Router = require('express')
const router = new Router()
const textController = require('../controllers/textController')
const authMiddleware = require('../middleware/authMiddleware')
const checkEditPermissionMiddleware = require('../middleware/checkEditPermissionMiddleware')

// Создание статьи доступно всем авторизованным пользователям
router.post('/', authMiddleware, textController.create)

// Получение статей доступно всем
router.get('/', textController.getAll)
router.get('/:id', textController.getOne)

// Редактирование и удаление статей требует проверки прав
router.patch('/:id', authMiddleware, checkEditPermissionMiddleware, textController.change)
router.delete('/:id', authMiddleware, checkEditPermissionMiddleware, textController.del)

module.exports = router
