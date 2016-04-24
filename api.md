# proxy-torrent api

example usage via cURL:
	curl -i -H "Content-Type: application/json" chorizo.link:3333 -d '{"action":"artistsearch","artistname":"Velatix"}'

### addtorrentbyid
	POST {"action":"addtorrentbyid","torrentid":31948192}

returns "success" on success, returns "err: could not add torrent" on failure

### artistsearch
	POST {"action":"artistsearch","artistname":"Velatix"}

returns search results in json on success, returns "err: search failed" on failure

### getprogress
	POST {"action":"getprogress","torrenthash":"E0F3EC00DBFEA3F92FE8311EA4E41364E5BBCC93"}

returns a json object like
	{downspeed: '1574',
	upspeed: '0',
	progress: 0.059651620092591603 }
on success, returns "err: invalid hash" on failure. speeds are in kbps, progress is a value between 0 and 1.

### ziptorrent
	POST {"action":"ziptorrent","torrenthash":"E0F3EC00DBFEA3F92FE8311EA4E41364E5BBCC93"}

returns a url to the zipped torrent. if not already zips, it will zip the torrent and return the url.
returns "err: torrent not complete" if the torrent is not yet completed.
returns "err: invalid hash" if torrent hash not found.

