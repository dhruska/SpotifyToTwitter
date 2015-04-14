var nodeSpotifyWebHelper = require('node-spotify-webhelper');
var Twit = require('twit');
var env = require('node-env-file');

env(__dirname + '/.env');

// Enter application and user credentials here
console.log(process.env);
var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY || '',
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET || '',
  access_token: process.env.TWITTER_ACCESS_TOKEN || '',
  access_token_secret: process.env.TWITTER_ACCESS_SECRET || ''
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