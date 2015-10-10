
// ok, lets try to get it running in the browser

 var React = require('react');
// import { createClass } from 'react';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from "react-redux";

import { Button, Alert } from 'react-bootstrap';
// import { fetch } from 'react-fetch';
import 'whatwg-fetch';
// require('es6-promise').polyfill();
// fetch(...);

// function counter(state = 0, action) {
function counter(state, action) {
  switch (action.type) {
  case 'INCREMENT':
    return Object.assign({}, state, {
      value: state.value + 1
    });
  case 'RESET':
    return Object.assign({}, state, {
      value: 0
    });
  default:
    return state;
  }
}

let initialState = (
  { value: 0 ,
    inputHandler : (a => console.log("my handler " + a))
  });

let store =  applyMiddleware(thunk)(createStore)(counter, initialState);

/*
var store = createStore(counter, (
  { value: 0 ,
    inputHandler : (a => console.log("my handler " + a))
  }) );
*/

store.subscribe( function() {
    // console.log(store.getState())
  }
);

// jquery async ? time
// this doSomething function can be put on the state

function doSomething(){
  store.dispatch({ type: 'INCREMENT' });
  // alert("Boom!");
  setTimeout(doSomething, 1000);
}

doSomething();

store.dispatch({ type: 'INITIAL_STATE' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
store.dispatch({ type: 'WHOOT' });

// ok, redux is neat.
// ok, lets try to fatten the model up. 
// should try to upgrade to react 0.14, which has support for refs  

// note that react-bootstrap is not an inline style approch.
// inline styles with javascript attributes are supported in react. could just use this.

function asyncAction() {  
 //  store.dispatch({ type: 'RESET' })

  fetch('https://www.reddit.com/r/worldnews.json')
  .then((response) => response.text())
  .then((responseText) => {
    console.log(responseText);
  })
  .catch((error) => {
    console.warn(error);
  });
}

const Inbox = React.createClass({
  render() {
    return (
      <div>
        <div>
          <h2>Inbox</h2>
          <h2>{this.props.value}</h2>
        </div>
        <div>
          <input onChange={ e => this.props.inputHandler(e.target.value) } />  
        </div>
        <div>
          <Button bsStyle="success" bsSize="medium" onClick={ () => store.dispatch({ type: 'RESET' }) } >Save</Button>
          <Button bsStyle="success" bsSize="medium" onClick={ () => store.dispatch( asyncAction ) } >Async Save</Button>
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
)(Inbox);


React.render((
  <Provider store={store}>
     {() => <App />}
  </Provider>
), document.body)


