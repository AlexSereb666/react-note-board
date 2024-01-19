const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const noteRouter = require('./noteRouter')

router.use('/user', userRouter)
router.use('/note', noteRouter)

module.exports = router
