from playlist import * 

client = MongoClient(CONNECTION_STRING)
sg = client.song.songInfo

# add a song to the playlist inputted
def addSongSG(playlistID, songID):

    sg.update_one(
        {"_id": playlistID}, 
        {"$push": {"songs": 
            {
                "songID": "ID",
                "songName": songID, 
                "songNote": "asdf"
            }}}
    )

    changeEditDate(playlistID)

# deletes Song from Playlist inputted
def deleteSongSG(playlistID, songID):

    result = sg.update_one(
        {"_id": playlistID}, 
        {"$pull": {"songs":{"songName": songID}}}
    )
    changeEditDate(playlistID)

    return result

# Edits note in a Song
def editSongNoteSG(playlistID, songID, newNote):

    result = sg.update_one(
        {"_id": playlistID, f"songs.songID": songID},
        {"$set": {f"songs.$.songNote": newNote}}
    )
    changeEditDate(playlistID)

    return result