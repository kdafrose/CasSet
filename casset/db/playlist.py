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

def changeEditDate(userPlaylists, name):
    date_time = datetime.datetime.now().strftime("%B %d, %Y - %I:%M %p")
    userPlaylists.update_one({"name": name},{"$set": { "last_edited": date_time} })

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