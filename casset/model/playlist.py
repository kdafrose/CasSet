from flask import request, jsonify, Blueprint
from bson.json_util import dumps
from pymongo import MongoClient
from connectDB import CONNECTION_STRING
import datetime

playlist_bp = Blueprint('playlist_bp', __name__)

client = MongoClient(CONNECTION_STRING)
pl = client.playlists.playlistInfo
us = client.userInfo.users

def newPlaylistPL(newData):
    date_time = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")

    ownerID = findUserID(newData['owner_name'])

    result = pl.insert_one({
        "_id": newData['_id'] , # PlaylistID (Primary key)
        "owner": ownerID, # UserID (Foreign key)
        "playlist_name": newData['name'],
        "length": newData['length'],
        "date_created": date_time,
        "last_edited": date_time,
        "sharing_link": newData['sharing_link'],
        "note": newData['note'],
        "songs": [
            #Remove these later
            {
                "songID": "ID1",
                "songName": "name1",
                "songNote": "sdf"
            },
            {
                "songID": "ID2",
                "songName": "name2",
                "songNote": "asdf"
            },
            {
                "songID": "ID3",
                "songName": "name3",
                "songNote": "asdf"
            }
            #
        ]})
    
    return result

def removePlaylistPL(id, playlistName):
    pl.delete_one({"name": playlistName, "_id":id})

def editPlaylistNotePL(id, playlistName, newNote):
    pl.update_one({"name": playlistName, "_id": id},{"$set": { "note": newNote} })
    changeEditDate(id)

### FETCH PLAYLIST DOCUMENT ###
@playlist_bp.route('/fetchPlaylistDocument', methods = ['POST'])
def fetchPlaylistDocument():
    try:

        data = request.json
        playlistDoc = pl.find_one({"_id":data['_id']})
        playlist_item = list(playlistDoc)

        if not playlist_item:
            return jsonify({"success": False, "status": "Playlist does not exist in database."}), 409
        return dumps(playlistDoc), 200
    
    except Exception as e:
        return jsonify(str(e)), 400
    
def getUserPlaylistsPL(name):
    result = pl.find({"owner": name['owner']})
    return result

@playlist_bp.route('/fetchMultiPlaylistDocuments', methods = ['POST'])
def fetchMultiPlaylistDocuments():
    try:
        data = request.json
        ownerID = findUserID(data['name'], data['email'])
        playlistDocs = pl.find({"owner": ownerID})

        playlist_list = list(playlistDocs)

        if not playlist_list:
            return jsonify({"success": False, "result": "User has no playlist in the database."}), 409
        else:
            return dumps(playlist_list), 200
        
    except Exception as e:
        return jsonify(str(e)), 400

### HELPER FUNCTIONS ###
def checkPlaylistInDB(playlistID):
    if(pl.find_one({"_id":playlistID})):
        return True
    return False

def findUserID(user_name, user_email):
    info = us.find_one({"name":user_name, "email":user_email})
    return info["_id"]

def showPlaylists():
    cursor = pl.find({})

    print("= = = = = = = = = =")
    for document in cursor:
        print("Playlist: ", document["name"])
    print("= = = = = = = = = =")

def changeEditDate(id):
    date_time = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")
    pl.update_one({"_id": id},{"$set": { "last_edited": date_time} })
