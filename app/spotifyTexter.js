const http = require('http');
const express = require('express');
var spotifyHelper = require('./spotifyHelper');
var twilioBot = require('./twilioBot');
var settings = require('./settings');
var client = require('twilio')(settings.twilioAccountSid, settings.twilioAutToken);

var spotifyTexter = {
    client : client,
    spotifyHelper : spotifyHelper,
    twilioBot : twilioBot
};

spotifyTexter.initializeWithSpotifyTokens = function( spotifyTokens ){
    this._runInitialization( spotifyTokens );
}

spotifyTexter._runInitialization = function( spotifyTokens ){
    this.spotifyHelper.initializeWithTokens( spotifyTokens );

    this.twilioBot.setTextRecievedCallback( handleSpotifyText );
    this.twilioBot.runInitialization();
}

function handleSpotifyText(fromNumber, smsBody){
    var artists = smsBody.split(',');
    var songCount = Number(splitSms.pop().trim());

    console.log(songCount +'\n\n'+ artists);
}

module.exports = spotifyTexter;