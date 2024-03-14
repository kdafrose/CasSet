# from flask import Flask, request, jsonify
# from pymongo import MongoClient
# from connectDB import CONNECTION_STRING

# app = Flask(__name__)

# client = MongoClient(CONNECTION_STRING)

# db = client.usersInfo

# coll = db.users

# # find code goes here
# #email = input("emai lspls ")
# #fname = input("firsrtname ")
# #lname = input("lllllast name ")
# @app.route('/call_python_function', methods=['POST'])
# def call_python_function():
#     # Retrieve parameters from the request
#     param1 = request.json['email']
#     param2 = request.json['name']
    
#     # Call your Python function with the parameters
#     result = your_python_function(param1, param2)
    
#     # Do something with the result
#     return result


# def your_python_function(param1, param2):
#     # Your Python function implementation
#     # This function can interact with MongoDB if needed
#     coll.insert_one({ "email": param1, "name": param2})
#     return 0
# #cursor = coll.find({})

# # iterate code goes here

# #for doc in cursor:
# #    print(doc)

# # Close the connection to MongoDB when you're done.

# #client.close()

from flask import Flask, request, jsonify
from pymongo import MongoClient
from connectDB import CONNECTION_STRING
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

client = MongoClient(CONNECTION_STRING)
db = client.usersInfo
coll = db.users

@app.route('/call_python_function', methods=['POST'])
def call_python_function():
    try:
        data = request.json
        email = data['email']
        name = data['name']
        
        result = your_python_function(email, name)
        
        return jsonify({"success": True, "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


def your_python_function(email, name):
    # Your Python function implementation
    # This function interacts with MongoDB
    insert_result = coll.insert_one({"email": email, "name": name})
    return str(insert_result.inserted_id)

if __name__ == '__main__':
    app.run(debug=True, port = 5000)
