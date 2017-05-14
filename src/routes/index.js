const express = require('express')

const mainPageRouter = require('./pages/main')

const router = new express.Router()

/* Pages */

router.get('/', mainPageRouter)

module.exports = router
