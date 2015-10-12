
var server = require('http').createServer()
  , url = require('url')
  , express = require('express')
  , app = express()
  , port = 8081

;

var path = require('path');
// var fs = require('fs');
var pg = require('pg');

var compress = require('compression');

// https://github.com/rackt/react-router/blob/master/docs/guides/basics/Histories.md

// serves files index.html etc
// app.use('/', express.static(path.join(__dirname, 'dist')));

app.use(compress()); 

// serve static assets normally
app.use(express.static(__dirname + '/dist'))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))


app.get('/myendpoint', function(request, response){
  
  console.log(request.query); 

  // we want a connection pool ...
  var conString = "postgres://meteo:meteo@127.0.0.1/contr_vocab_db?ssl=true";
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    var query  = 'select json_agg( row_to_json(a)) as result from ( ' + request.query.query + ') as a';

    // client.query('SELECT $1::int AS number', ['1'], function(err, result) {

    client.query( query , function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
  
      var result = result.rows[0].result;

/*      console.log( result.constructor === String );
      console.log( result.constructor === Array ); // it's been decomposed into an array
      console.log(result);
      //output: 1
*/
      // response.send( { "result": result } );  // want to set the type to json...
      response.send( result  );  // want to set the type to json...

      // ok, so we have to ensure it's json and send it...
    });
  });


  // response.send( { whoot: "123" });
})


// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function(request, response){
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})


server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });


