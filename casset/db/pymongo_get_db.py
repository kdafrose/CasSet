from pymongo import MongoClient
from connectDB import CONNECTION_STRING

def get_database():

    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    test = 0
    

    

if __name__ == "__main__":
    client = MongoClient(CONNECTION_STRING)
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)