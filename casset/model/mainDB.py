from pymongo import MongoClient
from connectDB import CONNECTION_STRING

from song import *
from playlist import *

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
            showPlaylistSongs(search)
        elif option == "2":
            newPlaylistPL()
        elif option == "3":
            removePlaylistPL(pl)
        elif option == "4":
            editPlaylistNotePL(pl)
        elif option == "5":
            addSongSG(pl)
        elif option == "6":
            deleteSongSG(pl)
        elif option == "7":
            editSongNoteSG(pl)
        elif option == "9":
            loop = False
        else:
            print("### Error Inproper Input ###")
    
    print("***Closing Test****")

    client.close()