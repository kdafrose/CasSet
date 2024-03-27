from flask import Flask, request, jsonify, Blueprint
from pymongo import MongoClient
from bson.json_util import dumps
from connectDB import CONNECTION_STRING
from flask_cors import CORS

users_bp = Blueprint('users_bp', __name__)

client = MongoClient(CONNECTION_STRING)
db = client.usersInfo
coll = db.users

@users_bp.route('/postUserInfo', methods=['POST'])
def postUserInfo():
    try:
        data = request.json
        email = data['email']
        name = data['name']
        
        result = checkUserInDB(email, name)
        
        return jsonify({"success": True, "result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


def checkUserInDB(email, name):
    # Check if the email already exists in the database
    if coll.find_one({"email": email}):
        # Email already exists, return a message instead of inserting
        return "Email already exists in the database."
    
    # If the email does not exist, insert a new document
    insert_result = coll.insert_one({"email": email, "name": name})
    return str(insert_result.inserted_id)


@users_bp.route('/searchUsers', methods=['POST'])
def searchUsers():
    try:
        data = request.json
        users = coll.find_one({"email": data['email']})

        if users is None:
            return jsonify({"success": False, "result": "No User found with email input"}), 409
        else:
            return dumps(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400