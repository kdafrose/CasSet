from casset.model.playlist import checkPlaylistInDB, editPlaylistNotePL, getUserPlaylistsPL, newPlaylistPL, removePlaylistPL
from casset.model.song import *
from casset.model.friends import *
from flask import request, jsonify, Blueprint

app_bp = Blueprint('app_bp', __name__)

### POST PLAYLIST DOCUMENT IN DATABASE ###
@app_bp.route('/postNewPlaylist', methods = ['POST'])
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
@app_bp.route('/deletePlaylist', methods = ['DELETE'])
def deletePlaylist():
    try:
        data = request.json
        removePlaylistPL(data['_id'], data['playlist_name'])

        return jsonify({"success":True, "staus":"Playlist has been successfully deleted."}), 200
    
    except Exception as e:
        return jsonify({"error":str(e)}), 400

### EDITS PLAYLIST ANNOTATION IN DATABASE ###
@app_bp.route('/changePlaylistNote', methods = ['POST'])
def changePlaylistNote():
    try:
        data = request.json
        editPlaylistNotePL(data['_id'], data['playlist_name'], data['new_note'])

        return jsonify({"success":True, "status":"Edited playlist note successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}),400

### FETCH PLAYLIST DOCUMENT ###
@app_bp.route('/fetchPlaylistDocument', methods = ['POST'])
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
    
@app_bp.route('/fetchMultiPlaylistDocuments', methods = ['POST'])
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
    
# Song Functions
    
@app_bp.route('/addSong', methods = ['POST'])
def addSong():

    data = request.json
    song = data['songID']

    result = addSongSG(data)

    if not result:
        return jsonify({"success": False, "result": "User has no playlist in the database."}), 409
    else:
        return jsonify({"success": True, "result": "Song f{song} was added."}), 400
    
@app_bp.route('/postMultipleSongs', methods = ['POST'])
def postMultipleSongs():
    
    try:
        data = request.json
        sg.insert_many(data)

        return jsonify({"success":True, "result":"Added songs successfully to database."}), 200
    except Exception as e:
        return jsonify(str(e))
    
@app_bp.route('/removeSong', methods = ['DELETE'])
def removeSong():

    data = request.json
    song = data['songID']

    result = deleteSongSG(data['_id'], data['songID'])

    if not result:
        return jsonify({"success": False, "result": "User has no playlist in the database."}), 409
    else:
        return jsonify({"success": True, "result": "Song f{song} was deleted."}), 400
    
@app_bp.route('/editSongNote', methods = ['POST'])
def editSongNote():

    data = request.json
    song = data['songID']

    result = editSongNoteSG(data['_id'], data['songID'], data['newNote'])

    if not result:
        return jsonify({"success": False, "result": "User has no playlist in the database."}), 409
    else:
        return jsonify({"success": True, "result": "Song f{song} note was edited."}), 400
    
@app_bp.route('/getSong', methods = ['POST'])
def getSong():
    try:
        data = request.json
        songDoc = getSongSG(data['songID'], data['playlistID'])

        if not songDoc:
            return jsonify({"sucess":False, "result": "Song does not exists in playlist or database."}), 409
        else:
            return jsonify(songDoc), 200
        
    except Exception as e:
        return jsonify(str(e)), 400
    
@app_bp.route('/getMultiSongs', methods = ['POST'])
def getPlaylistSongs():
    try:
        data = request.json
        songDocuments =  getPlaylistSongsSG(data['playlistID'])
        songs_list = list(songDocuments)

        if not songs_list:
            return jsonify({"success": False, "result": "No songs in playlist."}), 409
        else:
            return dumps(songs_list), 200
        
    except Exception as e:
        return jsonify(str(e)), 400

# Friend Functions
    
@app_bp.route('/addFriend', methods = ['POST'])
def addFriend():
    try:
        data = request.json
        addFriendFR(data['userID'], data['friend_name'], data['playlistID'])

        return jsonify({"success": True, "result": "Friend added to the database successfully."}), 200
    
    except Exception as e:
        return jsonify(str(e)), 400

@app_bp.route('/removeFriend', methods = ['DELETE'])
def removeFriend():
    try:
        data = request.json
        removeFriendFR(data['userID'], data['friend_name'], data['playlistID'])

        return jsonify({"success": True, "result": "Friend removed to the database successfully."}), 200
    
    except Exception as e:
        return jsonify(str(e)), 400
    
@app_bp.route('/addNewSharedCasset', methods = ['POST'])
def addNewSharedCasset():
    try:
        data = request.json
        newSharedCassetFR(data['friendsID'],data['newSharedPlaylistID'])

        return jsonify({"success": True, "result": "Shared casset added to the database successfully."}), 200
    
    except Exception as e:
        return jsonify(str(e)), 400
    
@app_bp.route('/fetchAllFriends', methods = ['POST'])
def fetchAllFriends():
    try:
        data = request.json
        
        friends_list = fetchAllFriendsFR(data['userID'], data['friendUserID'])

        if not friends_list:
            return jsonify({"success":False, "result": f"User is not friends with {data['friend_name']}"}), 409
        else:
            return dumps(friends_list), 200
        
    except Exception as e:
        return jsonify(str(e)), 400
    
@app_bp.route('/searchFriend', methods = ['POST'])
def searchFriend():
    try:
        data = request.json
        
        foundFriend = fetchAllFriendsFR(data['userID'], data['friendUserID'])

        if not foundFriend:
            return jsonify({"success":False, "result": f"User is not friends with {data['friend_name']}"}), 409
        else:
            return dumps(foundFriend), 200
        
    except Exception as e:
        return jsonify(str(e)), 400