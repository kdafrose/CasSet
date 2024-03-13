from pymongo import MongoClient
from connectDB import CONNECTION_STRING

client = MongoClient(CONNECTION_STRING)

db = client.usersInfo

coll = db.users

# find code goes here
email = input("emai lspls ")
fname = input("firsrtname ")
lname = input("lllllast name ")
coll.insert_one({ "email": email, "name": {"first": fname, "last": lname}})
#cursor = coll.find({})

# iterate code goes here

#for doc in cursor:
#    print(doc)

# Close the connection to MongoDB when you're done.

client.close()
