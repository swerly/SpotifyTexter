const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

var settings = require('./settings');
var twilio = require('twilio')(settings.twilioAccountSid, settings.twilioAutToken);
var bodyParser = require('body-parser');

var twilioBot = {
    twilio: twilio
};

twilioBot.setTextRecievedCallback = function (callback) {
    this.textRecievedCallback = callback;
}

twilioBot.runInitialization = function () {
    this.setupServer();
    console.log('twilio running (hang loose emoji)');
}

twilioBot.setupServer = function () {
    var app = express();
    app.use(bodyParser.urlencoded({ extended: false }));

    http.createServer(app).listen(1337, () => {
        console.log('Twilio listening on port 1337');
    });

    app.post('/sms', (req, res) => recievedTextMessage(req, res));
}

twilioBot.recievedTextMessage = function (req, res) {
    console.log('recieved text message');
    console.log(typeof textRecievedCallback);

    if (textRecievedCallback) textRecievedCallback(req.body.From, req.body.Body);
}

twilioBot.sendTextMessage = function() {

}

module.exports = twilioBot;