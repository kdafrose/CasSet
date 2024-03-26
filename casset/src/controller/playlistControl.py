from casset.db.playlist import checkPlaylistInDB, editPlaylistNotePL, getUserPlaylistsPL, newPlaylistPL, removePlaylistPL
from casset.db.song import *
from flask import request, jsonify, Blueprint

playlist_bp = Blueprint('playlist_bp', __name__)

### POST PLAYLIST DOCUMENT IN DATABASE ###
@playlist_bp.route('/postNewPlaylist', methods = ['POST'])
def postNewPlaylist():
    try:
        data = request.json
        exists = checkPlaylistInDB(data['_id'])

        if not exists:
            object_playlist = newPlaylistPL(data)
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
        removePlaylistPL(data['_id'], data['playlist_name'])

        return jsonify({"success":True, "staus":"Playlist has been successfully deleted."}), 200
    
    except Exception as e:
        return jsonify({"error":str(e)}), 400

### EDITS PLAYLIST ANNOTATION IN DATABASE ###
@playlist_bp.route('/changePlaylistNote', methods = ['POST'])
def changePlaylistNote():
    try:
        data = request.json
        editPlaylistNotePL(data['_id'], data['playlist_name'], data['new_note'])

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
        userPlaylists = getUserPlaylistsPL(data)

        if not userPlaylists:
            return jsonify({"success": False, "result": "User has no playlist in the database."}), 409
        else:
            return jsonify(userPlaylists), 200
        
    except Exception as e:
        return jsonify(str(e)), 400
    
@playlist_bp.route('/addSong', methods = ['POST'])
def addSong():

    data = request.json
    song = data['songID']

    result = addSongSG(data['_id'], data['songID'])

    if not result:
        return jsonify({"success": False, "result": "User has no playlist in the database."}), 409
    else:
        return jsonify({"success": True, "result": "Song f{song} was added."}), 400
    
@playlist_bp.route('/removeSong', methods = ['DELETE'])
def removeSong():

    data = request.json
    song = data['songID']

    result = deleteSongSG(data['_id'], data['songID'])

    if not result:
        return jsonify({"success": False, "result": "User has no playlist in the database."}), 409
    else:
        return jsonify({"success": True, "result": "Song f{song} was deleted."}), 400
    
@playlist_bp.route('/editSongNote', methods = ['POST'])
def editSongNote():

    data = request.json
    song = data['songID']

    result = editSongNoteSG(data['_id'], data['songID'], data['newNote'])

    if not result:
        return jsonify({"success": False, "result": "User has no playlist in the database."}), 409
    else:
        return jsonify({"success": True, "result": "Song f{song} note was edited."}), 400