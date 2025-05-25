const Router = require('express')
const router = new Router()
const usersController = require('../controllers/usersController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.get('/',usersController.getAll)
router.patch('/:id', usersController.change)
router.delete('/:id',usersController.delUser)

module.exports = router


