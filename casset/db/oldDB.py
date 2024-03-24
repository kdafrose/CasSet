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
                   "last_edited": date_time,
                   "note": "",
                   "songs": [
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
                    ]})

def deletePlaylist(userPlaylists):
    print("*Deleting playlist*")

    showPlaylists(userPlaylists)

    deleteName = input("Enter the name of the Playlist you want to delete: ")
    userPlaylists.delete_one({"name": deleteName})
    print("Deleting playlist " + deleteName)

def showPlaylists(userPlaylists):
    cursor = userPlaylists.find({})
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

def editPlaylistNote(userPlaylists):
    showPlaylists(userPlaylists)
    searchPlaylist = input("What playlist do you want to edit?: ")
    newNote = input("Enter a new note for playlist: ")
    userPlaylists.update_one({"name": searchPlaylist},{"$set": { "note": newNote} })

    changeEditDate(userPlaylists, searchPlaylist)

def addSong(userPlaylists):
    print("*Adding song*")
    showPlaylists(userPlaylists)

    searchPlaylist = input("What playlist do you want to add a song too?: ")
    newSong = input("Enter song name: ")

    userPlaylists.update_one(
        {"name": searchPlaylist}, 
        {"$push": {"songs": 
                   {
                       "songID": "ID",
                       "songName": newSong, 
                       "songNote": "asdf"
                    }}}
    )

    changeEditDate(userPlaylists, searchPlaylist)

def removeSong(userPlaylists):
    showPlaylists(userPlaylists)

    searchPlaylist = input("What playlist do you want to remove a song from?: ")
    showPlaylistSongs(userPlaylists, searchPlaylist)

    remove = input("Enter the name of the song you want to remove: ")

    userPlaylists.update_one(
        {"name": searchPlaylist}, 
        {"$pull": {"songs":{"songName": remove}}}
    )

    changeEditDate(userPlaylists, searchPlaylist)

def editSongNote(userPlaylists):
    showPlaylists(userPlaylists)

    search = input("What playlist do you want to remove a song from?: ")
    showPlaylistSongs(userPlaylists, search)

    editSong = input("Which song do you want to edit?: ")
    newNote = input("What do you want to write in the note?: ")

    userPlaylists.update_one(
        {"name": search, f"songs.songName": editSong},
        {"$set": {f"songs.$.songNote": newNote}}
    )

    changeEditDate(userPlaylists, search)

def changeEditDate(userPlaylists, name):
    date_time = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")
    userPlaylists.update_one({"name": name},{"$set": { "last_edited": date_time} })

if __name__ == '__main__':
    client = MongoClient(CONNECTION_STRING)

    db = client.usersInfo
    coll = db.users
    pl = db.playlists

    loop = True
    while loop == True:
        option = input('\nWhat select an option:\n1. List Playlists\n2. Make new playlist\n3. Delete playlist\n4. Edit note\n5. Add Song\n6. Remove Song\n7. Edit Song Note\n\n9. Exit\nInput: ')
        if option == "1":
            showPlaylists(pl)
            search = input("Which playlist do you want to look at? ")
            showPlaylistSongs(pl, search)
        elif option == "2":
            newPlaylist(pl)
        elif option == "3":
            deletePlaylist(pl)
        elif option == "4":
            editPlaylistNote(pl)
        elif option == "5":
            addSong(pl)
        elif option == "6":
            removeSong(pl)
        elif option == "7":
            editSongNote(pl)
        elif option == "9":
            loop = False
        else:
            print("### Error Inproper Input ###")
    
    print("***Closing Test****")

    client.close()