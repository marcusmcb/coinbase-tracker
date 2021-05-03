const express = require('express')
const bodyParser = require('body-parser')

const coinbaseRoutes = require('./routes/coinbase-routes')

const app = express()

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

app.listen(3000, () => {
  console.log('--------------------------')
  console.log('App listening on PORT 3000')
  console.log('--------------------------')
})

// get current crypto price & convert to USD
// client.getBuyPrice({ currencyPair: 'BTC-USD' }, function (err, obj) {
//   if (err) {
//     console.log(`getBuyPrice ERROR: ${err}`)
//   } else {
//     console.log(
//       '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - '
//     )
//     console.log(
//       `Current ${obj.data.base}-${obj.data.currency} Conversion: ${obj.data.amount}`
//     )
//     console.log(
//       '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - '
//     )
//   }
// })
