const serverless = require('serverless-http')
const app = require('express')()
const bodyParser = require('body-parser')
const routes = require('./routes')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', routes)

module.exports.lambdaHandler = serverless(app)
