const express = require('express')
const router = express.Router()
const {index, store, show, update, destroy} = require('../controllers/recipesController')
const {auth} = require('../middleware/auth')

router.get('/', auth, index)
router.post('/', auth, store)
router.get('/:id', auth, show)
router.put('/:id', auth, update)
router.delete('/:id', auth, destroy)

module.exports = router
