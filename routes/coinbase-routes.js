const express = require('express')
const apiControllers = require('../controllers/api-controller')

const router = express.Router()

// route to fetch coinbase api data
router.get('/', apiControllers.getCoinbaseData)

// route to validate fetched data persists in controller vars
router.get('/checkdata', apiControllers.checkData)

module.exports = router