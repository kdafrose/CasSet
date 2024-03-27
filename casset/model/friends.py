from flask import request, jsonify, Blueprint
from bson.json_util import dumps
from pymongo import MongoClient
from connectDB import CONNECTION_STRING 
from playlist import findUserID

friends_bp = Blueprint('friends_bp', __name__)

client = MongoClient(CONNECTION_STRING)
fr = client.friends.friendsInfo

@friends_bp.route('/addFriend', methods = ['POST'])
def addFriend():
    try:
        data = request.json
        userID = findUserID(data['user_name'], data['user_email'])
        foundFriend = findIfFriends(userID, data['friend_name'])
       
        if not foundFriend:
            fr.insert_one({
                "userID":userID,
                "friend_name":data['friend_name']
            })
            return jsonify({"success":True, "result":"Friend added to database successfully"}), 200

        else: 
            return jsonify({"success":True, "result":"Already friends."}), 409
        
    except Exception as e:
        return jsonify(str(e)), 400
    
@friends_bp.route('/addNewSharedCasset', methods = ['POST'])
def addNewSharedCasset():
    try:
        data = request.json
        user_name = data.get('user_name')
        user_email = data.get('user_email')
        friend_name = data.get('friend_name')
        newCasset = data.get('newSharedPlaylistID')

        if not (user_name and user_email and friend_name and newCasset):
            return jsonify({"error": "Required fields (userID, friend_name, newSharedPlaylistID) are missing in the request."}), 400

        userID = findUserID(user_name, user_email)
        fr.update_one({"userID": userID, "friend_name":friend_name}, {"$push": {"shared_casset": newCasset}})
        return jsonify({"success": True, "result": "Shared casset added to the database successfully."}), 200
    
    except Exception as e:
        return jsonify(str(e)), 400
    

@friends_bp.route('/findAddedFriends', methods = ['POST'])
def findAddedFriends():
    try:
        data = request.json
        userID = findUserID(data['name'], data['email'])

        addedFriendsDocs = fr.find({"userID": userID})
        addedFriendsList = list(addedFriendsDocs)

        if not addedFriendsList:
            return jsonify({"success": False, "result": "User has no friends added."}), 409
        else:
            return dumps(addedFriendsList), 200
        
    except Exception as e:
        return jsonify(str(e)), 400
    
    
@friends_bp.route('/removeFriend', methods = ['DELETE'])
def removeFriend():
    try:
        data = request.json
        user_name = data.get('user_name')
        user_email = data.get('user_email')
        friend_name = data.get('friend_name')

        if not (user_name and user_email and friend_name):
            return jsonify({"error": "Required fields (user_name, user_email, friend_name) are missing in the request."}), 400
        
        userID = findUserID(user_name, user_email)
        fr.delete_one({"userID": userID, "friend_name": friend_name})

        return jsonify({"success": True, "result": "Friend has been successfully deleted."}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400


def findIfFriends(userID, friend_name):
    if fr.find_one({"userID": userID, "friend_name":friend_name}):
        return True
    return False

    