
require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

function chooseAppToRun() {


  var app = process.argv[2].trim();
  if (process.argv[3]) {
    var param = process.argv[3].trim();
  }


  switch (app) {
    case "my-tweets":
      getTweets();
      break;
    case "spotify-this-song":
      spotifySong(param);
      break;
    case "movie-this":
      getMovie(param);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("Usage is my-tweets, spotify-this-song, movie-this, or do-what-it-says");
  }
}

function getTweets() {


  client.get("statuses/user_timeline", { screen_name: "seattle_gus" }, function (error, tweets, response) {

    if (error) {
      throw error;
    }

    for (var i = 0; i < 20; i++) {
      console.log("Tweet " + (i + 1) + ": " + tweets[i].text);
      console.log("Timestamp: " + tweets[i].created_at);
    };
  });
};


function spotifySong(param) {


  var songQuery = param;

  if (!songQuery) {
    songQuery = "Top Off";
  }


  spotify.search({ type: "track", query: songQuery },

    function (err, data) {
      if (err) {
        return console.log("Error occurred: " + err + ". You might try searching for another song title.");
      }

      var songName = data.tracks.items[0].name;
      var artist = data.tracks.items[0].artists[0].name;
      var album = data.tracks.items[0].album.name;
      var previewURL = data.tracks.items[0].preview_url;


      if (artist) {
        console.log("Artist: " + artist);
      }
      if (songName) {
        console.log("Song: " + songName);
      }
      if (album) {
        console.log("Album: " + album);
      }
      if (previewURL) {
        console.log("Preview on Spotify: " + previewURL);
      }
    });
}

function getMovie(param) {
  var title = param;

  if (!title) {
    title = "Coming to America";
  }


  request("http://www.omdbapi.com/?t=" + title + "&apikey=trilogy", function (error, response, body) {

    if (!error && response.statusCode === 200) {

      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year of release: " + JSON.parse(body).Year);
      console.log("IMDb rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country of origin: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);

    }
  });
}


function doWhatItSays() {

  var textFile = "random.txt";


  fs.readFile(textFile, "utf8", function (error, data) {

    if (error) {
      return console.log(error);
    }


    var dataArr = data.split(",");


    var app = dataArr[0];
    if (dataArr[1]) {
      var param = dataArr[1];
    }


    switch (app) {
      case "my-tweets":
        getTweets();
        break;
      case "spotify-this-song":
        spotifySong(param);
        break;
      case "movie-this":
        getMovie(param);
        break;
      default:
        console.log("Make sure the file contains the proper usage for my-tweets, spotify-this-song, or movie-this.");
    }
  });
}


chooseAppToRun();