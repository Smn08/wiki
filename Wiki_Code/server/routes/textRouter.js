const Router = require('express')
const router = new Router()
const textController = require('../controllers/textController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/',textController.create)
router.get('/',textController.getAll)
router.get('/:id',textController.getOne)
router.patch('/:id', textController.change)
router.delete('/:id', textController.del)

module.exports = router
