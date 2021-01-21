const serverless = require('serverless-http')
const app = require('express')()
const bodyParser = require('body-parser')
const routes = require('./routes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/recipes', routes)

module.exports.lambdaHandler = serverless(app)
