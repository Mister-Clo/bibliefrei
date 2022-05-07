const express = require('express')
const session = require('express-session')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
var http = require('http')
const port = 3000

const apiRouter = require('./routes/api.js')

const app = express()
app.set('port',port)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({ secret: 'grehjznejzkhgjrez', saveUninitialized: false, resave: false }))
app.use(express.static(path.join(__dirname, '../client')))

app.use('/api/', apiRouter)

var server = http.createServer(app)
server.listen(port)

module.exports = app