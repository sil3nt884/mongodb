const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const Broker = require('./broker')
const broker = new Broker()


const dbHandler = require('./src/dbHandler')
const uploadHandler = require('./src/uploadHandler')
const fileList = require('./src/fileList')
const schemaCreator = require('./src/fileToSchema')
const indexRouter = require('./routes/index')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'client/public')))

uploadHandler(broker)
app.use('/', indexRouter(broker))
fileList(broker)
schemaCreator(broker)
dbHandler(broker)

module.exports = app
