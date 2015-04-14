var nodeSpotifyWebHelper = require('node-spotify-webhelper');
var Twit = require('twit');

// Enter application and user credentials here
var T = new Twit({
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret : ''
});

var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();

var lastSong;
var getSong = function(err, res) {
    if (err) {
    return console.error(err);
  }

  // Compares to last song checked, and checks if track time is >= 30 seconds
  var currSong = res.track.artist_resource.name.concat(' - ', res.track.track_resource.name);
  if ((lastSong != currSong) && (res.playing_position >= 30)) {
    lastSong = currSong;

    // Post to Twitter
    T.post('statuses/update', { status: 'Test node.js application - Current Listening: '.concat(currSong) }, function(err, data, response) {
      console.log(data);
    });
  }
}

function checkSong() {
  spotify.getStatus(getSong);
}

// Check every 5 seconds
setInterval(checkSong, 5000);