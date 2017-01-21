'use strict';

var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);

app.use(express.static('/src'));
app.use('/shared', express.static('/shared'));
server.listen(5005, function() {
    console.log('Server up and running!');
});
