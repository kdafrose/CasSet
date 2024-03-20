from flask import request, jsonify, Blueprint
from pymongo import MongoClient
from connectDB import CONNECTION_STRING

comments_bp = Blueprint('comments_bp', __name__)

client = MongoClient(CONNECTION_STRING)
db = client.comments
coll = db.commentsID

@comments_bp.route('/addComment', methods = ['POST'])
def addComment():
    pass

@comments_bp.route('/deleteComment', methods = ['DELETE'])
def deleteComment():
    pass
