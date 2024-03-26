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
            "shared_casset": data['playlistID']
        })

        return jsonify({"success": True, "result": "Friend added to the database successfully."}), 200
    
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
    

@friends_bp.route('/fetchAllFriends', methods = ['POST'])
def fetchAllFriends():
    try:
        data = request.json
        friendsDoc = fr.find({"userID":data['userID'], "friendUserID":data['friendUserID']})
        friends_list = list(friendsDoc)

        if not friends_list:
            return jsonify({"success":False, "result": f"User is not friends with {data['friend_name']}"}), 409
        else:
            return dumps(friends_list), 200
        
    except Exception as e:
        return jsonify(str(e)), 400