const Router = require('express')
const router = new Router()
const userRoute = require('./userRouter')
const groupRouter = require('./groupRouter')
const textRouter = require('./textRouter')
const usersRouter = require('./usersRoutre')
const markRouter = require('./markRouter')
const fileUpload = require('express-fileupload')

router.use('/user',userRoute)
router.use('/text',textRouter)
router.use('/group',groupRouter)
router.use('/users', usersRouter)
router.use('/mark', markRouter)


module.exports = router
