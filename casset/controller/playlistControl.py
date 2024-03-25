from casset.db.playlist import *
from flask import request, jsonify, Blueprint
from pymongo import MongoClient
from db.connectDB import CONNECTION_STRING

playlist_bp = Blueprint('playlist_bp', __name__)

client = MongoClient(CONNECTION_STRING)
pl = client.playlists.playlistInfo
us = client.usersInfo.users

### POST PLAYLIST DOCUMENT IN DATABASE ###
@playlist_bp.route('/postNewPlaylist', methods = ['POST'])
def postNewPlaylist():

    try:
        data = request.json
        #Finds userID object in database
        ownerID = findUserID(data['owner_name'])
        exists = checkPlaylistInDB(data['_id'])

        date_time = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")

        object_playlist = newPlaylist(pl, data)

            return jsonify({"success": True, "result": str(object_playlist.inserted_id)}), 200
        else:
            return jsonify({"success":False, "result":"Playlist already in database."}), 409
    except Exception as e:
        return jsonify({"error":str(e)}), 400

    
### DELETES A PLAYLIST DOCUMENT IN DATABASE ###
@playlist_bp.route('/deletePlaylist', methods = ['DELETE'])
def deletePlaylist():

    try:
        data = request.json
        playlistName = data['playlist_name'] # playlist name

        pl.delete_one({"name": playlistName, "_id":data['_id']})
        return jsonify({"success":True, "staus":"Playlist has been successfully deleted."}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 400

### EDITS PLAYLIST ANNOTATION IN DATABASE ###
@playlist_bp.route('/changePlaylistNote', methods = ['POST'])
def changePlaylistNote():
    try:
        data = request.json
        pl.update_one({"name": data['playlist_name'], "_id": data['_id']},{"$set": { "note": data['new_note']} })

        return jsonify({"success":True, "status":"Edited playlist note successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}),400

### FETCH PLAYLIST DOCUMENT ###
@playlist_bp.route('/fetchPlaylistDocument', methods = ['POST'])
def fetchPlaylistDocument():
    try:

        data = request.json
        playlistID = data['_id']
        playlistDoc = pl.find_one({"_id":playlistID})

        if not playlistDoc:
            return jsonify({"success": False, "status": "Playlist does not exist in database."}), 409
        return jsonify(playlistDoc), 200
    except Exception as e:
        return jsonify(str(e)), 400
    
@playlist_bp.route('/fetchMultiPlaylistDocuments', methods = ['POST'])
def fetchMultiPlaylistDocuments():
    try:
        data = request.json
        playlistDocs = pl.find({"owner": data['owner']})

        if not playlistDocs:
            return jsonify({"success": False, "result": "User has no playlist in the database."}), 409
        else:
            return jsonify(playlistDocs), 200
        
    except Exception as e:
        return jsonify(str(e)), 400
    
@playlist_bp.route('/removeSong', methods = ['DELETE'])
def removeSong():

    data = request.json

    pl.update_one(
        {"_id": data['playlistName']}, 
        {"$pull": {"songs": {"songID": data['songID']}}}
    )