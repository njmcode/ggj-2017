'use strict';

var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var http = require('http');
var express = require('express');
var app = express();
var path = require('path');

var PORT = 5005;

/**
 HTTP server
**/
var HTML_FILES = {
  'monitor': '/static/monitor/html/index.html',
  'visorInit': '/static/visor/html/index.html',
  'visorPlay': '/static/visor/html/play.html',
}

app.use('/static', express.static('/static'));
app.get('/', function(req, res) {
  res.sendFile(HTML_FILES.monitor);
});
app.get('/visor', function(req, res) {
  res.sendFile(HTML_FILES.visorInit);
});
app.get('/play', function(req, res) {
  res.sendFile(HTML_FILES.visorPlay);
});

var server = http.createServer(app);
server.listen(PORT);

console.log('HTTP server listening on %d', PORT);
console.log('\nSIMULATION VIEW at http://localhost:%d', PORT);

/**
 Socket server
**/

var wss = new WebSocketServer({server: server});
console.log('\nSocket server listening on port %d', PORT);

function encode(payload) {
  return (typeof payload !== 'string') ? JSON.stringify(payload) : payload;
}

// Handle new client connection (visor / simulation)
wss.on('connection', function(ws) {

  function serverMsg(msg) {
    console.log('SERVER: ' + msg);
    broadcast({
      action: 'server:message',
      data: {
        message: msg
      }
    });
  }

  // Broadcast to all clients
  function broadcast(payload) {
    //console.log('BROADCAST', payload);
    wss.clients.forEach(function(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(encode(payload));
      }
    });
  }

  // Notify clients other than this one
  function relay(payload) {
    var m = JSON.stringify(payload);

    wss.clients.forEach(function(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(encode(payload));
      }
    });
  }

  // Respond to this client only
  function respond(payload) {
    ws.send(encode(payload));
  }

  // On incoming message, just bounce them back for now
  ws.on('message', function(msg) {
    relay(msg);
  });

  // On close, notify
  ws.on('close', function() {
    serverMsg('Client connection closed.');
  });

  ws.on('error', function(e) {
    serverMsg('ERROR in connection');
  })

  serverMsg('Client connected, connection open.');
  console.log('CLIENTS ', wss.clients.length);
});
