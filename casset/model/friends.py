from flask import request, jsonify, Blueprint
from bson.json_util import dumps
from pymongo import MongoClient
from connectDB import CONNECTION_STRING 

friends_bp = Blueprint('friends_bp', __name__)

client = MongoClient(CONNECTION_STRING)
fr = client.friends.friendsInfo
    
def addFriendFR(friendID, friendName, friendPlaylist):
    fr.insert_one({
        "userID": friendID,
        "friends_name": friendName,
        "shared_casset": friendPlaylist
    })
    
def removeFriendFR(friendID, friendName, friendPlaylist):
    fr.delete_one({
        "userID": friendID,
        "friends_name": friendName,
        "shared_casset": friendPlaylist
    })
    
def newSharedCassetFR(friendID, sharedPlaylistID):
    fr.update_one(
        {"_id": friendID}, 
        {"$push": {"shared_casset": sharedPlaylistID}}
    )

def searchFriendFR(friendName):
    result = fr.find_one({'friends_name': friendName})
    return result
    
def fetchAllFriendsFR(userID, friendID):
    result = fr.find({"userID": userID, "friendUserID": friendID})
    return list(result)