import editSongNote from '../controller/fetchEditNote.js';
import fetchGetMultiSongs from '../controller/fetchMultiSongs.js';
import fetchPostMultiSongs from '../controller/fetchPostMultiSongs.js';
import fetchPostPlaylists from '../controller/fetchPostPlaylist.js';
import fetchCasset from '../controller/fetchSinglePlaylist.js';
import fetchPlaylists from '../controller/fetchUserPlaylists.js';
global.fetch = require('jest-fetch-mock');


//fetchEditNote function tests
describe('fetchEditNote function', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('successfully edits a song note', async () => {
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

  test('fetches songs successfully from a playlist', async () => {
    // Mock the fetch response with an example songs list
    const mockSongs = [
      { id: 1, title: 'Song 1', artist: 'Artist 1' },
      { id: 2, title: 'Song 2', artist: 'Artist 2' },
    ];
    fetch.mockResponseOnce(JSON.stringify(mockSongs));

    const playlistID = 123; // Example playlistID
    const songs = await fetchGetMultiSongs(playlistID);

    // Check if fetch was called correctly
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/songs/getMultiSongs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "playlistID": playlistID }),
    });

    // Verify the function returns the correct data
    expect(songs).toEqual(mockSongs);
  });

  test('handles fetch failure gracefully', async () => {
    // Simulate a network error
    fetch.mockReject(new Error('Network response was not ok'));

    const playlistID = 123; // Example playlistID
    const songs = await fetchGetMultiSongs(playlistID);

    // Since the function catches errors but doesn't rethrow or return specific values,
    // check fetch was called and adjust the test based on your error handling
    expect(fetch).toHaveBeenCalled();
    // Adjust the following assertion based on your error handling
    expect(songs).toBeUndefined();
  });
});


//fetchCasset function tests
describe('fetchCasset function', () => {
  beforeEach(() => {
    fetch.resetMocks();
    console.log = jest.fn(); // Mock console.log for capturing logs
  });

  test('fetches playlist document successfully', async () => {
    // Mock the fetch response with an example playlist document
    const mockPlaylist = {
      _id: '123',
      name: 'Test Playlist',
      songs: [{ title: 'Song 1', artist: 'Artist 1' }],
    };
    fetch.mockResponseOnce(JSON.stringify(mockPlaylist));

    const playlistID = '123'; // Example playlistID
    const playlist = await fetchCasset(playlistID);

    // Assertions to verify fetch was called correctly
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/playlist/fetchPlaylistDocument', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "_id": playlistID }),
    });

    // Verify the function returns the correct data
    expect(playlist).toEqual(mockPlaylist);
  });

  test('handles network failure gracefully', async () => {
    // Simulate a network error
    fetch.mockReject(new Error('Network response was not ok'));

    const playlistID = '123'; // Example playlistID
    await fetchCasset(playlistID);

    // Since the function logs the error, we check if console.log was called with an error
    expect(console.log).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(1); // Verify fetch was called, indicating an attempt was made to fetch the playlist
  });
});

