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
    # Check if the email already exists in the database
    if coll.find_one({"email": email}):
        # Email already exists, return a message instead of inserting
        return "Email already exists in the database."
    
    # If the email does not exist, insert a new document
    insert_result = coll.insert_one({"email": email, "name": name})
    return str(insert_result.inserted_id)

if __name__ == '__main__':
    app.run(debug=True, port = 5000)

