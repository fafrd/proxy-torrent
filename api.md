# proxy-torrent api

example usage via cURL: curl -i -H "Content-Type: application/json" chorizo.link:3333 -d '{"action":"artistsearch","artistname":"Velatix"}'

### addtorrentbyid
	POST {"action":"addtorrentbyid","torrentid":31948192}

returns torrent hash like 'E0F3EC00DBFEA3F92FE8311EA4E41364E5BBCC93' on success, returns "err: could not add torrent" on failure

### artistsearch
	POST {"action":"artistsearch","artistname":"Velatix"}

returns search results in json on success, returns "err: search failed" on failure

### getprogress
	POST {"action":"getprogress","torrenthash":"E0F3EC00DBFEA3F92FE8311EA4E41364E5BBCC93"}

given a specific torrent hash, returns a json object containing download speed, upload speed, percentage completed
returns "err: torrent not found" on failure
