const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const coinbaseRoutes = require('./routes/coinbase-routes')

const app = express()


const mongoDB = process.env.MONGO_DB

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

// home route
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use('/fetchdata', coinbaseRoutes)

// error handling for unsupported routes
app.use((req, res, next) => {
  const error = new Error('Could not find this route.', 404)
  throw error
})

// error routing
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'An unknown error has occurred.' })
})

// mongoose
//   .connect(
//     `'${mongoDB}'`
//   )
//   .then(() => {
//     app.listen(3001, () => {
//       console.log('--------------------------')
//       console.log('App listening on PORT 3001')
//       console.log('--------------------------')
//     })
//   })
//   .catch((err) => {
//     console.log(`CONNECTION ERROR: ${err}`)
//   })

app.listen(3001, () => {
  console.log('--------------------------')
  console.log('App listening on PORT 3001')
  console.log('--------------------------')
})