var config = {};

config.whatcd = {};
config.whatcd.url = "https://what.cd";
config.whatcd.login = "";
config.whatcd.pass = "";

config.rtorrent = {};
config.rtorrent.host = "localhost";
//25000 is the port nginx expects. nginx passes this to rtorrent's port
config.rtorrent.port = 25000;

module.exports = config;
