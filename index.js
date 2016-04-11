var config = require('./config');

var node_rtorrent = require('node-rtorrent');
var whatcd = require("whatcd");

var bodyparser = require('body-parser')
var express = require('express');

var app = express();
var router = express.Router();
var port = 3333;
app.use(bodyparser.json());

//set up whatcd client and log in
var client = new whatcd(config.whatcd.url, config.whatcd.login, config.whatcd.pass);
var authkey, passkey;
function login() {
	client.index(function(err, data) {
		if (err) {
			return console.log(err);
		}
	 	authkey = data.authkey;
		passkey = data.passkey;
		console.log(data);
	});
};
login();

//set up rtorrent connection
var rt = new node_rtorrent({
	mode: 'xmlrpc',
	host: config.rtorrent.host,
	port: config.rtorrent.port,
});

//utility functions to handle API calls
function download_torrentfile(torrentid) {
	var torrentSize, torrentFormat, torrentFilepath;
	client.api_request({action: "torrent", id: torrentid}, function(err, data) {
		if(err) {
			return console.log(err);
		}
		torrentSize = data.torrent.size;
		torrentFormat = data.torrent.format;
		torrentFilepath = data.torrent.filePath;
		console.log(data);
	});
	var url = 'https://what.cd/torrents.php?action=download&id=' + torrentid + '&authkey=' + authkey + '&torrent_pass=' +  passkey;
	console.log(url);
	//rt.loadLink(url, function (err, data) {
	//	if (err) return console.log('err: ', err);
	//	console.log(JSON.stringify(data, null, 4));
	//});
};

function search_by_artist(artistname) {
	client.api_request({action: "artist", artistname: artistname}, function(err, data) {
		if(err) {
			return console.log(err);
		}
		console.log(data);
		return data;
	});
};

function get_progress(torrentid) {
	//progress is a percentage with accuracy to 0.1%
	var progress = "0.0";
	
	//TODO

	return progress;

// POST API handler
//testing: use curl -i -H "Content-Type: application/json" chorizo.link:3333 -d '{"action":"artistsearch","artistname":"Velatix"}'
app.post('/', function(request, response) { 
	console.log(request.body);
	
	if(request.body.action === "artistsearch") {
		response.send("POST received; artist search\n");
		search_resonse = search_by_artist(request.body.artistname);
		if(search_response instanceof Error) {
			console.log("Search returned an error ;(");
		} else {
			console.log(search_response);
		}
	} else if(request.body.action === "addtorrentbyid") {
		response.send("POST received; add torrent by id\n");
		download_torrentfile(request.body.torrentid);
	} else if(request.body.action === "getprogress") {
		var progress = get_progress(request.body.action(torrentid);
		response.send(progress);
	} else {
		response.send("invalid request!");
		console.log("invalid request");
	}
});

app.listen(port);
