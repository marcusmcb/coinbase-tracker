const express = require('express')
const apiControllers = require('../controllers/api-controller')

const router = express.Router()

router.get('/', apiControllers.getCoinbaseData)

module.exports = router