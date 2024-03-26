from flask import request, jsonify, Blueprint
from bson.json_util import dumps
from pymongo import MongoClient
from connectDB import CONNECTION_STRING
import datetime

comments_bp = Blueprint('comments_bp', __name__)

client = MongoClient(CONNECTION_STRING)
db = client.comments
com = db.commentsInfo
pl = client.playlists.playlistInfo


@comments_bp.route('/addComment', methods = ['POST'])
def addComment():
    try:
        data = request.json
        
        com.insert_one({
            "commentsID" : data['commentsID'],
            "playlistID" : data['playlistID'],
            "songID": data['songID'],
            "comment": data['comment']
        })

        #Will update last_edit attribute in playlist db
        changePlaylistLastDateEdit(data['playlistID'])

        return jsonify({"success":True, "result":"Comment added to database successfully."}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 400
    
@comments_bp.route('/addReply', methods = ['POST'])
def addReply():
    try:
        data = request.json
        #data['new_comment'] should be ["comments", "User name"] --> if wanted nested 
        com.update_one({"_id":data['commentsID']}, {"$push": {"comment": data['new_comment']}})
        return jsonify({"success":True, "result": "Comment has beed edited successfully"}), 200
    
    except Exception as e:
        return jsonify(str(e)), 200

@comments_bp.route('/deleteComment', methods = ['DELETE'])
def deleteComment():
    try:
        data = request.json
        commentID = data['commentID']

        com.delete_one({"_id":commentID})
        return jsonify({"success": True, "status": "Comment has been deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@comments_bp.route('/getComments', methods = ['POST'])
def getComments():
    try:
        data = request.json
        commentsDocs = com.find({"playlistID":data['playlistID'], "songID": data['songID']})

        comments_list = list(commentsDocs)

        if not comments_list:
            return jsonify({"success": False, "result": "Song has no comments"}), 409
        else:
            return dumps(comments_list), 200

    except Exception as e:
        return jsonify(str(e)), 400

def changePlaylistLastDateEdit(playlistID):
    date_time = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")
    pl.update_one({"playlistID": playlistID}, {"$set": {"last_edit": date_time}})
