var express = require('express');
rootDir = __dirname,
config = require('./config');
var cookiesession = require('cookie-session');
var bodyparser = require('body-parser');
var http = require('http');
var ent = require('ent');
var fs = require('fs');

var todo = express();
var settings = {
	config: config
};

var urlencodedParser = bodyparser.urlencoded({ extended: true }); 

//todo.set('port', config.PORT || process.env.port || 3000)
//.use(express.static(__dirname + '/public'))
//.use(urlencodedParser);

var io = require('socket.io')
  .listen(http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
})
.listen(config.PORT || process.env.port || 3000, function(){
      console.log('Express server listening on port ' + config.PORT);
}));

io.sockets.on('connection', function(socket, username) {
  console.log('A client is connected');
  socket.broadcast.emit('message', 'Another client has connected');
  socket.on('newClient', function(username) {
    username = ent.encode(username);
    socket.username = usename;
    socket.broadcast.emit('newClient', username);
  });
  socket.on('message', function(message) {
    console.log(socket.username + ' is speaking to me! They’re saying: ' + message);
    message = ent.encode(message);
    //console.log(message);
    socket.broadcast.emit('message', {username: socket.username, message: message});
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('newUser', function(username) {
    socket.username = username;
  });
});