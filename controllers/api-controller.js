const { PythonShell } = require('python-shell')

// coinbase api keys
require('dotenv').config()
const myKey = process.env.MY_KEY
const mySecret = process.env.MY_SECRET

let accountList = []
let accountIds = []

// create coinbase client instance
var Client = require('coinbase').Client
var client = new Client({
  apiKey: myKey,
  apiSecret: mySecret,
  strictSSL: false,
})

// fetch account data from coinbase api
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
        return accountList
      }
    })  
  }

  // utility to confirm api data pushed to arrs properly
  const checkData = () => {
    console.log(`ACCOUNT LIST? * * * * * ${accountList}`)
    // console.log(`ACCOUNT IDS? * * * * * * ${accountIds}`)
  }

  exports.getCoinbaseData = getCoinbaseData 
  exports.checkData = checkData