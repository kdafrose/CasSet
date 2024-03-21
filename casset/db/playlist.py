from pymongo import MongoClient
from connectDB import CONNECTION_STRING
import datetime

def newPlaylist(userPlaylists):
    print("*Making playlist*")
    plName = input("Name Playlist: ")
    plLength = input("How many songs are you putting into the playlist?: ")
    date_time = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")

    userPlaylists.insert_one({"name": plName, 
                   "length": plLength, 
                   "Created": date_time,
                   "note": "",
                   "songs": []
                    })

def deletePlaylist(userPlaylists):
    print("*Deleting playlist*")

    listPlaylist(userPlaylists)

    deleteName = input("Enter the name of the Playlist you want to delete: ")
    userPlaylists.delete_one({"name": deleteName})
    print("Deleting playlist " + deleteName)

def listPlaylist(userPlaylists):
    cursor = userPlaylists.find({})
    print("= = = = = = = = = =")
    for document in cursor:
        print("Playlist: ", document["name"])
    print("= = = = = = = = = =")

def editPlaylistNote(userPlaylists):
    print("*Edit playlist note*")
    searchPlaylist = input("What playlist do you want to edit?: ")
    newNote = input("Enter a new note for playlist: ")
    userPlaylists.update_one({"name": searchPlaylist},{"$set": { "note": newNote} })

def addSong(userPlaylists):
    print("*Adding song*")
    listPlaylist(userPlaylists)
    searchPlaylist = input("What playlist do you want to add a song too?: ")
    newSong = input("Enter song name: ")

    update = userPlaylists.find({"name": searchPlaylist})
    newList = {}
    for document in update:
        print("Songs: ", document["songs"])
        newList = document["songs"]
    newList.update({"song": newSong})
    print(newList)

    userPlaylists.update_one(
        {"name": searchPlaylist},
        {"$push": {"songs": newList}}
    )



if __name__ == '__main__':
    client = MongoClient(CONNECTION_STRING)

    db = client.usersInfo
    coll = db.users
    pl = db.playlists

    loop = True
    while loop == True:
        option = input('\nWhat select an option:\n1. List Playlists\n2. Make new playlist\n3. Delete playlist\n4. Edit note\n5. Add Song\n9. Exit\nInput: ')
        if option == "1":
            listPlaylist(pl)
        elif option == "2":
            newPlaylist(pl)
        elif option == "3":
            deletePlaylist(pl)
        elif option == "4":
            editPlaylistNote(pl)
        elif option == "5":
            addSong(pl)
        elif option == "9":
            loop = False
        else:
            print("### Error Inproper Input ###")
    
    print("***Closing Test****")

    client.close()