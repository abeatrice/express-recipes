const serverless = require('serverless-http')
const app = require('express')()
const bodyParser = require('body-parser')
const recipeRoutes = require('./recipeRoutes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/recipes', recipeRoutes)

module.exports.lambdaHandler = serverless(app)
