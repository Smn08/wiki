const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration',userController.registration)
router.post('/login', userController.login )
router.get('/auth', authMiddleware, userController.check)
router.patch('/img/:id', userController.changeImg)
router.patch('/password/:id', userController.changePassword)

module.exports = router


