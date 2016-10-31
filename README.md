###PrismSoundZero template for Delicious Library 3.

![Preview of template](https://github.com/prismsoundzero/delicious-library-template/blob/master/dist/prismsoundzero.libraryhtmltemplate/Contents/Resources/thumbnail.png)

####Features
- Search capabilities with typeahead suggestions
- Get album information from Spotify and LastFM API
- Play on Spotify

####Installation
1. Download the .zip file and unzip it.
2. Copy the folder dist/prismsoundzero.libraryhtmltemplate to
    ~/Library/Containers/com.delicious-monster.library3/Data/Library/Application Support/Delicious Library 3/Templates
3. In Delicious Library 3, create a new public site and choose the template (scroll right while hovering over the template previews with the mouse if you don´t see it)

4. Configure LastFM and Spotify [Optional]
    - To get LastFM info on an album page you need to get a [LastFM API key](http://www.last.fm/api/authentication)
    - To get Spotify info and to be able to play on Spotify your albums you need to [register a Spotify Application](https://developer.spotify.com/my-applications/#!/)
    - Put your LastFM key and the Client ID of your Spotify App at the begening of the javascript file [app.*.js](https://github.com/prismsoundzero/delicious-library-template/tree/master/dist/prismsoundzero.libraryhtmltemplate/Contents/Template/js)

```
var lastFmKeyApiKey="YOUR_LAST_FM_KEY",lastFmApiBase="https://ws.audioscrobbler.com/2.0/",spotifyClientId="YOUR_SPOTIFY_APP_CLIENT_ID";
```
