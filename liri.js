var fs = require('fs');
var tweets = require('twitter');
var spotify = require('spotify');
var request = require('request');

var twitKeys = require('./keys.js');
var keyList = twitKeys.twitterKeys;

//Move the twitter and spotify folders to this folder!

var client = tweets(keyList);
var commandArg;
var doThis = process.argv[2];
var thenThis;
var titleWord = "";
for (i=3; i<process.argv.length; i++) {
	titleWord += process.argv[i] + "+";
}

if (doThis === "do-what-it-says") {
	console.log("Do what it says!");
	function getRandomText(fileName,callback) {
		fs.readFile(fileName, "utf8", function(err,data){
			callback(data);
		});
	}
	getRandomText("random.txt",function(data){
		var rows = data.split(';');
		var randomizer = Math.floor(Math.random() * rows.length);
		var randCommand = rows[randomizer].split(",");
		thenThis = randCommand[0];
		titleWord = randCommand[1];
		if (thenThis == "my-tweets") {
			console.log(thenThis);
			console.log("Your past 20 tweets:");
			var params = {screen_name: 'EdgarTlamatini'};
			client.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
				for (i=0; i<tweets.length; i++) {
					console.log(tweets[i].text + "\n----------------------");
					}
				}
			});
		} else if (thenThis == "spotify-this-song") {
			console.log(thenThis + " " + titleWord);
			console.log("Your Spotify songs:");
			spotify.search({ type: 'track', query: titleWord }, function(err, data) {
			if (err) {
				console.log('Error occurred: ' + err);
				return;
				}
			var songData = data.tracks.items;
				for (i=0; i<songData.length; i++) {
					console.log("Artist(s): " + songData[i].artists[0].name + "\nName: " + songData[i].name + "\nPreview link: " + songData[i].preview_url + "\nAlbum: " + songData[i].album.name + "\n----------------------");
				}
			});
		} else if (thenThis == "movie-this") {
			console.log(thenThis + " " + titleWord);
			console.log("Your movie result:");
			var omdbUrl = "http://www.omdbapi.com/?t=" + titleWord + "&tomatoes=true";
			request(omdbUrl, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var parsed = JSON.parse(body);
					console.log("Title: " + parsed.Title + "\nYear: " + parsed.Year + "\nIMDB Rating: " + parsed.imdbRating + "\nCountry: " + parsed.Country + "\nLanguage: " + parsed.Language + "\nPlot: " + parsed.Plot + "\nActors: " + parsed.Actors + "\nRotten Tomatoes Rating: " + parsed.tomatoRating + "\nRotten Tomatoes URL: " + parsed.tomatoURL + "\n----------------------");
				}
			});
		}
	});
} else {
	commandArg = process.argv[2];
	inputSwitch();
}

function inputSwitch(){
	console.log(commandArg);
	switch(commandArg){
		case "do-what-it-says":
		break;
		case "my-tweets":
			console.log("Your past 20 tweets:");
			var params = {screen_name: 'EdgarTlamatini'};
			client.get('statuses/user_timeline', params, function(error, tweets, response) {
				if (!error) {
					for (i=0; i<tweets.length; i++) {
						console.log(tweets[i].text + "\n----------------------");
						}
					}
				});
			break;
		case "spotify-this-song":
			console.log("Your Spotify songs:");
			if (titleWord === "") {
				titleWord = "the+sign+ace+of+base";
			}
			spotify.search({ type: 'track', query: titleWord }, function(err, data) {
				if (err) {
					console.log('Error occurred: ' + err);
					return;
					}
				var songData = data.tracks.items;
				for (i=0; i<songData.length; i++) {
					console.log("Artist(s): " + songData[i].artists[0].name + "\nName: " + songData[i].name + "\nPreview link: " + songData[i].preview_url + "\nAlbum: " + songData[i].album.name + "\n----------------------");
				}
			});
			break;
		case "movie-this":
			console.log("Your movie result:");
			if (titleWord === "") {
				titleWord = "mr+nobody";
			}
			var omdbUrl = "http://www.omdbapi.com/?t=" + titleWord + "&tomatoes=true";
			request(omdbUrl, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var parsed = JSON.parse(body);
					console.log("Title: " + parsed.Title + "\nYear: " + parsed.Year + "\nIMDB Rating: " + parsed.imdbRating + "\nCountry: " + parsed.Country + "\nLanguage: " + parsed.Language + "\nPlot: " + parsed.Plot + "\nActors: " + parsed.Actors + "\nRotten Tomatoes Rating: " + parsed.tomatoRating + "\nRotten Tomatoes URL: " + parsed.tomatoURL + "\n----------------------");
				}
			});
			break;
		default:
			console.log("We're sorry, we don't understand that command! Please try again.")
	}
}