/**
 Expected message format:

 {
  action: 'some_action_type',
  data: {
    foo: 'bar'
  }
 }

**/

var SocketTransport = (function() {

  var DEBUG = true;

  var host, ws;

  var manifest = {};

  var Socket = {
    on: function(action, callback) {
      DEBUG && console.log('Socket: bind ' + action);
      if (!manifest[action]) manifest[action] = [];
      if (manifest[action].indexOf(callback) > -1) return false;
      manifest[action].push(callback);
    },
    off: function(action, callback) {
      DEBUG && console.log('Socket: unbind ' + action);
      if (!manifest[action] || manifest[action].length === 0) return false;
      if (callback) {
        var pos = manifest[action].indexOf(callback);
        if (pos === -1) return false;
        mainfest[action].splice(pos, 1);
      } else {
        manifest[action] = [];
      }
    },
    trigger: function(action, data) {
      if (!manifest[action] || manifest[action].length === 0) return false;
      DEBUG && console.log('Socket: triggered ' + action, data);
      manifest[action].forEach(function(cb) {
        cb(data);
      });
    },
    send: function(action, data) {
      if (!ws) {
        console.warn('Socket: tried to send() on closed socket', action, data, ws);
        return false;
      }
      ws.send(JSON.stringify({
        action: action,
        data: data
      }));
    }
  };

  Socket.open = function(config) {
    if (!config) config = {};

    if (config.url) {
      host = config.url
    } else {
      host = location.protocol.replace('http', 'ws') + '//' + (config.host || location.hostname) + ':' + (config.port || location.port);
    }
    DEBUG && console.log('Socket: host is', host);

    ws = new WebSocket(host);

    ws.onopen = function() {
      DEBUG && console.log('Socket: opened');
      Socket._ws = ws;
      if (config.onopen) config.onopen();
    };

    ws.onmessage = function (event) {
      DEBUG && console.log('Socket: message');
      var payload = JSON.parse(event.data);

      if (!payload.action) return false;

      Socket.trigger(payload.action, payload.data);
    };

  };

  return Socket;

})();
