const path = require('path')

const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

// Fill process.env with environment variables
require('dotenv').config()

const connectToDB = require('./helpers/db-connector')
const logger = require('./helpers/logger')
const routes = require('./routes')

connectToDB(() => {
  const app = express()

  // Settings
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')

  // Middlewares
  app.use(express.static(path.join(__dirname, '../public')))
  app.use(morgan('combined', { stream: logger.stream }))
  app.use(bodyParser.json())
  app.use(helmet())

  // Routes
  app.set('strict routing', true)
  app.use('/', routes)

  // Not found middeware
  app.use((req, res, _next) => {
    res.status(404)

    if (req.accepts('html')) {
      const baseURL = process.env.BASE_URL
      const cssFilename = process.env.NODE_ENV === 'development' ? '404.css' : '404.min.css'

      return res.render('pages/404/404', {
        baseURL,
        cssFilename,
        title: 'Página no encontrada | Socketio'
      })
    }

    if (req.accepts('json')) {
      return res.status(404).json({ message: 'Not found' })
    }

    return res.type('txt').send('Not found')
  })

  // Error middeware
  app.use((err, req, res, _next) => {
    if (err instanceof SyntaxError) {
      return res.status(400).json({ message: 'Invalid JSON format' })
    }

    logger.error(err.stack)
    return res.status(500).json({ message: 'Something went wrong' })
  })

  process.on('uncaughtException', err => logger.error('Uncaught exception:\n', err))
  process.on('unhandledRejection', err => logger.error('unhandled rejection:\n', err))

  // App Initialization
  app.listen(3000, () => logger.info('Listening on port 3000'))
})
