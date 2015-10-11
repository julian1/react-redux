
var server = require('http').createServer()
  , url = require('url')
  , express = require('express')
  , app = express()
  , port = 8081
;

var path = require('path');
var fs = require('fs');

// https://github.com/rackt/react-router/blob/master/docs/guides/basics/Histories.md

// serves files index.html etc
// app.use('/', express.static(path.join(__dirname, 'dist')));

// serve static assets normally
app.use(express.static(__dirname + '/dist'))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))


app.get('/myendpoint', function(request, response){
  
  console.log(request.query); 

  response.send( { whoot: "123" });
})


// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function(request, response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})


server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });


