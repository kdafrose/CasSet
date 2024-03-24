from flask import request, jsonify, Blueprint
from pymongo import MongoClient
from connectDB import CONNECTION_STRING

comments_bp = Blueprint('comments_bp', __name__)

client = MongoClient(CONNECTION_STRING)
db = client.comments
coll = db.commentsID


@comments_bp.route('/addComment', methods = ['POST'])
def addComment():
    try:
        data = request.json
        commentID = data['_id']
        playlistID = data['playlist_id']
        songID = data['song_id']
        comment = data['comment']

        coll.insert_one({
            "_id" : commentID,
            "playlistID" : playlistID,
            "songID": songID,
            "comment":comment
        })

        return jsonify({"success":True, "result":comment}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 400
    
@comments_bp.route('/addReply', methods = ['POST'])
def addReply():
    pass

@comments_bp.route('/deleteComment', methods = ['DELETE'])
def deleteComment():
    try:
        data = request.json
        commentID = data['commentID']

        coll.delete_one({"_id":commentID})
        return jsonify({"success": True, "status": "Comment has been deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@comments_bp.route('/deleteReply', methods = ['DELETE'])
def deleteReply():
    pass
