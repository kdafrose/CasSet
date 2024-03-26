from flask import request, jsonify, Blueprint
from bson.json_util import dumps
from pymongo import MongoClient
from connectDB import CONNECTION_STRING

songs_bp = Blueprint('songs_bp', __name__)

client = MongoClient(CONNECTION_STRING)
sg = client.song.songInfo

@songs_bp.route('/postSong', methods = ['POST'])
def postSong():

    try:
        data = request.json
        
        song_document = sg.insert_one({
            "songID": data['songID'],
            "playlistID": data['playlistID'],
            "name": data['name'],
            "song_image":data['song_image'],
            "artist": data['artist'],
            "annotation":data['annotation'],
        })
        return jsonify({"success":True, "result": str(song_document.inserted_id)}), 200
    except Exception as e:
        return jsonify(str(e)), 400
    
@songs_bp.route('/postMultipleSongs', methods = ['POST'])
def postMultipleSongs():
    
    try:
        data = request.json
        sg.insert_many(data)

        return jsonify({"success":True, "result":"Added songs successfully to database."}), 200
    except Exception as e:
        return jsonify(str(e))

@songs_bp.route('/deleteSong', methods = ['DELETE'])
def deleteSong():
    pass

@songs_bp.route('/getSong', methods = ['POST'])
def getSong():
    try:
        data = request.json
        songDoc = sg.find_one({"songID":data['songID'], "playlistID":data['playlistID']})

        if not songDoc:
            return jsonify({"sucess":False, "result": "Song does not exists in playlist or database."}), 409
        else:
            return jsonify(songDoc), 200
        
    except Exception as e:
        return jsonify(str(e)), 400
    
@songs_bp.route('/getMultiSongs', methods = ['POST'])
def getMultiSongs():
    try:
        data = request.json
        songDocuments = sg.find({"playlistID":data['playlistID']})
        songs_list = list(songDocuments)

        if not songs_list:
            return jsonify({"success": False, "result": "No songs in playlist."}), 409
        else:
            return dumps(songs_list), 200
        
    except Exception as e:
        return jsonify(str(e)), 400
    

@songs_bp.route('/editNote', methods = ['POST'])
def editNote():
    try:
        data = request.json
        sg.update_one({"songID":data['songID'], "playlistID":data['playlistID']}, {"$set": {"annotation": data['new_note']}})

        return jsonify({"success": True, "result":"Note was edited and saved to the database successfully"})
    
    except Exception as e:
        return jsonify(str(e))
    
