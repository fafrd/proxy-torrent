# proxy-torrent
_proxy-torrent_ is a project to provide access to the content of a private tracker without having to give direct access.

### how
I'm building a nodejs backend that will process an api request and start a torrent. Once complete, the contents of the torrent will be zipped up and available as a download link. From there I'll build a simple web frontend for end-users.

### why
Ostensibly to gain familiarity with nodejs and API implementation, but really so that everyone stops asking for my login and password to torrent sites.

### todo
- backend:
    * retreive torrent metadata from torrentid
    * create database of downloaded torrents storing metadata, file location, filesize
    * set up login mechanism with daily bandwidth allotment
- api:
    * torrent search
    * torrent progress
    * zipping progress
	* api documentation
- frontend:
    * everything

### disclaimer
I am not advocating copyright infringement. This is for personal usage only. If you're an admin of one of these torrent sites, please don't ban me.
