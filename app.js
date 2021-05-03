const express = require('express')
const bodyParser = require('body-parser')

const coinbaseRoutes = require('./routes/coinbase-routes')

const { PythonShell } = require('python-shell')

// coinbase api keys
require('dotenv').config()
const myKey = process.env.MY_KEY
const mySecret = process.env.MY_SECRET

const app = express()

app.use(bodyParser.json())

// empty arrays to populate w/coinbase data
let accountList = []
let accountIds = []

// create coinbase client instance
var Client = require('coinbase').Client
var client = new Client({
  apiKey: myKey,
  apiSecret: mySecret,
  strictSSL: false,
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})



// function to call python coinbase script & retrieve all account ids
const getCoinbaseData = async () => {
  await PythonShell.run('coinbase_data.py', null, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      const data = results
      for (const [key, value] of Object.entries(data)) {
        // grab value from single returned key
        let ckeys = value
        let ckeysSplit = ckeys.split("', '")
        // remove first & last chars from returned string split
        ckeysSplit = ckeysSplit.slice(1, -1)
        // loop through each id and fetch its account data
        for (var i = 0; i < ckeysSplit.length; i++) {
          // push id to array
          accountIds.push(ckeysSplit[i])
          // fetch account data
          let accountId = ckeysSplit[i]
          client.getAccount(accountId, function (err, account) {
            if (err) {
              console.log(err)
            } else {
              // only push accounts to array with balances greater than 0
              if (account.balance.amount > 0) {
                console.log(account.currency.name, account.balance.amount)
                accountList.push(account)
              }
            }
          })
        }
        console.log('--------------------------')
        console.log(`ACCOUNT IDS? ${accountIds}`)
        console.log('--------------------------')
      }
    }
  })  
}

// home route
app.get('/', (req, res) => {
  res.send('Hello World')
})

// route to fetch coinbase data
// used python script to pass limit param; unable to duplicate using Node API
app.get('/getdata', (req, res) => {
  getCoinbaseData()
  res.send(`<h3 style="color:green">Check yer Node console, son...</h3>`)
})

app.use('/fetchdata', coinbaseRoutes)

// utility endpoint to check arrays are populated correctly
app.get('/datacheck', (req, res) => {
  console.log('* * * * * * * * * * * *')
  console.log(`DC IDS: ${accountIds}`)
  console.log('* * * * * * * * * * * *')
  console.log(`DC LST: ${accountList}`)
  console.log('* * * * * * * * * * * *')
})

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
