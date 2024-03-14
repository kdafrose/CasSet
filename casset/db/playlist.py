from flask import Flask, request, jsonify
from pymongo import MongoClient
from connectDB import CONNECTION_STRING
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app) 

client = MongoClient(CONNECTION_STRING)
db = client.playlists
coll = db.playlists ## Do we need this?
pl = db.playlistInfo

@app.route('/postNewPlaylist', methods = ['POST'])
def postNewPlaylist():
    # print("*Making playlist*")
    # plName = input("Name Playlist: ")
    # plLength = input("How many songs are you putting into the playlist?: ")

    date_time = datetime.datetime.now() 

    try:
        # Change attributes based on request data json file

        data = request.json
        name = data['name'] # playlist name 
        date_created = data['created'] # date of when playlist created
        sharing_link = data['sharing_link'] # link to share cassette
        notes = data['playlist_annotation'] # playlist annotation for the entire cassette
        owner = data['user'] # user who owns cassette --> foreign key

        # Checks if playlist exists in db 
        exists = checkPlaylistInDB(name)

        if not exists:
            object_playlist = pl.insert_one({
                "playlist_name": name,
                "date_created": date_created,
                "sharing_link": sharing_link,
                "notes": notes,
                "owner": owner
            })

        return jsonify({"success": True, "result": str(object_playlist.inserted_id)}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 400

    # pl.insert_one({"name": plName, 
    #                "length": plLength, 
    #                "Created": date_time,
    #                "songs": {
    #                    "song": "songInfo",
    #                    "song2": "songInfo",
    #                    "song3": "songInfo"
    #                     }
    #                 })

def checkPlaylistInDB(name):
    if pl.find_one({"name": name}):
        return True
    return False
    
@app.route('/deletePlaylist', methods = ['DELETE'])
def deletePlaylist():
    # print("*Deleting playlist*")
    # listPlaylist()
    # playlistName = input("Enter the name of the Playlist you want to delete: ")

    try:
        data = request.json
        playlistName = data['playlist_name'] # playlist name

        pl.delete_one({"name": playlistName})
        return jsonify({"success":True, "staus":"Playlist has been successfully deleted."}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 400


    # print("Deleting playlist " + playlistName)

def listPlaylist():
    print(pl.find())

# if __name__ == '__main__':
#     client = MongoClient(CONNECTION_STRING)

#     db = client.usersInfo
#     coll = db.playlists
#     pl = coll.playlistInfo

#     loop = True
#     while loop == True:
#         option = input('\nWhat select an option:\n1. List Playlists\n2. Make new playlist\n3. Delete playlist\n9. Exit\nInput: ')
#         if option == "1":
#             listPlaylist()
#         elif option == "2":
#             postNewPlaylist()
#         elif option == "3":
#             deletePlaylist()
#         elif option == "9":
#             loop = False
#         else:
#             print("### Error Inproper Input ###")
    
#     print("***Closing Test****")

    # client.close()

if __name__ == '__main__':
    app.run(debug=True, port = 5000)