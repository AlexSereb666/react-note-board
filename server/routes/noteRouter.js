const Router = require('express')
const router = new Router()
const noteController = require('../controllers/noteController')

router.post('/', noteController.addNote)
router.get('/:id', noteController.getOneNote)
router.delete('/:id', noteController.deleteNote)
router.put('/:id', noteController.updateNote)

module.exports = router
