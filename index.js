var config = require('./config');

var node_rtorrent = require('node-rtorrent');
var whatcd = require("whatcd");

//set up whatcd client
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

//set up rtorrent connection
var rt = new node_rtorrent({
	mode: 'xmlrpc',
	host: config.rtorrent.host,
	port: config.rtorrent.port,
});

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

var cucumber = 32741218;
//login();
//download_torrentfile(cucumber);
//setTimeout(download_torrentfile, 5000, cucumber);

//var app = require('express')();
//var http = require('http').Server(app);


























