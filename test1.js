
// es6 on the client...
// we need a cleaner way to join this stuff up

var pg = require('pg');

pg.defaults.poolSize = 10;

// are we going to be text expansion?
// or argument expansion?

function test1( query_ ) { 

  var conString = "postgres://meteo:meteo@127.0.0.1/contr_vocab_db?ssl=true";
  pg.connect(conString, (err, client, done) => {
    if(err) {
      console.error('error fetching client from pool', err);
    }

    // var query1 = 'select * from responsible_party';
    var query = 'select json_agg( row_to_json(a)) as result from ( ' + query_ + ') as a';

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

let curry = (fn, ...args) => {
  let _curry = (args) =>
    args.length < fn.length
      ? (..._args) => _curry([...args, ..._args])
      : fn(...args);

  return _curry(args);
};

// for responsible party
const t = {
  name:  'organisation_name',
  field: 'organisation_id',
  for_relation: 'organisation' ,
  for_sub: 'name',          
};

const p = {
  name:  'person_name',
  field: 'person_id',
  for_relation: 'person' ,
  for_sub: 'name',          
};


const m = [ t, p ];

// might be easier
// ok, can we change this  

//     ${t.for_relation}.${ t.for_sub } as ${ t.name} 

//  join ${t.for_relation} on ${t.for_relation}.id = rp.${ t.field} 

// 

const query = `
  select 
    ${ m.map( key => key.for_relation + '.' + key.for_sub + ' as ' + key.name).reduce((l, r) => l + ',\n' +  r)   }
  from responsible_party rp

    ${ m.map( key => ' join ' + key.for_relation + ' on ' + key.for_relation + '.id = rp. ' + key.field ) .reduce((l, r) => l + '\n' +  r)  }
`;

console.log( '' + query );

// es6

test1( query);

// close pool which will, finish everything
pg.end();

