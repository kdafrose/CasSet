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
        data = request.json
        #Finds userID object in database
        ownerID = findUserID(data['owner_name'])

        object_playlist = pl.insert_one({
            "_id": data['_id'] , # PlaylistID (Primary key)
            "owner": ownerID, # UserID (Foreign key)
            "playlist_name": data['name'], 
            "date_created": data['date_created'],
            "sharing_link": data['sharing_link'],
            "note": data['note'],
        })
        return jsonify({"success": True, "result": str(object_playlist.inserted_id)}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 400


def findUserID(user_name):
    info = us.find_one({"name":user_name})
    return info["_id"]

    
@playlist_bp.route('/deletePlaylist', methods = ['DELETE'])
def deletePlaylist():

    try:
        data = request.json
        playlistName = data['playlist_name'] # playlist name

        pl.delete_one({"name": playlistName, "_id":data['_id']})
        return jsonify({"success":True, "staus":"Playlist has been successfully deleted."}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 400

@playlist_bp.route('/changePlaylistNote', methods = ['POST'])
def changePlaylistNote():
    try:
        data = request.json
        pl.update_one({"name": data['playlist_name'], "_id": data['_id']},{"$set": { "note": data['new_note']} })

        return jsonify({"success":True, "state":"Edited playlist note successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}),400

def listPlaylist():
    print(pl.find())
