var settings = require('./settings');
var spotifyUri = require('spotify-uri');
var request = require('request');

var spotifyHelper = {
    _spotifyClientId : settings.spotifyClientId,
    _spotifyClientSecret : settings.spotifyClientSecret,
    _tokenLife : '',
    _refreshToken : '',
    _currentToken : '',
    _tokenExpiryTime : ''
};

spotifyHelper.handleSpotifyUrl = function(url){
    var urlObj = spotifyUri.parse(url);
    handleUrlObj(urlObj);
};

spotifyHelper.initializeWithTokens = function(tokens){
    this._refreshToken = tokens.refresh_token;
    this._currentToken = tokens.access_token;
    this._tokenExpiryTime = this._getExpiryTimeForToken(tokens.expires_in);
}

// never tested this function to see if it works, but it should (and probably doesnt anyway) :)
spotifyHelper._updateTokenIfNecessary = function() {
    if((new Date).getTime() > this._tokenExpiryTime){
        requestNewTokens();
    }
}

spotifyHelper._getExpiryTimeForToken = function(tokenLife){
    return (new Date).getTime() + tokenLife;
}

spotifyHelper._requestNewTokens = function(){
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(this._spotifyClientId + ':' + this._spotifyClientSecret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            setTokenData(body);
        }
    });
}

spotifyHelper._startTrackAddCallback = function(statusCodeSuccess, trackId){
    if (!trackAddCallback){
        throw 'You must use "setTrackAddCallback()" to set a callback function to handle the result of adding a track.';
    }

    var options = {
        url: 'https://api.spotify.com/v1/tracks/' + trackId,
        headers: { 'Authorization': 'Bearer ' + currentToken },
        json: true
    };

    // make a get request to get the song name of the track that was just added
    request.get(options, function(error, response, body) {
        try {
            var songTitle = statusCodeSuccess ? body.name : '';
        } catch (e){
            console.log(JSON.stringify(response) + '\n\n\n' + body);
        }

        // finally give control back to calling function
        trackAddCallback(statusCodeSuccess, songTitle);
    });
}

module.exports = spotifyHelper;