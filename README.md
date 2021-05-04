As it sits, this is a simple Express app to pull account data from the Coinbase API with a registered API key set.  

Currently, the app fetches the ids of all available coin wallets in the user's account (via Python) and then retrieves the current data for each (via Node).

Future dev:

- secure cloud storage for the retrieved data
- front end dashboard (asset visualizations)
- ML to analyze current/historical data