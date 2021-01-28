const express = require('express')
const router = express.Router()
const {register, login, logout, logoutAll} = require('../controllers/usersController')
const {auth} = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', auth, logout)
router.post('/logoutall', auth, logoutAll)

module.exports = router
