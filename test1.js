
// es6 on the client...
// we need a cleaner way to join this stuff up

var pg = require('pg');

pg.defaults.poolSize = 10;

// are we going to be text expansion?
// or argument expansion?

function test1() { 

  var conString = "postgres://meteo:meteo@127.0.0.1/contr_vocab_db?ssl=true";
  pg.connect(conString, (err, client, done) => {
    if(err) {
      console.error('error fetching client from pool', err);
    }

    var query1 = 'select * from responsible_party';
    var query  = 'select json_agg( row_to_json(a)) as result from ( ' + query1 + ') as a';

    client.query( query , function(err, result) {
      // call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      var result_ = result.rows[0].result;
      console.log( result_ );
      
      // process.exit();
    });
  });
}

// so what do we do here... and what are the functions...


// for responsible party
var t = {
  name:  'organisation_name',
  ref_field: 'organisation_id',
  ref_sub: 'name',          
  relation: 'organisation' ,
};

console.log( ` ${ t.name }` );

// es6

test1();

// close pool which will, finish everything
pg.end();

