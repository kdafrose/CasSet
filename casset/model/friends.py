from flask import request, jsonify, Blueprint
from bson.json_util import dumps
from pymongo import MongoClient
from connectDB import CONNECTION_STRING 

friends_bp = Blueprint('friends_bp', __name__)

client = MongoClient(CONNECTION_STRING)
fr = client.friends.friendsInfo

@friends_bp.route('/addFriend', methods = ['POST'])
def addFriend():
    try:
        data = request.json

        fr.insert_one({
            "userID": data['userID'],
            "friends_name": data['friend_name'],
            "friends_email": data['friend_email'],
            "shared_casset": data['playlistID']
        })

        return jsonify({"success": True, "result": "Friend added to the database successfully."}), 200
    
    except Exception as e:
        return jsonify(str(e)), 400
    
@friends_bp.route('/removeFriend', methods = ['POST'])
def removeFriend():
    try:
        data = request.json

        fr.delete_one({
            "userID": data['userID'],
            "friends_name": data['friend_name']
        })

        return jsonify({"success": True, "result": "Friend removed to the database successfully."}), 200
    
    except Exception as e:
        return jsonify(str(e)), 400   
    
@friends_bp.route('/addNewSharedCasset', methods = ['POST'])
def addNewSharedCasset():
    try:
        data = request.json
        fr.update_one({"_id": data['friendsID']}, {"$push": {"shared_casset": data['newSharedPlaylistID']}})
        return jsonify({"success": True, "result": "Shared casset added to the database successfully."}), 200
    
    except Exception as e:
        return jsonify(str(e)), 400

@friends_bp.route('/findFriend', methods = ['POST'])
def findFriend():
    try:
        data = request.json
        result = fr.find({"userID": data['userID']})
        found_friend = list(result)

        if not found_friend:
            return jsonify({"success": False, "result": "No songs in playlist."}), 409
        else:
            return dumps(found_friend), 200
    
    except Exception as e:
        return jsonify(str(e)), 400 
    
