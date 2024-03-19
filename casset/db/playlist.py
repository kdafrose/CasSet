from pymongo import MongoClient
from connectDB import CONNECTION_STRING
import datetime

def newPlaylist():
    print("*Making playlist*")
    plName = input("Name Playlist: ")
    plLength = input("How many songs are you putting into the playlist?: ")
    date_time = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")

    pl.insert_one({"name": plName, 
                   "length": plLength, 
                   "Created": date_time,
                   "songs": {
                       "song": "songInfo",
                       "song2": "songInfo",
                       "song3": "songInfo"
                        },
                    "note": ""
                    })

def deletePlaylist():
    print("*Deleting playlist*")

    listPlaylist()

    deleteName = input("Enter the name of the Playlist you want to delete: ")

    pl.delete_one({"name": deleteName})

    print("Deleting playlist " + deleteName)

def listPlaylist():
    pllist = pl.find()
    print(pllist)

def editPlaylistNote():
    print("*Edit playlist note*")

if __name__ == '__main__':
    client = MongoClient(CONNECTION_STRING)

    db = client.usersInfo
    coll = db.users
    pl = db.playlists

    loop = True
    while loop == True:
        option = input('\nWhat select an option:\n1. List Playlists\n2. Make new playlist\n3. Delete playlist\n4. Edit note\n9. Exit\nInput: ')
        if option == "1":
            listPlaylist()
        elif option == "2":
            newPlaylist()
        elif option == "3":
            deletePlaylist()
        elif option == "4":
            editPlaylistNote()
        elif option == "9":
            loop = False
        else:
            print("### Error Inproper Input ###")
    
    print("***Closing Test****")

    client.close()