import os
from dotenv import load_dotenv

load_dotenv()
CONNECTION_STRING = os.getenv("MONGO_CONNECTION_STRING")