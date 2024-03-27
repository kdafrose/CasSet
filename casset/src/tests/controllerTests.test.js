import editSongNote from '../controller/fetchEditNote.js';
import fetchGetMultiSongs from '../controller/fetchMultiSongs.js';
import fetchCasset from '../controller/fetchSinglePlaylist.js';
global.fetch = require('jest-fetch-mock');


//fetchEditNote function tests
describe('fetchEditNote function', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('successfully edits song note', async () => {
    //Test ID 105
    fetch.mockResponseOnce(JSON.stringify({ result: 'Note updated successfully' }));

    const songID = 1;
    const playlistID = 1;
    const new_note = 'This is the new note.';
    const response = await editSongNote(songID, playlistID, new_note);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/songs/editNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "songID": songID, "playlistID": playlistID, "new_note": new_note }),
    });

    expect(response).toBe('Note updated successfully');
  });

  test('handles network failure', async () => {
    //Test ID 205
    fetch.mockReject(new Error('Network response was not ok'));

    const response = await editSongNote(1, 1, 'This is a test note.');

    expect(fetch).toHaveBeenCalled();
    expect(response).toBeUndefined();
  });
});


//fetchMultiSongs function tests
describe('fetchMultiSongs function', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('fetches songs from a playlist', async () => {
    // Test ID 103
    const mockSongs = [
      { id: 1, title: 'Song 1', artist: 'Artist 1' },
      { id: 2, title: 'Song 2', artist: 'Artist 2' },
    ];
    fetch.mockResponseOnce(JSON.stringify(mockSongs));

    const playlistID = 123; 
    const songs = await fetchGetMultiSongs(playlistID);

    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/songs/getMultiSongs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "playlistID": playlistID }),
    });

    expect(songs).toEqual(mockSongs);
  });

  test('handles fetch failure', async () => {
    //Test ID 303
    fetch.mockReject(new Error('Network response was not ok'));

    const playlistID = 123; 
    const songs = await fetchGetMultiSongs(playlistID);

    expect(fetch).toHaveBeenCalled();
    expect(songs).toBeUndefined();
  });
});


//fetchCasset function tests
describe('fetchCasset function', () => {
  beforeEach(() => {
    fetch.resetMocks();
    console.log = jest.fn(); 
  });

  test('fetches playlist document', async () => {
    //Test ID 112
    const mockPlaylist = {
      _id: '123',
      name: 'Test Playlist',
      songs: [{ title: 'Song 1', artist: 'Artist 1' }],
    };
    fetch.mockResponseOnce(JSON.stringify(mockPlaylist));

    const playlistID = '123'; 
    const playlist = await fetchCasset(playlistID);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/playlist/fetchPlaylistDocument', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "_id": playlistID }),
    });

    expect(playlist).toEqual(mockPlaylist);
  });

  test('handles network failure', async () => {
    //Test ID 212
    fetch.mockReject(new Error('Network response was not ok'));

    const playlistID = '123'; 
    await fetchCasset(playlistID);
    expect(console.log).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(1); 
  });
});

