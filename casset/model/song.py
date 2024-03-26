from playlist import * 

client = MongoClient(CONNECTION_STRING)
sg = client.song.songInfo

def getSongSG(songID, playlistID):
    result = sg.find_one({"songID":songID, "playlistID": playlistID})
    return result

def getPlaylistSongsSG(playlistID):
    result = sg.find({"playlistID": playlistID})
    return result

# add a song to the playlist inputted
def addSongSG(data):

    song_document = sg.insert_one({
        "songID": data['songID'],
        "playlistID": data['playlistID'],
        "name": data['name'],
        "song_image":data['song_image'],
        "artist": data['artist'],
        "annotation":data['annotation'],
    })

    changeEditDate(data['playlistID'])

    return song_document

def addMultiSongsSG(songs):
    sg.insert_many(songs)

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