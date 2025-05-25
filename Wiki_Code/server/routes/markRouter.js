const Router = require('express')
const router = new Router()
const markController = require('../controllers/markController')

router.get('/:id',markController.getAll)
router.post('/', markController.add)
router.delete('/',markController.del)

module.exports = router
