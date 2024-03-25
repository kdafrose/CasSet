from playlist import * 

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