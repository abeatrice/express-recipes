const express = require('express')
const router = express.Router()
const recipeRoutes = require('./routes/recipeRoutes')
const userRoutes = require('./routes/userRoutes')

router.use('/recipes', recipeRoutes)
router.use('/users', userRoutes)

module.exports = router
