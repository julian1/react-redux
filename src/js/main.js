
// ok, lets try to get it running in the browser

 var React = require('react');
// import { createClass } from 'react';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from "react-redux";
import { Button, Alert, Table } from 'react-bootstrap';
import 'whatwg-fetch';

// require('es6-promise').polyfill();
// fetch(...);


function reducer(state, action) {
  switch (action.type) {
    case 'INITIAL_STATE':
      // load initial state in an action, to allow including dispatch() binding in initial state 
      return action.state;
    case 'INCREMENT_COUNT':
      return Object.assign({}, state, { count: state.count + 1 });
    case 'RESET_COUNT':
      return Object.assign({}, state, { count: 0 });
    case 'GOT_CHILDREN':
      // console.log( action.children);
      return Object.assign({}, state, { children: action.children });

    case 'GOT_RP_ITEMS':
      return Object.assign({}, state, { items : action.items });

    default:
      return state;
  }
}


let store = applyMiddleware(thunk)(createStore)(reducer);

let initialState = ({ 
  dispatch: (a) => store.dispatch(a),
  count: 0, // change name counter...
  inputHandler : (a) => console.log("my handler " + a),
  children: [],
  items: []
});

store.dispatch({ type: 'INITIAL_STATE', state: initialState });


function doSomething(dispatch) {
  dispatch({ type: 'INCREMENT_COUNT' });
  setTimeout( () => dispatch(doSomething), 1000);            // this just sides inside the redux forever...
}


// initial...
store.dispatch( doSomething );

// should i be using store.dispatch() or have a globalish function dispatch() ?
// ok, redux is neat.
// ok, lets try to fatten the model up. 
// should try to upgrade to react 0.14, which has support for refs  

// IMPORTANT - we should pass dispatch explicity down as a prop - and avoid doing it for dumb-components. 

// note that react-bootstrap is not an inline style approch.
// inline styles with javascript attributes are supported in react. could just use this.

// actually we want to put it on the props...

function asyncAction(dispatch) {
  // important we get dispatch given to us...
  // console.log("we got dispatch " + dispatch );
  
  fetch('https://www.reddit.com/r/worldnews.json')
    .then((response) => response.json())
    .then((json) => {
      console.log(json.data.children[0].data.author);

      dispatch({ type: 'GOT_CHILDREN', children: json.data.children });
      // store.dispatch({ type: 'RESET_COUNT' })
    })
    .catch((error) => {
      console.warn(error);
    });
}


const Inbox = React.createClass({
  render() {

  var dispatch = this.props.dispatch;

  var commentNodes = this.props.children.map( (comment, i) => {
    return (
      <div key={i}>
        <span>{comment.data.title }</span>
        <span> - </span>
        <span>{comment.data.author}</span> 
      </div>
    );
  });

  return (
    <div>
      <div>
        <h2>Inbox</h2>
        <h2>{this.props.count}</h2>
      </div>
      <div>
        <input onChange={ e => this.props.inputHandler(e.target.value) } />  
      </div>
      <div>
        <Button bsStyle="success" bsSize="medium" onClick={ () => dispatch({ type: 'RESET_COUNT' }) } >Save</Button>
        <Button bsStyle="success" bsSize="medium" onClick={ () => dispatch( asyncAction ) } >Async Save</Button>
      </div>

      <div>{ commentNodes }</div>

    </div>
  )   
  }
})




function getData(dispatch) {
  // important we get dispatch given to us...
  // console.log("we got dispatch " + dispatch );

  // uggh no partial-application.
  // so we have the components...

  var query = `
      select 
        rp.id as rp_id, 
        p.name as person_name, 
        o.name as organisation_name ,
        p.id as person_id
      from responsible_party rp 
      join person p on p.id = rp.person_id
      join organisation o on o.id = rp.organisation_id
      order by rp.id
  ` 
 
  fetch('http://127.0.0.1:8081/myendpoint?query=' + encodeURIComponent(query ))
    .then((response) => response.json())
    .then((json) => {
      console.log(json );
      dispatch({ type: 'GOT_RP_ITEMS', items : json });
    })
    .catch((error) => {
      console.warn(error);
    });
}



const Form1 = React.createClass({

  componentDidMount() {
  //componentDidMount() {
    console.log('component did mount');
    // dispatch( getData ); 
  },

  render() {

  var dispatch = this.props.dispatch;

// table...
// uggh... 
// we have closures.... to construct .... can we do this in a nested way?


  var firstRowKeys = this.props.items.length > 0 ? Object.keys(this.props.items[0]) : [];

  var itemHeaders = firstRowKeys.map( function( key, i) { 
      return (
        <th key={i}>{ key} </th>
      );
    }); 
  // itemHeaders = 'whoot';

  var itemNodes = this.props.items.map( (item, i) => {

    // ok, we don't want the keys except for thead. 
    var keys = Object.keys(item);
    var values = keys.map(function(k) { return item[k]; });
    var valueNodes = values.map( (value, i) => {
      return (
        <td key={i} >{ value} </td>
      );
    }); 

    return (
    // TODO make it generic - hash to array
    // can always filter....
      <tr key={i}>
        { valueNodes }
      </tr>
    );
  });

  return (
    <div>
      <Table striped bordered condensed hover>
          <thead>
            <tr>
              { itemHeaders } 
            </tr>
          </thead>
          <tbody> 
            { itemNodes } 
          </tbody> 
      </Table>
      <div>
        <Button bsStyle="success" bsSize="medium" onClick={ () => dispatch( getData ) } >Async Save</Button>
      </div>
    </div>
  )   
  }
})




/*function mapStateToProps(state)  {
  return {
    value: state
  };
}*/

// need an identity function...

var App = connect(
  state => state
)(Form1);


React.render((
  <Provider store={store}>
     {() => <App />}
  </Provider>
), document.body)

// store.subscribe( () => console.log(store.getState()) );


// jquery async ? time
// this doSomething function can be put on the state

// should make this dispatchable...

