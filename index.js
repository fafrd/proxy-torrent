var config = require('./config');

var node_rtorrent = require('node-rtorrent');
var whatcd = require("whatcd");

var bodyparser = require('body-parser')
var express = require('express');
var admzip = require('adm-zip');

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
function addtorrentbyid(torrentid) {
	console.log("addtorrentbyid; torrentid:" + torrentid);
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
	rt.loadLink(url, function (err, data) {
		if (err) return console.log('err: ', err);
		console.log(JSON.stringify(data, null, 4));
	});
};

function searchbyartist(artistname) {
	console.log("searchbyartist; artistname: " + artistname);
	client.api_request({action: "artist", artistname: artistname}, function(err, data) {
		if(err) return console.log(err);
		console.log(data);
		return data;
	});
};

function getprogress(torrenthash, response) {
	console.log("getprogress; torrenthash: " + torrenthash);
	var returnobj = {"downspeed": "", "upspeed": "", "progress": ""}, found = false;
	var err, data;
	rt.getAll(function(rt_err, rt_data) {
		err = rt_err;
		data = rt_data;
		console.log("data:");
	//	console.log(data);

		if(data == null) {
			console.log("rtorrent is not running, or contained no such torrent");
			return "err: rtorrent not running";
		}
		for(i in data.torrents) {
			if(torrenthash.toUpperCase() == data.torrents[i].hash) {
				found = true;
				returnobj.downspeed = data.torrents[i].down_rate;
				returnobj.upspeed = data.torrents[i].up_rate;
				returnobj.progress = (data.torrents[i].completed / data.torrents[i].size);
			}
		}
		if(found == false) {
			console.log("getprogress; hash not found");
			return "err: invalid hash";
		}
		else {
			console.log(returnobj);
			response.send(returnobj);
		}
	});
};

function ziptorrent(torrenthash) {
	console.log("ziptorrent; torrenthash: " + torrenthash);
	var err, data;
	rt.getAll(function(rt_err, rt_data) {
		err = rt_err;
		data = rt_data;
	});
	if(err) return console.log(err);
	for(i in data.torrents) {
		if(torrenthash == data.torrents[i].hash) {
			if(data.torrents[i].completed != data.torrents[i].size)
				return "err: torrent not complete";
			//check if file exists
			fs.stat('zips/' + torrenthash + '.zip', function(err, stat) {
				if(err == null) 
					return 'zips/' + torrenthash + '.zip';
				//zipitup
				var savelocation = 'zips/' + torrenthash + '.zip';
				var zip = new admzip();
				zip.addLocalFolder(data.torrents[i].path);
				zip.writeZip('zips/' + torrenthash + '.zip');
				return 'zips/' + torrenthash + '.zip';
			});
		}
	}
	return "err: invalid hash";
};

// POST API handler
//testing: use curl -i -H "Content-Type: application/json" chorizo.link:3333 -d '{"action":"artistsearch","artistname":"Velatix"}'
app.post('/', function(request, response) { 
	console.log(request.body);
	
	if(request.body.action === "artistsearch") {
		response.send("POST received; artist search\n");
		searchresonse = searchbyartist(request.body.artistname);
		if(searchresponse instanceof Error) {
			console.log("Search returned an error ;(");
		} else {
			console.log(searchresponse);
		}
	} else if(request.body.action === "addtorrentbyid") {
		response.send("POST received; add torrent by id\n");
		addtorrentbyid(request.body.torrentid);
	} else if(request.body.action === "getprogress") {
		//response sending here is deferred. it is performed asynchronously inside getprogress
		getprogress(request.body.torrenthash, response);
	} else if(request.body.action === "ziptorrent") {
		response.send(ziptorrent(request.body.torrenthash));
	} else {
		response.send("invalid request!");
		console.log("invalid request");
	}
});

app.listen(port);
