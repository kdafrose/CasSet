from flask import request, jsonify, Blueprint
from pymongo import MongoClient
from connectDB import CONNECTION_STRING

playlist_bp = Blueprint('playlist_bp', __name__)

client = MongoClient(CONNECTION_STRING)
pl = client.playlists.playlistInfo
us = client.usersInfo.users

@playlist_bp.route('/postNewPlaylist', methods = ['POST'])
def postNewPlaylist():

    try:
        # Change attributes based on request data json file

        data = request.json

        # Checks if playlist exists in db 
        exists = checkPlaylistInDB(data['name'])
        #Finds userID object in database
        ownerID = findUserID(data['owner_name'])

        if not exists:
            object_playlist = pl.insert_one({
                "_id": data['_id'] , # PlaylistID (Primary key)
                "owner": ownerID, # UserID (Foreign key)
                "playlist_name": data['name'], 
                "date_created": data['date_created'],
                "sharing_link": data['sharing_link'],
                "note": data['note'],
            })
            return jsonify({"success": True, "result": str(object_playlist.inserted_id)}), 200
        
        else:
            return jsonify({"success":False, "result":"Playlist already exists."}), 409 # Playlist cannot be created as already exists in db
    except Exception as e:
        return jsonify({"error":str(e)}), 400


def checkPlaylistInDB(name):
    if pl.find_one({"playlist_name": name}):
        return True
    return False

def findUserID(user_name):
    info = us.find_one({"name":user_name})
    return info["_id"]

    
@playlist_bp.route('/deletePlaylist', methods = ['DELETE'])
def deletePlaylist():

    try:
        data = request.json
        playlistName = data['playlist_name'] # playlist name

        pl.delete_one({"name": playlistName})
        return jsonify({"success":True, "staus":"Playlist has been successfully deleted."}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 400



def listPlaylist():
    print(pl.find())
