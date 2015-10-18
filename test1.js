
// es6 on the client...

var pg = require('pg');


function test1() { 

  var conString = "postgres://meteo:meteo@127.0.0.1/contr_vocab_db?ssl=true";
  pg.connect(conString, function(err, client, done) {
    if(err) {
      console.error('error fetching client from pool', err);
    }

    var query1 = 'select * from responsible_party';
    var query  = 'select json_agg( row_to_json(a)) as result from ( ' + query1 + ') as a';

    client.query( query , function(err, result) {
      // call `done()` to release the client back to the pool
      // this is just horrible...
      done();

      if(err) {
        return console.error('error running query', err);
      }
      var result_ = result.rows[0].result;
      console.log( result_ );
      
      process.exit();
    });
  });
}

test1();

