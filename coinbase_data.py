from coinbase.wallet.client import Client
from dotenv import load_dotenv
import os 

load_dotenv()

client = Client(os.getenv('MY_KEY'), os.getenv('MY_SECRET'))
response = client.get_accounts(limit=100)

coin_array = []

for coin in response.data:
    coin_array.append(coin.id)

print(coin_array)
