from flask import request, jsonify, Blueprint
from pymongo import MongoClient
from connectDB import CONNECTION_STRING
import datetime

playlist_bp = Blueprint('playlist_bp', __name__)

client = MongoClient(CONNECTION_STRING)
pl = client.playlists.playlistInfo
us = client.usersInfo.users

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
        playlistID = data['_id']
        playlistDoc = pl.find_one({"_id":playlistID})

        if not playlistDoc:
            return jsonify({"success": False, "status": "Playlist does not exist in database."}), 409
        return jsonify(playlistDoc), 200
    except Exception as e:
        return jsonify(str(e)), 400
    
def getUserPlaylistsPL(name):
    result = pl.find({"owner": name['owner']})


### HELPER FUNCTIONS ###
def checkPlaylistInDB(playlistID):
    if(pl.find_one({"_id":playlistID})):
        return True
    return False

def findUserID(user_name):
    info = us.find_one({"name":user_name})
    return info["_id"]

def showPlaylists():
    cursor = pl.find({})

    print("= = = = = = = = = =")
    for document in cursor:
        print("Playlist: ", document["name"])
    print("= = = = = = = = = =")

def showPlaylistSongs(userPlaylists, playlist):
    cursor = userPlaylists.find_one({"name": playlist})
    if playlist == "0":
        return
    
    print("* * * * * * * * * * *")
    for song in cursor["songs"]:
        print(song["songName"])
    print("* * * * * * * * * * *")

def changeEditDate(id):
    date_time = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")
    pl.update_one({"_id": id},{"$set": { "last_edited": date_time} })
